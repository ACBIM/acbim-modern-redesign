'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { COMPANY_PHONE_E164 } from '@/lib/site'

type PhoneRevealLinkProps = {
  phoneDisplay?: string
  buttonLabel?: string
  linkClassName?: string
  buttonClassName?: string
}

export default function PhoneRevealLink({
  phoneDisplay = '06 43 20 04 76',
  buttonLabel = 'Afficher le numero',
  linkClassName = '',
  buttonClassName = '',
}: PhoneRevealLinkProps) {
  const [showPhone, setShowPhone] = useState(false)

  if (showPhone) {
    return (
      <a href={`tel:${COMPANY_PHONE_E164}`} className={linkClassName}>
        {phoneDisplay}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent('contact_phone_reveal')
        setShowPhone(true)
      }}
      className={buttonClassName}
    >
      {buttonLabel}
    </button>
  )
}
