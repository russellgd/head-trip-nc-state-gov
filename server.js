const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, 'public')));

// ============ GAME DATA ============
const ROUNDS = require('./gamedata.json');

// ============ ROOM MANAGEMENT ============
const rooms = new Map();

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return rooms.has(code) ? generateCode() : code;
}

function getHead(round, qIdx, tripperRotation) {
    const q = round.questions[qIdx];
    if (q.pairedHeadIndices && q.pairedHeadIndices.length > 0) {
        const idx = tripperRotation % q.pairedHeadIndices.length;
        return round.heads[q.pairedHeadIndices[idx]];
    }
    return round.heads[qIdx % round.heads.length];
}

function getTripper(room) {
    return room.players[room.tripperIdx % room.players.length];
}

function broadcastState(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;

    const round = room.selectedRounds.length > 0
        ? ROUNDS[room.selectedRounds[room.rIdx]]
        : null;
    const question = round ? round.questions[room.qIdx] : null;
    const head = round ? getHead(round, room.qIdx, room.tripperIdx) : null;
    const tripper = room.players.length > 0 ? getTripper(room) : null;

    // Count total questions
    const totalQs = room.selectedRounds.reduce((s, ri) => s + ROUNDS[ri].questions.length, 0);
    const currentQNum = room.selectedRounds.slice(0, room.rIdx).reduce((s, ri) => s + ROUNDS[ri].questions.length, 0) + room.qIdx + 1;

    // Check if all eligible voters have voted
    const voters = room.players.filter(p => p.name !== (tripper ? tripper.name : ''));
    const eligibleVoters = voters.filter(p => p.chips > 0);
    const allVoted = eligibleVoters.length > 0 && eligibleVoters.every(p => room.votes[p.name] !== undefined);

    // Per-player state
    room.players.forEach(p => {
        const socket = io.sockets.sockets.get(p.socketId);
        if (!socket) return;

        const isTripper = tripper && p.name === tripper.name;
        const myVote = room.votes[p.name] || null;

        socket.emit('state', {
            phase: room.phase,
            roomCode: roomCode,
            players: room.players.map(pl => ({
                name: pl.name,
                chips: pl.chips,
                isHost: pl.isHost,
                connected: io.sockets.sockets.has(pl.socketId)
            })),
            me: p.name,
            isHost: p.isHost,
            isTripper: isTripper,
            tripper: tripper ? tripper.name : null,
            round: round ? { title: round.title, theme: round.theme } : null,
            question: question ? {
                title: question.title,
                scenario: question.scenario,
                choices: question.choices,
                debrief: question.debrief
            } : null,
            head: head,
            totalQs: totalQs,
            currentQNum: currentQNum,
            debateTime: room.debateTime,
            timerRemaining: room.timerRemaining,
            selectedRounds: room.selectedRounds,
            availableRounds: ROUNDS.map((r, i) => ({
                id: i,
                title: r.title,
                theme: r.theme,
                heads: r.heads.map(h => h.name)
            })),
            // Tripper-specific
            tripperLocked: room.tripperAnswer !== null,
            myTripperAnswer: isTripper ? room.tripperAnswer : null,
            // Voting
            myVote: myVote,
            votesIn: Object.keys(room.votes).length,
            totalEligibleVoters: eligibleVoters.length,
            allVoted: allVoted,
            canVote: !isTripper && p.chips > 0,
            // Reveal data
            revealData: room.phase === 'reveal' ? {
                tripperAnswer: room.tripperAnswer,
                votes: room.votes,
                chipChanges: room.lastChipChanges || {},
                allCorrect: room.lastAllCorrect || false,
                allWrong: room.lastAllWrong || false
            } : null,
            // Final
            results: room.phase === 'final' ? room.results : [],
            isLastQuestion: round ? (room.rIdx === room.selectedRounds.length - 1 && room.qIdx === round.questions.length - 1) : false
        });
    });
}

// ============ SOCKET HANDLERS ============

io.on('connection', (socket) => {
    let currentRoom = null;
    let playerName = null;

    socket.emit('connected', { rounds: ROUNDS.map((r, i) => ({ id: i, title: r.title, theme: r.theme })) });

    socket.on('create-room', (data) => {
        const code = generateCode();
        const room = {
            code: code,
            players: [{
                name: data.name,
                socketId: socket.id,
                chips: 3,
                isHost: true
            }],
            phase: 'lobby',
            selectedRounds: [],
            rIdx: 0,
            qIdx: 0,
            tripperIdx: 0,
            tripperAnswer: null,
            votes: {},
            debateTime: data.debateTime || 90,
            timerRemaining: 0,
            timerInterval: null,
            results: [],
            lastChipChanges: {},
            lastAllCorrect: false,
            lastAllWrong: false
        };
        rooms.set(code, room);
        currentRoom = code;
        playerName = data.name;
        socket.join(code);
        broadcastState(code);
    });

    socket.on('join-room', (data) => {
        const room = rooms.get(data.code);
        if (!room) {
            socket.emit('error-msg', { message: 'Room not found. Check the code and try again.' });
            return;
        }
        if (room.players.length >= 7) {
            socket.emit('error-msg', { message: 'Room is full (max 7 players).' });
            return;
        }
        if (room.phase !== 'lobby') {
            // Allow reconnection if name matches
            const existing = room.players.find(p => p.name === data.name);
            if (existing) {
                existing.socketId = socket.id;
                currentRoom = data.code;
                playerName = data.name;
                socket.join(data.code);
                broadcastState(data.code);
                return;
            }
            socket.emit('error-msg', { message: 'Game already in progress.' });
            return;
        }
        if (room.players.some(p => p.name === data.name)) {
            socket.emit('error-msg', { message: 'That name is already taken in this room.' });
            return;
        }
        room.players.push({
            name: data.name,
            socketId: socket.id,
            chips: 3,
            isHost: false
        });
        currentRoom = data.code;
        playerName = data.name;
        socket.join(data.code);
        broadcastState(data.code);
    });

    socket.on('update-settings', (data) => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'lobby') return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player || !player.isHost) return;
        if (data.debateTime) room.debateTime = data.debateTime;
        if (data.selectedRounds) room.selectedRounds = data.selectedRounds.sort((a, b) => a - b);
        broadcastState(currentRoom);
    });

    socket.on('start-game', () => {
        const room = rooms.get(currentRoom);
        if (!room) return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player || !player.isHost) return;
        if (room.players.length < 3 || room.selectedRounds.length === 0) return;

        room.phase = 'tripper-lockin';
        room.rIdx = 0;
        room.qIdx = 0;
        room.tripperIdx = 0;
        room.tripperAnswer = null;
        room.votes = {};
        room.results = [];
        room.players.forEach(p => p.chips = 3);
        broadcastState(currentRoom);
    });

    socket.on('lock-in', (data) => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'tripper-lockin') return;
        const tripper = getTripper(room);
        if (!tripper || tripper.socketId !== socket.id) return;
        room.tripperAnswer = data.answer;
        room.phase = 'debate';
        room.timerRemaining = room.debateTime;
        // Start server-side timer
        clearInterval(room.timerInterval);
        room.timerInterval = setInterval(() => {
            room.timerRemaining--;
            if (room.timerRemaining <= 0) {
                clearInterval(room.timerInterval);
                room.timerInterval = null;
                room.phase = 'voting';
                room.votes = {};
            }
            broadcastState(currentRoom);
        }, 1000);
        broadcastState(currentRoom);
    });

    socket.on('skip-to-voting', () => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'debate') return;
        clearInterval(room.timerInterval);
        room.timerInterval = null;
        room.timerRemaining = 0;
        room.phase = 'voting';
        room.votes = {};
        broadcastState(currentRoom);
    });

    socket.on('vote', (data) => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'voting') return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player) return;
        const tripper = getTripper(room);
        if (player.name === tripper.name) return; // tripper can't vote
        if (player.chips <= 0) return; // can't vote without chips
        room.votes[player.name] = data.answer;

        // Check if all eligible voters have voted
        const eligibleVoters = room.players.filter(p =>
            p.name !== tripper.name && p.chips > 0
        );
        const allVoted = eligibleVoters.every(p => room.votes[p.name] !== undefined);

        if (allVoted) {
            // Auto-reveal
            doReveal(room, currentRoom);
        } else {
            broadcastState(currentRoom);
        }
    });

    socket.on('force-reveal', () => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'voting') return;
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player || !player.isHost) return;
        doReveal(room, currentRoom);
    });

    socket.on('next-question', () => {
        const room = rooms.get(currentRoom);
        if (!room || room.phase !== 'reveal') return;

        const round = ROUNDS[room.selectedRounds[room.rIdx]];

        if (room.qIdx < round.questions.length - 1) {
            room.qIdx++;
        } else if (room.rIdx < room.selectedRounds.length - 1) {
            room.rIdx++;
            room.qIdx = 0;
        } else {
            room.phase = 'final';
            broadcastState(currentRoom);
            return;
        }

        room.tripperIdx = (room.tripperIdx + 1) % room.players.length;
        room.tripperAnswer = null;
        room.votes = {};
        room.lastChipChanges = {};
        room.phase = 'tripper-lockin';
        broadcastState(currentRoom);
    });

    socket.on('play-again', () => {
        const room = rooms.get(currentRoom);
        if (!room) return;
        room.phase = 'lobby';
        room.selectedRounds = [];
        room.players.forEach(p => p.chips = 3);
        room.results = [];
        broadcastState(currentRoom);
    });

    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom);
            if (room) {
                // Don't remove player, just mark disconnected via socketId
                // This allows reconnection
                broadcastState(currentRoom);

                // Clean up empty rooms after 5 minutes
                setTimeout(() => {
                    const r = rooms.get(currentRoom);
                    if (r && r.players.every(p => !io.sockets.sockets.has(p.socketId))) {
                        clearInterval(r.timerInterval);
                        rooms.delete(currentRoom);
                    }
                }, 300000);
            }
        }
    });
});

function doReveal(room, roomCode) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;

    const tripper = getTripper(room);
    const voters = room.players.filter(p => p.name !== tripper.name && p.chips > 0);
    const chipChanges = {};

    // Score each voter
    let correctCount = 0;
    let totalVoters = 0;
    voters.forEach(p => {
        const vote = room.votes[p.name];
        if (vote !== undefined) {
            totalVoters++;
            if (vote === room.tripperAnswer) {
                // Correct - gain a chip
                p.chips += 1;
                chipChanges[p.name] = 1;
                correctCount++;
            } else {
                // Wrong - lose a chip
                p.chips = Math.max(0, p.chips - 1);
                chipChanges[p.name] = -1;
            }
        }
    });

    const allCorrect = totalVoters > 0 && correctCount === totalVoters;
    const allWrong = totalVoters > 0 && correctCount === 0;

    // Tripper bonus/penalty
    if (allCorrect) {
        tripper.chips += 2;
        chipChanges[tripper.name] = 2;
    } else if (allWrong) {
        tripper.chips = Math.max(0, tripper.chips - 2);
        chipChanges[tripper.name] = -2;
    } else {
        chipChanges[tripper.name] = 0;
    }

    room.lastChipChanges = chipChanges;
    room.lastAllCorrect = allCorrect;
    room.lastAllWrong = allWrong;

    // Record result
    room.results.push({
        tripper: tripper.name,
        tripperAnswer: room.tripperAnswer,
        votes: { ...room.votes },
        allCorrect,
        allWrong,
        correctCount,
        totalVoters
    });

    room.phase = 'reveal';
    broadcastState(roomCode);
}

// ============ START ============

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Head Trip server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
