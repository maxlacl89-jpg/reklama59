import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import EditableText from '@/components/EditableText'
import { PROJECTS } from '@/data/content'
import { useContent } from '@/lib/content'
import { EditableBlock, EditableImage, PageHeader, Reveal } from '@/components/site/ui'

export default function Projects() {
  const { t, set, editing } = useContent()
  return (
    <div>
      <PageHeader
        kicker="Портфолио"
        title="Проекты"
        text="77 820 реализованных проектов за 16 лет. Вот несколько, которыми мы гордимся."
      />
      <EditableBlock bid="pg-projects" noPad sizeControl={false} className="mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-8 md:pb-28">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={0.04 * (i % 2)}>
              <Link
                to={`/projects/${p.slug}`}
                className="group block overflow-hidden rounded-[2rem] border border-[#16150F]/15 bg-[#F4F4F2] transition-colors duration-300 hover:border-[#16150F]/35"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <EditableImage
                    path={`projects.items.${i}.cover`}
                    src={t(`projects.items.${i}.cover`) || p.cover}
                    alt={p.title}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 p-6 md:p-7">
                  <div>
                    <EditableText
                      as="p"
                      value={t(`projects.items.${i}.category`) || p.category}
                      onChange={(v) => set(`projects.items.${i}.category`, v)}
                      editing={editing}
                      className="text-xs font-bold uppercase tracking-[0.2em] text-[#16150F]/50"
                    />
                    <EditableText
                      as="h2"
                      value={t(`projects.items.${i}.title`) || p.title}
                      onChange={(v) => set(`projects.items.${i}.title`, v)}
                      editing={editing}
                      className="font-display mt-1.5 text-lg font-extrabold leading-tight tracking-tight text-[#16150F] md:text-xl"
                    />
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#16150F]/25 text-[#16150F] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#16150F] group-hover:bg-[#16150F] group-hover:text-white">
                    <ArrowRight className="h-4 w-4 -rotate-45" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </EditableBlock>
    </div>
  )
}

export function ProjectDetail({ slug }: { slug: string }) {
  const { t, set, editing } = useContent()
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) return null
  const idx = PROJECTS.findIndex((x) => x.slug === slug)
  const next = PROJECTS[(idx + 1) % PROJECTS.length]

  return (
    <div>
      <header className="relative overflow-hidden bg-[#16150F] pt-16">
        <div className="relative h-[60vh] min-h-[360px] md:h-[72vh]">
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16150F] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-5 pb-10 md:px-8">
            <Reveal>
              <p className="mb-3 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-white/70">
                <Link to="/projects" className="transition-colors hover:text-white">Проекты</Link>
                <span className="text-white/40">/</span> {p.category}
              </p>
            </Reveal>
            <Reveal>
              <h1 className="font-display max-w-3xl text-[clamp(1.9rem,5.5vw,4rem)] font-extrabold leading-[1.02] tracking-tight text-white">
                <EditableText
                  as="span"
                  value={t(`projects.items.${idx}.title`) || p.title}
                  onChange={(v) => set(`projects.items.${idx}.title`, v)}
                  editing={editing}
                />
              </h1>
            </Reveal>
          </div>
        </div>
      </header>

      <EditableBlock bid={`pg-project-${slug}`} noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <EditableText
              as="p"
              value={t(`projects.items.${idx}.text`) || p.text}
              onChange={(v) => set(`projects.items.${idx}.text`, v)}
              editing={editing}
              multiline
              className="whitespace-pre-wrap text-base leading-[1.8] text-[#6B675C] md:text-[17px]"
            />
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-[#E4E4E0] bg-[#F4F4F2] p-6 text-sm">
              <dl className="grid gap-4">
                <div>
                  <dt className="text-xs font-bold tracking-[0.2em] text-[#16150F]/50">Заказчик</dt>
                  <dd className="mt-1 font-semibold text-[#16150F]">
                    <EditableText
                      as="span"
                      value={t(`projects.items.${idx}.client`) || p.client}
                      onChange={(v) => set(`projects.items.${idx}.client`, v)}
                      editing={editing}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.2em] text-[#16150F]/50">Направление</dt>
                  <dd className="mt-1 font-semibold text-[#16150F]">
                    <EditableText
                      as="span"
                      value={t(`projects.items.${idx}.category`) || p.category}
                      onChange={(v) => set(`projects.items.${idx}.category`, v)}
                      editing={editing}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.2em] text-[#16150F]/50">Теги</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1813F1]">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4">
          {p.images.map((img, i) => (
            <Reveal key={i}>
              <div className={`overflow-hidden rounded-3xl border border-[#E4E4E0] ${i % 2 === 1 ? 'md:mx-[8%]' : ''}`}>
                <img src={img} alt={`${p.title} — фото ${i + 1}`} className="w-full object-cover" loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link
            to={`/projects/${next.slug}`}
            className="group mt-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E4E4E0] bg-[#F4F4F2] p-6 transition-colors hover:border-[#1813F1]/40 md:p-8"
          >
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#16150F]/50">Следующий проект</p>
              <h2 className="font-display mt-2 text-xl font-extrabold text-[#16150F] md:text-2xl">{next.title}</h2>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16150F] text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </Link>
        </Reveal>
      </EditableBlock>
    </div>
  )
}
