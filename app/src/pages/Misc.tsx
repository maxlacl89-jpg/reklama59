import { Link } from 'react-router'
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import EditableText from '@/components/EditableText'
import { useContent } from '@/lib/content'
import type { Article } from '@/data/content'
import { EditableBlock, EditableImage, LeadForm, PageHeader, Reveal, Star } from '@/components/site/ui'

/* ===================== ЭКСКУРСИИ ===================== */

export function Excursions() {
  const { t, set, editing, get } = useContent()
  const points = get('excursions.points') as string[]

  return (
    <div>
      <PageHeader kicker="Проекты" title={t('excursions.heading')} text={t('excursions.intro')} />
      <EditableBlock bid="pg-excursions" noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <Reveal>
          <EditableImage
            path="excursions.image"
            src={t('excursions.image')}
            alt="Бизнес-экскурсия по производству"
            className="aspect-[16/8] rounded-3xl border border-[#E4E4E0] md:aspect-[16/6]"
          />
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.3rem,2.6vw,2rem)] font-extrabold tracking-tight text-[#16150F]">
              Что вас ждёт
            </h2>
            <ul className="mt-6 grid gap-4">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-4 rounded-2xl border border-[#E4E4E0] bg-[#F4F4F2] px-5 py-4">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-[#F44B43]" />
                  <EditableText as="span" value={p} onChange={(v) => set(`excursions.points.${i}`, v)} editing={editing} multiline className="text-sm font-semibold leading-relaxed text-[#16150F]" />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl bg-[#16150F] p-7 text-white">
              <Clock className="h-6 w-6 text-[#F44B43]" />
              <h3 className="font-display mt-4 text-lg font-extrabold">Как попасть</h3>
              <EditableText
                as="p"
                value={t('excursions.note')}
                onChange={(v) => set('excursions.note', v)}
                editing={editing}
                multiline
                className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70"
              />
              <Link to="/contacts" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1813F1] px-6 py-3.5 text-xs font-bold tracking-wider transition-colors hover:bg-[#100DC9]">
                Записаться <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </EditableBlock>
      <div className="border-t border-[#E4E4E0]">
        <LeadForm compact />
      </div>
    </div>
  )
}

/* ===================== КАРЬЕРА ===================== */

export function Career() {
  const { t, set, editing, get, pushItem, removeAt } = useContent()
  const items = get('career.items') as { title: string; text: string }[]

  return (
    <div>
      <PageHeader kicker="Команда" title={t('career.heading')} text={t('career.intro')} />
      <EditableBlock bid="pg-career" noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <div className="grid gap-3">
          {items.map((v, i) => (
            <Reveal key={i}>
              <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E4E4E0] bg-white px-5 py-6 transition-colors hover:border-[#1813F1]/50 md:px-8">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="font-display text-xl font-extrabold"
                      style={{ WebkitTextStroke: '1.5px #1813F1', color: 'transparent' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <EditableText as="h2" value={v.title} onChange={(val) => set(`career.items.${i}.title`, val)} editing={editing} className="text-lg font-bold text-[#16150F] md:text-xl" />
                  </div>
                  <EditableText as="p" value={v.text} onChange={(val) => set(`career.items.${i}.text`, val)} editing={editing} multiline className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#6B675C]" />
                </div>
                <Link to="/contacts" className="shrink-0 rounded-full bg-[#16150F] px-5 py-3 text-xs font-bold tracking-wider text-white transition-colors hover:bg-[#1813F1]">
                  Откликнуться
                </Link>
                {editing && (
                  <button onClick={() => removeAt('career.items', i)} className="absolute right-3 top-3 cursor-pointer text-xs font-bold text-[#F44B43] hover:underline">Удалить</button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {editing && (
          <button onClick={() => pushItem('career.items', { title: 'Новая вакансия', text: 'Описание вакансии.' })} className="mt-6 cursor-pointer rounded-full border border-dashed border-[#16150F]/30 px-6 py-3 text-sm font-bold tracking-wider text-[#16150F]/60 hover:border-[#1813F1] hover:text-[#1813F1]">
            + Добавить вакансию
          </button>
        )}
      </EditableBlock>
      <div className="border-t border-[#E4E4E0]">
        <LeadForm compact />
      </div>
    </div>
  )
}

/* ===================== СТАТЬИ ===================== */

export function Articles() {
  const { t, set, editing, get, pushItem, removeAt } = useContent()
  const items = get('articles.items') as Article[]

  return (
    <div>
      <PageHeader kicker="Блог" title={t('articles.heading')} text={t('articles.intro')} />
      <EditableBlock bid="pg-articles" noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a, i) => (
            <Reveal key={i}>
              <article className="relative flex h-full flex-col rounded-2xl border border-[#E4E4E0] bg-white p-6 transition-colors hover:border-[#1813F1]/50 md:p-8">
                <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em]">
                  <span className="rounded-full bg-[#1813F1]/10 px-3 py-1 text-[#1813F1]">
                    <EditableText as="span" value={a.tag} onChange={(v) => set(`articles.items.${i}.tag`, v)} editing={editing} />
                  </span>
                  <EditableText as="span" value={a.date} onChange={(v) => set(`articles.items.${i}.date`, v)} editing={editing} className="text-[#16150F]/40" />
                </div>
                <EditableText as="h2" value={a.title} onChange={(v) => set(`articles.items.${i}.title`, v)} editing={editing} multiline className="font-display mt-4 text-lg font-extrabold leading-snug text-[#16150F] md:text-xl" />
                <EditableText as="p" value={a.text} onChange={(v) => set(`articles.items.${i}.text`, v)} editing={editing} multiline className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[#6B675C]" />
                {editing && (
                  <button onClick={() => removeAt('articles.items', i)} className="absolute right-3 top-3 cursor-pointer text-xs font-bold text-[#F44B43] hover:underline">Удалить</button>
                )}
              </article>
            </Reveal>
          ))}
        </div>
        {editing && (
          <button onClick={() => pushItem('articles.items', { tag: 'Новости', date: 'Сегодня', title: 'Заголовок статьи', text: 'Текст статьи.' })} className="mt-6 cursor-pointer rounded-full border border-dashed border-[#16150F]/30 px-6 py-3 text-sm font-bold tracking-wider text-[#16150F]/60 hover:border-[#1813F1] hover:text-[#1813F1]">
            + Добавить статью
          </button>
        )}
      </EditableBlock>
    </div>
  )
}

/* ===================== КОНТАКТЫ ===================== */

export function Contacts() {
  const { t, set, editing } = useContent()
  const rows = [
    { icon: Phone, label: 'Телефон', value: t('contacts.phone'), href: `tel:${t('contacts.phone').replace(/[^+\d]/g, '')}` },
    { icon: Mail, label: 'Почта', value: t('contacts.email'), href: `mailto:${t('contacts.email')}` },
    { icon: MapPin, label: 'Адрес', value: t('contacts.address'), href: undefined },
    { icon: Clock, label: 'Режим работы', value: t('contacts.hours'), href: undefined },
  ] as const

  return (
    <div>
      <PageHeader kicker="Свяжемся" title="Контакты" text={t('contacts.note')} />
      <EditableBlock bid="pg-contacts" noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map(({ icon: Icon, label, value, href }, i) => (
            <Reveal key={i}>
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#E4E4E0] bg-white px-5 py-5 transition-colors hover:border-[#1813F1]/50">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1813F1]/10 text-[#1813F1]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold tracking-[0.2em] text-[#16150F]/40">{label}</span>
                  <EditableText
                    as={href && !editing ? 'a' : 'span'}
                    href={href}
                    value={value}
                    onChange={(v) => set(`contacts.${['phone', 'email', 'address', 'hours'][i]}`, v)}
                    editing={editing}
                    className="block break-words text-base font-semibold text-[#16150F]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </EditableBlock>
      <div className="border-t border-[#E4E4E0]">
        <LeadForm />
      </div>
    </div>
  )
}

/* ===================== 404 ===================== */

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-16 text-center">
      <span
        aria-hidden="true"
        className="font-display text-[clamp(4rem,18vw,10rem)] font-extrabold leading-none"
        style={{ WebkitTextStroke: '3px #1813F1', color: 'transparent' }}
      >
        404
      </span>
      <p className="mt-4 text-[#6B675C]">Страница не найдена — но рекламу мы сделаем любую.</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#16150F] px-7 py-4 text-sm font-bold tracking-wider text-white transition-colors hover:bg-[#1813F1]">
        На главную <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
