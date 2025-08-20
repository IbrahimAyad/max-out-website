'use client'

/**
 * Accessibility Skip Links Component
 * 
 * Provides keyboard navigation shortcuts that are:
 * - Hidden by default (sr-only)
 * - Visible only when focused via keyboard
 * - Properly positioned and styled for luxury brand aesthetic
 * - WCAG 2.1 AA compliant
 */
export function SkipLinks() {
  return (
    <div className="sr-only">
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="skip-link"
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className="skip-link"
      >
        Skip to footer
      </a>
    </div>
  )
}