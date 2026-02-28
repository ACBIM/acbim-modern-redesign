type ProcessCardProps = {
  step: string
  title: string
  children: React.ReactNode
  highlight?: boolean
}

const mesuresItems = [
  'Laser scanner -> releve nuage 3D',
  'Station -> releve de points',
  'GPS -> releve georeference',
  'Drone -> releve aerien',
  'Camera + app photo -> releve images',
] as const

const donneesItems = ['Tablette', 'Video', 'Photo', 'Recolte de donnee in situ'] as const

const consolidationItems = [
  'Calage / nettoyage : nuage de points 3D',
  'Recuperation des donnees appareils',
  'Referencement dans le systeme projet',
] as const

const dessin3DItems = ['Maquette numerique', 'Plan topo (MNT)', 'Objet maille'] as const
const dessin2DItems = ['Plan', 'Coupe', 'Elevations'] as const

const exportItems = [
  'Points de georeferencement',
  'Tableau de donnees',
  'Points topographiques',
  'Nuage de points 3D (lidar ou photogrammetrie)',
] as const

const controleItems = ['Controle de fichier', 'Corrections'] as const

function OrangePill({ label, large = false }: { label: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-white/90 bg-[#ee7527] font-bold text-white shadow-[0_8px_24px_rgba(238,117,39,0.24)] ${
        large ? 'px-4 py-2 text-base md:text-lg' : 'px-3 py-1.5 text-sm'
      }`}
    >
      {label}
    </span>
  )
}

function ProcessCard({ step, title, children, highlight = false }: ProcessCardProps) {
  return (
    <article
      className={`rounded-xl border p-4 md:p-5 ${
        highlight
          ? 'border-[#ee7527]/40 bg-gradient-to-br from-[#ee7527]/15 via-[#ee7527]/8 to-transparent'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-white/80">
          {step}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">{title}</h3>
      </div>
      {children}
    </article>
  )
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-200">
          <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ee7527]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function IndustryProcessSynoptique() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm md:p-6">
      <div className="mb-5 text-center xl:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Processus de production</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-800 md:text-3xl">Synoptique des livrables</h2>
        <p className="mx-auto mt-3 max-w-4xl text-slate-600 xl:mx-0">
          De la capture terrain au livrable final, visualisez en un coup d oeil comment ACBIM transforme les releves en plans, maquettes et
          exports prets a exploiter pour la maintenance, la GMAO et les reamenagements de sites industriels.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-black via-slate-950 to-black p-4 shadow-xl md:p-5">
        <div className="grid gap-4 xl:grid-cols-3">
          <ProcessCard step="1" title="Acquisition terrain">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/35 p-3">
                <div className="mb-3">
                  <OrangePill label="Mesures" />
                </div>
                <BulletList items={mesuresItems} />
              </div>
              <div className="rounded-lg border border-white/10 bg-black/35 p-3">
                <div className="mb-3">
                  <OrangePill label="Donnees" />
                </div>
                <BulletList items={donneesItems} />
              </div>
            </div>
          </ProcessCard>

          <ProcessCard step="2" title="Consolidation">
            <div className="rounded-lg border border-white/10 bg-black/35 p-3">
              <div className="mb-3">
                <OrangePill label="Consolidation des donnees terrain" />
              </div>
              <BulletList items={consolidationItems} />
            </div>
          </ProcessCard>

          <ProcessCard step="3" title="Dessin">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/35 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <OrangePill label="Dessin" />
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white/80">3D</span>
                </div>
                <BulletList items={dessin3DItems} />
              </div>
              <div className="rounded-lg border border-white/10 bg-black/35 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <OrangePill label="Dessin" />
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white/80">2D</span>
                </div>
                <BulletList items={dessin2DItems} />
              </div>
            </div>
          </ProcessCard>

          <ProcessCard step="4" title="Export">
            <div className="rounded-lg border border-white/10 bg-black/35 p-3">
              <div className="mb-3">
                <OrangePill label="Export base dessin" />
              </div>
              <BulletList items={exportItems} />
            </div>
          </ProcessCard>

          <ProcessCard step="5" title="Controle de fichier et corrections">
            <div className="grid gap-3 sm:grid-cols-2">
              {controleItems.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-black/35 p-3">
                  <div className="mb-2">
                    <OrangePill label={item} />
                  </div>
                  {item === 'Controle de fichier' ? (
                    <p className="text-sm leading-relaxed text-slate-300">
                      Controle de conformite des livrables : formats, structure des fichiers, calques, nomenclatures et lisibilite avant diffusion.
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-300">
                      Reprises ciblees apres retour terrain / client : ajustements des plans, maquette ou exports puis re-emission d une version validee.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ProcessCard>

          <ProcessCard step="6" title="Resultat" highlight>
            <div className="rounded-lg border border-[#ee7527]/30 bg-black/35 p-4">
              <div className="mb-3">
                <OrangePill label="Livrable" large />
              </div>
              <p className="text-sm leading-relaxed text-slate-100">
                Livrables 2D / 3D structures, controles et directement exploitables pour l exploitation, la maintenance, les projets de
                reamenagement et les decisions d investissement.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Plans / coupes / elevations</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Maquette numerique / IFC</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Nuage de points / exports</div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Base fiable pour GEM / GMAO</div>
              </div>
            </div>
          </ProcessCard>
        </div>
      </div>
    </section>
  )
}
