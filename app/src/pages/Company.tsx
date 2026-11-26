import { Link } from 'react-router'
import { ArrowRight, FileText } from 'lucide-react'
import EditableText from '@/components/EditableText'
import { useContent } from '@/lib/content'
import type { DocItem, HistoryItem, ReqItem } from '@/data/content'
import { LeadForm, PageHeader, Reveal, Star, EditableBlock } from '@/components/site/ui'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <EditableBlock id={id} bid={`pg-company-${id}`} noPad sizeControl={false} className="scroll-mt-24 border-t border-[#E4E4E0] py-16 first:border-t-0 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.6rem)] font-extrabold leading-none tracking-tight text-[#16150F]">
            {title}
          </h2>
        </Reveal>
        <div className="mt-8">{children}</div>
      </div>
    </EditableBlock>
  )
}

export default function Company() {
  const { t, set, editing, get, pushItem, removeAt } = useContent()
  const history = get('company.history') as HistoryItem[]
  const partners = get('company.partners') as string[]
  const docs = get('company.docs') as DocItem[]
  const requisites = get('company.requisites') as ReqItem[]
  const vacancies = get('company.vacancies') as { title: string; text: string }[]

  return (
    <div>
      <PageHeader kicker="Компания" title={t('company.heading')} />

      {/* О компании */}
      <Section id="about" title="Кто мы">
        <Reveal>
          <EditableText
            as="div"
            value={t('company.about')}
            onChange={(v) => set('company.about', v)}
            editing={editing}
            multiline
            className="max-w-[70ch] whitespace-pre-wrap text-base leading-[1.8] text-[#6B675C] md:text-[17px]"
          />
        </Reveal>
        <Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['Собственное производство', 'Печать, фрезеровка, лазер, сборка'],
              ['Штатные монтажные бригады', 'Высотные работы, согласования'],
              ['Дизайн-студия', 'От макета до фирменного стиля'],
            ].map(([ti, tx]) => (
              <div key={ti} className="rounded-2xl border border-[#E4E4E0] bg-[#F4F4F2] p-5">
                <Star className="h-5 w-5 text-[#F44B43]" />
                <h3 className="mt-3 text-sm font-bold tracking-wide text-[#16150F]">{ti}</h3>
                <p className="mt-1 text-sm text-[#6B675C]">{tx}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* История */}
      <Section id="history" title={t('company.historyHeading')}>
        <div className="grid gap-0">
          {history.map((h, i) => (
            <Reveal key={i}>
              <div className="group relative grid gap-2 border-l-2 border-[#E4E4E0] py-5 pl-6 last:pb-0 md:grid-cols-[8rem_1fr] md:gap-8">
                <span className="absolute -left-[7px] top-7 h-3 w-3 rounded-full bg-[#1813F1]" />
                <EditableText
                  as="span"
                  value={h.year}
                  onChange={(v) => set(`company.history.${i}.year`, v)}
                  editing={editing}
                  className="font-display text-2xl font-extrabold text-[#1813F1]"
                />
                <EditableText
                  as="p"
                  value={h.text}
                  onChange={(v) => set(`company.history.${i}.text`, v)}
                  editing={editing}
                  multiline
                  className="max-w-2xl text-[15px] leading-relaxed text-[#6B675C]"
                />
                {editing && (
                  <button onClick={() => removeAt('company.history', i)} className="absolute right-0 top-5 cursor-pointer text-xs font-bold text-[#F44B43] hover:underline">
                    Удалить
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {editing && (
          <button
            onClick={() => pushItem('company.history', { year: '2027', text: 'Новый этап компании.' })}
            className="mt-6 cursor-pointer rounded-full border border-dashed border-[#16150F]/30 px-6 py-3 text-sm font-bold tracking-wider text-[#16150F]/60 hover:border-[#1813F1] hover:text-[#1813F1]"
          >
            + Добавить событие
          </button>
        )}
      </Section>

      {/* Партнёры */}
      <Section id="partners" title={t('company.partnersHeading')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p, i) => (
            <Reveal key={i}>
              <div className="relative flex h-24 items-center justify-center rounded-2xl border border-[#E4E4E0] bg-white px-4 transition-colors hover:border-[#1813F1]/50">
                <EditableText as="span" value={p} onChange={(v) => set(`company.partners.${i}`, v)} editing={editing} className="text-center text-sm font-bold tracking-wide text-[#16150F]/70" />
                {editing && (
                  <button onClick={() => removeAt('company.partners', i)} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#F44B43] text-[10px] font-bold text-white">×</button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {editing && (
          <button onClick={() => pushItem('company.partners', 'Новый партнёр')} className="mt-5 cursor-pointer rounded-full border border-dashed border-[#16150F]/30 px-6 py-3 text-sm font-bold tracking-wider text-[#16150F]/60 hover:border-[#1813F1] hover:text-[#1813F1]">
            + Добавить партнёра
          </button>
        )}
      </Section>

      {/* Документы */}
      <Section id="docs" title={t('company.docsHeading')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((d, i) => (
            <Reveal key={i}>
              <div className="relative flex items-center gap-4 rounded-2xl border border-[#E4E4E0] bg-white px-5 py-4 transition-colors hover:border-[#1813F1]/50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1813F1]/10 text-[#1813F1]">
                  <FileText className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <EditableText as="span" value={d.name} onChange={(v) => set(`company.docs.${i}.name`, v)} editing={editing} className="text-sm font-semibold text-[#16150F]" />
                {editing && (
                  <button onClick={() => removeAt('company.docs', i)} className="absolute right-3 top-3 cursor-pointer text-xs font-bold text-[#F44B43]">×</button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Реквизиты */}
      <Section id="requisites" title={t('company.reqHeading')}>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-[#E4E4E0]">
            {requisites.map((r, i) => (
              <div key={i} className={`grid gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr] md:px-7 ${i % 2 === 0 ? 'bg-[#F4F4F2]' : 'bg-white'}`}>
                <EditableText as="span" value={r.label} onChange={(v) => set(`company.requisites.${i}.label`, v)} editing={editing} className="text-xs font-bold tracking-[0.2em] text-[#16150F]/50" />
                <EditableText as="span" value={r.value} onChange={(v) => set(`company.requisites.${i}.value`, v)} editing={editing} className="text-sm font-semibold text-[#16150F]" />
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Вакансии */}
      <Section id="vacancies" title={t('company.vacHeading')}>
        <div className="grid gap-3">
          {vacancies.map((v, i) => (
            <Reveal key={i}>
              <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E4E0] bg-white px-5 py-5 md:px-7">
                <div className="min-w-0">
                  <EditableText as="h3" value={v.title} onChange={(val) => set(`company.vacancies.${i}.title`, val)} editing={editing} className="text-base font-bold text-[#16150F] md:text-lg" />
                  <EditableText as="p" value={v.text} onChange={(val) => set(`company.vacancies.${i}.text`, val)} editing={editing} multiline className="mt-1 text-sm text-[#6B675C]" />
                </div>
                <Link to="/career" className="shrink-0 text-xs font-bold tracking-wider text-[#1813F1] hover:underline">
                  Подробнее
                </Link>
                {editing && (
                  <button onClick={() => removeAt('company.vacancies', i)} className="absolute right-3 top-3 cursor-pointer text-xs font-bold text-[#F44B43]">×</button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link to="/career" className="group mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-wider text-[#1813F1]">
            Все вакансии <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      <div className="border-t border-[#E4E4E0]">
        <LeadForm compact />
      </div>
    </div>
  )
}
