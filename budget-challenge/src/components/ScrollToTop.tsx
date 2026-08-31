import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Return to the top of the document on navigation.
 *
 * Respects a reduced-motion preference by jumping rather than smooth-scrolling,
 * and the global stylesheet disables smooth scrolling for those users anyway.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
