import { COMPANY_PHONE_E164 } from '@/lib/site'

type PhoneRevealLinkProps = {
  phoneDisplay?: string
  buttonLabel?: string
  linkClassName?: string
  buttonClassName?: string
}

// Numéro de téléphone affiché en clair et directement cliquable (clic-pour-appeler).
// Le clic sur un lien tel: est suivi par le handler global d'AnalyticsManager
// (événement contact_phone_click), inutile de le tracker ici (évite le double comptage).
export default function PhoneRevealLink({
  phoneDisplay = '06 43 20 04 76',
  linkClassName = '',
}: PhoneRevealLinkProps) {
  return (
    <a href={`tel:${COMPANY_PHONE_E164}`} className={linkClassName}>
      {phoneDisplay}
    </a>
  )
}
