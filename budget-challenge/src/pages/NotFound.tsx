import { Link } from 'react-router-dom'
import { Page } from '../components/Page'

export function NotFound() {
  return (
    <Page title="Page not found" lede="That address does not match a page in this project.">
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/overview">
            Budget Overview
          </Link>
        </li>
        <li>
          <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/challenge">
            The Challenge
          </Link>
        </li>
        <li>
          <Link
            className="font-medium text-carolina-600 underline underline-offset-2"
            to="/methodology"
          >
            Methodology and Sources
          </Link>
        </li>
      </ul>
    </Page>
  )
}
