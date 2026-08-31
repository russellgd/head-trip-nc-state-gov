// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The interface must not state a dollar amount of its own.
 *
 * Every figure a visitor sees has to come from the data layer, where it carries
 * a citation and a verification status. A number typed directly into a
 * component would appear on screen with no source behind it and no way for the
 * validator to catch it, which is exactly the failure this project is trying to
 * avoid.
 */

/** The src directory. Vitest runs from the project root. */
const ROOT = join(process.cwd(), 'src') + '/'

function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      out.push(...sourceFiles(path))
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      out.push(path)
    }
  }
  return out
}

/** "$1,000,000", "$34,374,286,763", "$500" — a currency amount written literally. */
const WRITTEN_DOLLARS = /\$\s?\d[\d,]*(?:\.\d+)?/g

/** A bare numeric literal big enough to be a budget figure: 1,000,000 or more. */
const BIG_NUMBER = /(?<![\w.])\d[\d_]{6,}(?![\w.])/g

/**
 * "$0" is allowed. It appears only in explanatory prose and in comments about
 * why an unsourced option is never shown as zero, and a zero cannot
 * misrepresent a budget figure the way a specific amount can.
 */
const ALLOWED_IN_PROSE = new Set(['$0'])

describe('the interface states no dollar amount of its own', () => {
  const files = [...sourceFiles(join(ROOT, 'components')), ...sourceFiles(join(ROOT, 'pages'))]

  it('finds component and page files to scan', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it('contains no written currency amounts outside the data layer', () => {
    const offenders: string[] = []

    for (const file of files) {
      const contents = readFileSync(file, 'utf8')
      for (const match of contents.match(WRITTEN_DOLLARS) ?? []) {
        if (!ALLOWED_IN_PROSE.has(match)) {
          offenders.push(`${file.replace(ROOT, '')}: ${match}`)
        }
      }
    }

    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('contains no numeric literal large enough to be a budget figure', () => {
    const offenders: string[] = []

    for (const file of files) {
      const contents = readFileSync(file, 'utf8')
      for (const match of contents.match(BIG_NUMBER) ?? []) {
        offenders.push(`${file.replace(ROOT, '')}: ${match}`)
      }
    }

    expect(offenders, offenders.join('\n')).toEqual([])
  })
})
