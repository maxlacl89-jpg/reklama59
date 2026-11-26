import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { DIRECTIONS, PROJECTS } from '@/data/content'
import { EditableBlock, EditableImage, LeadForm, PageHeader, Reveal } from '@/components/site/ui'
import { useContent } from '@/lib/content'

export default function Directions() {
  return (
    <div>
      <PageHeader
        kicker="Услуги"
        title="Направления"
        text="Десять направлений — одна команда. Дизайн, производство и монтаж под ключ для любого сегмента рынка."
      />
      <EditableBlock bid="pg-directions" noPad sizeControl={false} className="mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-8 md:pb-28">
        <div>
          {DIRECTIONS.map((d, i) => (
            <Reveal key={d.slug} delay={0.02 * i}>
              <Link
                to={`/directions/${d.slug}`}
                className="group flex items-center gap-5 border-b border-[#16150F]/15 py-6 transition-colors first:border-t hover:bg-[#16150F]/[0.03] md:gap-8 md:py-8"
              >
                <span className="font-display w-10 shrink-0 text-sm font-bold text-[#F44B43]">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-extrabold leading-tight tracking-tight text-[#16150F] transition-colors group-hover:text-[#1813F1] md:text-2xl">
                    {d.menu}
                  </h2>
                  <p className="mt-1.5 hidden max-w-xl text-sm text-[#6B675C] md:block">{d.short}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-[#16150F]/35 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#1813F1]" />
              </Link>
            </Reveal>
          ))}
        </div>
      </EditableBlock>
      <div className="border-t border-[#E4E4E0]">
        <LeadForm compact />
      </div>
    </div>
  )
}

export function DirectionDetail({ slug }: { slug: string }) {
  const { editing } = useContent()
  const d = DIRECTIONS.find((x) => x.slug === slug)
  if (!d) return null
  const projects = PROJECTS.filter((p) => d.projectSlugs.includes(p.slug))

  return (
    <div>
      {/* хиро-фото */}
      <header className="relative overflow-hidden bg-[#16150F] pt-16">
        <div className="relative h-[52vh] min-h-[320px] md:h-[64vh]">
          <EditableImage path={`dir.${d.slug}.image`} src={d.image} alt={d.title} className="absolute inset-0" imgClassName="opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16150F] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-5 pb-10 md:px-8">
            <Reveal>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-white/70">
                <Link to="/directions" className="transition-colors hover:text-white">Направления</Link>
                <span className="text-white/40">/</span>
              </p>
            </Reveal>
            <Reveal>
              <h1 className="font-display max-w-3xl text-[clamp(1.8rem,5vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight text-white">
                {d.title}
              </h1>
            </Reveal>
          </div>
        </div>
      </header>

      <EditableBlock bid={`pg-dir-${slug}`} noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="whitespace-pre-wrap text-base leading-[1.8] text-[#6B675C] md:text-[17px]">{d.text}</p>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-[#E4E4E0] bg-[#F4F4F2] p-6">
              <h2 className="text-xs font-bold tracking-[0.25em] text-[#16150F]/50">Что делаем</h2>
              <ul className="mt-4 grid gap-3">
                {d.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-[#16150F]">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[#1813F1]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </EditableBlock>

      {projects.length > 0 && (
        <EditableBlock bid={`pg-dir-${slug}-projects`} noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
          <Reveal>
            <h2 className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold tracking-tight text-[#16150F]">
              Проекты по направлению
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Reveal key={p.slug}>
                <Link to={`/projects/${p.slug}`} className="group block overflow-hidden rounded-2xl border border-[#E4E4E0]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#16150F] transition-colors group-hover:text-[#1813F1]">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </EditableBlock>
      )}

      <div className="border-t border-[#E4E4E0]">
        <LeadForm compact />
      </div>
      {editing && null}
    </div>
  )
}
