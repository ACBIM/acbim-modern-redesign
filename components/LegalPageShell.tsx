import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LegalPageShellProps {
  title: string
  description: string
  updatedAt: string
  children: ReactNode
}

export default function LegalPageShell({ title, description, updatedAt, children }: LegalPageShellProps) {
  return (
    <>
      <Header />
      <main className="bg-slate-50 pt-20 text-slate-800">
        <section className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Informations legales</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold text-slate-950 md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{description}</p>
            <p className="mt-5 text-sm text-slate-500">Derniere mise a jour : {updatedAt}</p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-14">
          <div className="mx-auto max-w-4xl space-y-10 text-base leading-7 text-slate-700">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  )
}
