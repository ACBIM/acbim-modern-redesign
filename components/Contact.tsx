'use client'

import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import PhoneRevealLink from '@/components/PhoneRevealLink'
import { trackLeadFormSubmit } from '@/lib/analytics'
import { BASE_PATH, COMPANY_ADDRESS, COMPANY_EMAIL } from '@/lib/site'

interface ContactProps {
  headingTag?: 'h1' | 'h2'
}

type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error'

const CONTACT_FORM_ENDPOINT_OVERRIDE = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim() || ''
const CONTACT_FORM_ENDPOINT = CONTACT_FORM_ENDPOINT_OVERRIDE || `${BASE_PATH || ''}/contact.php`

export default function Contact({ headingTag = 'h2' }: ContactProps) {
  const HeadingTag = headingTag
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<ContactFormStatus>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [formStartedAt, setFormStartedAt] = useState('')
  const [originUrl, setOriginUrl] = useState('')

  useEffect(() => {
    setFormStartedAt(String(Date.now()))
    setOriginUrl(window.location.href)
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    if (!formData.get('form_started_at') && formStartedAt) {
      formData.set('form_started_at', formStartedAt)
    }

    if (!formData.get('origin_url') && originUrl) {
      formData.set('origin_url', originUrl)
    }

    setStatus('submitting')
    setFeedbackMessage('Envoi en cours...')

    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.toLowerCase().includes('application/json')) {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          throw new Error("Le script PHP n'est pas execute en local avec Next.js. Le formulaire sera operationnel sur l'hebergement OVH.")
        }
        throw new Error('Reponse serveur invalide. Merci de reessayer ou de nous contacter par email.')
      }

      const payload = (await response.json()) as { ok?: boolean; message?: string }

      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.message || 'Impossible d envoyer le message pour le moment.')
      }

      setStatus('success')
      setFeedbackMessage(payload.message || 'Message envoye. Nous revenons vers vous rapidement.')
      trackLeadFormSubmit()
      form.reset()
      setFormStartedAt(String(Date.now()))
      if (typeof window !== 'undefined') {
        setOriginUrl(window.location.href)
      }
    } catch (error) {
      setStatus('error')
      setFeedbackMessage(error instanceof Error ? error.message : 'Une erreur est survenue. Merci de reessayer.')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <section id="contact" className="bg-slate-900 py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <HeadingTag className="text-3xl font-bold md:text-4xl">Contactez-Nous</HeadingTag>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Une question ? Un projet ? N'hesitez pas a nous contacter, nous serons ravis d'echanger avec vous.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
        </div>

        <div className="mx-auto max-w-4xl rounded-lg bg-white/5 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#ee7527]">Contact</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Email</p>
                  <a href={`mailto:${COMPANY_EMAIL}`} className="mt-1 inline-block hover:text-white">
                    {COMPANY_EMAIL}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Telephone</p>
                  <div className="mt-1">
                    <PhoneRevealLink
                      linkClassName="inline-block text-lg font-semibold tracking-wider text-slate-200 hover:text-white"
                      buttonClassName="rounded-md bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-600"
                    />
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#ee7527]">Adresse postale</h3>
              <div className="text-sm leading-relaxed text-slate-300">
                <p>{COMPANY_ADDRESS.streetAddress}</p>
                <p>
                  {COMPANY_ADDRESS.postalCode} {COMPANY_ADDRESS.addressLocality}
                </p>
                <p className="mt-2 text-slate-400">Auvergne-Rhone-Alpes</p>
              </div>
            </article>

            <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5 text-center">
              <h3 className="mb-3 text-lg font-bold text-[#ee7527]">Horaires</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p className="font-medium text-white">Du lundi au vendredi</p>
                <p>8h a 12h</p>
                <p>14h a 18h</p>
              </div>
            </article>
          </div>

          <form
            ref={formRef}
            action={CONTACT_FORM_ENDPOINT}
            method="post"
            acceptCharset="UTF-8"
            onSubmit={handleSubmit}
            className="relative"
          >
            <input type="hidden" name="form_started_at" value={formStartedAt} readOnly />
            <input type="hidden" name="origin_url" value={originUrl} readOnly />

            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Site web</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={120}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ee7527]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={180}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ee7527]"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  minLength={3}
                  maxLength={180}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ee7527]"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={5000}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ee7527]"
                />
              </div>
            </div>

            {status !== 'idle' ? (
              <div
                className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                  status === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : status === 'error'
                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                      : 'border-slate-500/40 bg-slate-700/40 text-slate-100'
                }`}
                role="status"
                aria-live="polite"
              >
                {feedbackMessage}
              </div>
            ) : null}

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="transform rounded-full bg-[#ee7527] px-12 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#d9661f] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Formulaire securise ACBIM. Vous pouvez aussi ecrire a {COMPANY_EMAIL}.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
