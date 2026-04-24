'use client'

import type { ReactNode } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/site'

interface CookiePreferencesButtonProps {
  children?: ReactNode
  className?: string
}

export default function CookiePreferencesButton({
  children = 'Gerer mes preferences cookies',
  className = '',
}: CookiePreferencesButtonProps) {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event('acbim:open-cookie-preferences'))}
    >
      {children}
    </button>
  )
}
