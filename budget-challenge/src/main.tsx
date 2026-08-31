import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { DATASET, errorsOnly, validateDataset } from './data'
import { ChallengeProvider } from './lib/challenge'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Overview } from './pages/Overview'
import { Challenge } from './pages/Challenge'
import { Results } from './pages/Results'
import { Methodology } from './pages/Methodology'
import { Glossary } from './pages/Glossary'
import { ScrollToTop } from './components/ScrollToTop'
import { NotFound } from './pages/NotFound'

// A data edit that breaks an invariant should be loud in development rather
// than quietly producing wrong figures. The same rules run in the test suite,
// so this is a second line rather than the only one.
if (import.meta.env.DEV) {
  const errors = errorsOnly(validateDataset(DATASET))
  if (errors.length > 0) {
    console.error('Budget dataset failed validation:', errors)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      Hash routing so the built app can be served from any static host, and from
      a subdirectory, with no server rewrite rules.
    */}
    <HashRouter>
      <ChallengeProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="overview" element={<Overview />} />
            <Route path="challenge" element={<Challenge />} />
            <Route path="results" element={<Results />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ChallengeProvider>
    </HashRouter>
  </StrictMode>,
)
