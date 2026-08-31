import { NavLink, Outlet } from 'react-router-dom'
import { DATASET } from '../data'
import { GeographyBand } from './GeographyBand'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/overview', label: 'Budget Overview' },
  { to: '/challenge', label: 'Challenge' },
  { to: '/results', label: 'Results' },
  { to: '/methodology', label: 'Methodology & Sources' },
  { to: '/glossary', label: 'Glossary' },
]

function navClass({ isActive }: { isActive: boolean }): string {
  const base =
    'inline-block rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
    'hover:bg-navy-700 focus-visible:bg-navy-700'
  // The active page is marked by aria-current as well as by weight and an
  // underline, so it is never colour alone that says where you are.
  return isActive
    ? `${base} bg-navy-700 text-white underline decoration-gold-500 decoration-2 underline-offset-4`
    : `${base} text-navy-100`
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link no-print" href="#main">
        Skip to main content
      </a>

      <header className="bg-navy-900 text-white no-print">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <NavLink
              to="/"
              className="font-serif text-lg font-semibold text-white sm:text-xl"
            >
              The North Carolina Budget Challenge
            </NavLink>
            <p className="text-xs text-navy-100">
              An independent educational project &middot; {DATASET.baseline.fiscalYear} General Fund
            </p>
          </div>

          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <GeographyBand className="h-5 w-full text-gold-500" />
      </header>

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      <footer className="mt-16 border-t-4 border-gold-500 bg-navy-900 text-navy-100 no-print">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-serif text-lg text-white">Independent educational project</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed">
            This simulation is not a publication of the State of North Carolina, the General
            Assembly, the Office of State Budget and Management, or any state agency, and it is not
            affiliated with or endorsed by any of them. It is a teaching tool built from public
            documents. It simplifies a budget that is genuinely complicated, and it is not a source
            for official figures. For those, read the documents cited on the{' '}
            <a className="font-medium text-white underline decoration-gold-500 underline-offset-2" href="#/methodology">
              methodology and sources
            </a>{' '}
            page.
          </p>

          <div className="mt-6 flex flex-col gap-2 border-t border-navy-700 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              Data verified through{' '}
              <strong className="font-semibold text-white">{DATASET.baseline.verifiedThrough}</strong>{' '}
              &middot; dataset version {DATASET.version}
            </p>
            <p>
              No accounts, no tracking, and no personal information is collected. Your answers stay
              in this browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
