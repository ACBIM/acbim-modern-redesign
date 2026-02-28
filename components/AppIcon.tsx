import type { ComponentProps, JSX } from 'react'
import type { IconKey } from '@/types'

type SvgProps = ComponentProps<'svg'>

const iconMap: Record<IconKey, (props: SvgProps) => JSX.Element> = {
  cube: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  camera: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'cloud-pc': (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.5 20c-1.5 0-2.8-.5-3.9-1.6C1.5 17.4 1 16.1 1 14.6c0-1.3.4-2.5 1.2-3.5.8-1 1.8-1.7 3.1-2 .4-1.5 1.3-2.8 2.5-3.7C9 4.5 10.4 4 12 4c2 0 3.6.7 5 2 1.4 1.4 2 3 2 5 1.2.1 2.1.6 2.9 1.5.8.9 1.1 1.9 1.1 3 0 1.3-.4 2.3-1.3 3.2-.9.9-1.9 1.3-3.2 1.3M6.5 18h12c.7 0 1.3-.2 1.8-.7.5-.5.7-1.1.7-1.8 0-.7-.2-1.3-.7-1.8-.5-.5-1.1-.7-1.8-.7H17v-2c0-1.4-.5-2.6-1.5-3.5-1-1-2.2-1.5-3.5-1.5-1.4 0-2.6.5-3.5 1.5C7.5 8.4 7 9.6 7 11H6.5c-1 0-1.8.3-2.5 1-.7.7-1 1.5-1 2.5s.3 1.8 1 2.5c.7.7 1.5 1 2.5 1z" />
      <path d="M10.7 13.2c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.5-.5-1-1-1M8.6 11.2c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.6-.4-1-1-1M8.6 15.3c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.6-.4-1-1-1M14.8 11.2c.6 0 1-.5 1-1 0-.6-.5-1-1-1s-1 .5-1 1c0 .5.4 1 1 1M12.7 15.3c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.6-.5-1-1-1M14.8 13.2c-.6 0-1 .5-1 1 0 .6.5 1 1 1s1-.5 1-1c0-.5-.4-1-1-1M12.7 11.2c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.6-.5-1-1-1M10.7 9.1c-.6 0-1 .5-1 1 0 .6.5 1 1 1 .6 0 1-.5 1-1 0-.5-.5-1-1-1z" />
    </svg>
  ),
  scan: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v.01M5 21v.01M19 3v.01M19 21v.01M3 5h.01M21 5h.01M3 19h.01M21 19h.01M12 4a8 8 0 018 8h-4a4 4 0 10-8 0H4a8 8 0 018-8z" />
    </svg>
  ),
  collection: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M0 0h4.651l3.126 2.084l-.554.832L4.349 1H1v13h5V8H4V7h5v1H7v6h7V8h-2V7h2V1h-4V0h5v15H0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  drone: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5.667 13.228a1 1 0 0 1 .774 1.84l-.108.046A2.001 2.001 0 1 0 8.83 17.81l.057-.143a1 1 0 1 1 1.885.666a4.001 4.001 0 1 1-5.105-5.105m12.666 0a4.001 4.001 0 1 1-5.105 5.105a1 1 0 0 1 1.84-.774l.046.108a2.001 2.001 0 1 0 2.696-2.497l-.143-.056a1 1 0 1 1 .666-1.886M8.011 6.64l.103.07l2.658 2.068a2 2 0 0 0 2.317.099l.139-.099l2.658-2.067a1 1 0 0 1 1.474 1.3l-.07.103l-2.068 2.658a2 2 0 0 0-.099 2.317l.099.139l2.067 2.658a1 1 0 0 1-1.3 1.474l-.103-.07l-2.658-2.068a2 2 0 0 0-2.317-.099l-.139.099l-2.658 2.067a1 1 0 0 1-1.474-1.3l.07-.103l2.068-2.658a2 2 0 0 0 .099-2.317l-.099-.139l-2.067-2.658a1 1 0 0 1 1.192-1.53zM17 3a4 4 0 0 1 1.333 7.772a1 1 0 0 1-.774-1.84l.108-.046A2.001 2.001 0 1 0 15.17 6.19l-.056.143a1 1 0 0 1-1.886-.666A4 4 0 0 1 17 3M7 3a4 4 0 0 1 3.772 2.667a1 1 0 0 1-1.84.774l-.046-.108A2.001 2.001 0 1 0 6.19 8.83l.143.057a1 1 0 0 1-.666 1.885A4.001 4.001 0 0 1 7 3" />
    </svg>
  ),
  'virtual-tour': (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 8.1c-.3-.1-.7-.3-1-.4C19.4 4.3 16 2 12 2S4.6 4.3 3 7.7c-.3.1-.7.3-.9.4C1.4 8.5 1 9.2 1 9.9v4.2c0 .7.4 1.4 1 1.8c.3.1.7.3 1 .4c1.6 3.4 5 5.7 9 5.7s7.4-2.3 9-5.7c.3-.1.6-.3.9-.5c.6-.4 1.1-1 1.1-1.8V9.9c0-.7-.4-1.4-1-1.8m-1 1.8v4.2c-2.2 1.2-5.5 1.9-9 1.9s-6.8-.7-9-1.9V9.9C5.2 8.7 8.5 8 12 8s6.8.7 9 1.9M12 4c2.4 0 4.5 1 6 2.7c-1.8-.5-3.9-.7-6-.7s-4.2.2-5.9.7C7.5 5 9.6 4 12 4m0 16c-2.4 0-4.5-1-5.9-2.7c1.7.5 3.8.7 5.9.7s4.2-.2 6-.7C16.5 19 14.4 20 12 20" />
    </svg>
  ),
  'reno-energetique': (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M13 30a11 11 0 0 1 0-22a1 1 0 0 1 1 1v9h9a1 1 0 0 1 1 1a11 11 0 0 1-11 11m-1-19.94A9 9 0 1 0 21.94 20H14a2 2 0 0 1-2-2Z" />
      <path d="M28 14h-9a2 2 0 0 1-2-2V3a1 1 0 0 1 1-1a11 11 0 0 1 11 11a1 1 0 0 1-1 1m-9-2h7.94A9 9 0 0 0 19 4.06Z" />
    </svg>
  ),
  'clipboard-list': (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  cog: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'document-download': (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

interface AppIconProps {
  name: IconKey
  className?: string
}

export default function AppIcon({ name, className }: AppIconProps) {
  const IconComponent = iconMap[name]
  return <IconComponent className={className ?? 'h-12 w-12 text-[#ee7527]'} />
}
