import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowRight, Check, ImagePlus, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'
import type { Block, ImageItem, ListItem, StatItem } from '@/types/site'
import EditableText from '@/components/EditableText'

/* ---------- палитра бренда ---------- */
export const BRAND = {
  blue: '#3B43F5',
  red: '#F44B43',
  ink: '#101014',
  paper: '#FFFFFF',
  surface: '#F4F4F0',
  line: '#E8E8E2',
  gray: '#55555C',
}

/* ---------- фирменная звезда-стикер ---------- */

export function Star({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 2 L58 30 L84 16 L68 42 L96 50 L68 58 L84 84 L58 70 L50 98 L42 70 L16 84 L32 58 L4 50 L32 42 L16 16 L42 30 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ---------- появление при прокрутке ---------- */

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            io.disconnect()
          }
        })
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

/* ---------- общие пропсы рендерера ---------- */

export interface BlockViewProps {
  block: Block
  editing: boolean
  patch: (p: Partial<Block>) => void
  onPickImage: (imageId: string) => void
  onCtaClick: () => void
}

const headingCls =
  'font-display text-[clamp(1.7rem,4.2vw,3.2rem)] font-extrabold uppercase leading-[1.02] tracking-tight'
const sectionCls = 'mx-auto w-full max-w-6xl px-5 md:px-8'
const kickerCls = 'flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em]'

/* ---------- заглушка картинки ---------- */

const TILE_GRADIENTS = [
  'linear-gradient(140deg,#EFEFEA 0%,#E7E7F6 55%,#DCDCF8 100%)',
  'linear-gradient(140deg,#F3EFE9 0%,#F6E4E1 60%,#F9D9D4 100%)',
  'linear-gradient(140deg,#EDEDF8 0%,#E2E4FB 55%,#D5D8FC 100%)',
  'linear-gradient(140deg,#F5F2EC 0%,#EFE9FA 50%,#E4E2FC 100%)',
]

/* ---------- HERO ---------- */

function HeroView({ block, editing, patch, onCtaClick }: BlockViewProps) {
  if (block.type !== 'hero') return null
  return (
    <header className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#FFFFFF]">
      {/* синий блоб */}
      <div
        className="pointer-events-none absolute -right-[12vw] top-[6vh] hidden h-[62vh] w-[62vh] opacity-90 md:block"
        style={{
          background: `radial-gradient(circle at 35% 35%, #5A62FF 0%, ${BRAND.blue} 55%, #2A31D8 100%)`,
          borderRadius: '58% 42% 55% 45% / 48% 55% 45% 52%',
          filter: 'blur(2px)',
        }}
      />
      {/* контурная 59 */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute -right-[2vw] top-[10vh] hidden rotate-[8deg] text-[20vw] font-extrabold leading-none md:block"
        style={{ WebkitTextStroke: `3px rgba(255,255,255,0.85)`, color: 'transparent' }}
      >
        59
      </span>
      {/* звезды-стикеры */}
      <Star className="pointer-events-none absolute right-[5vw] top-[10vh] h-12 w-12 rotate-12 text-[#F44B43] md:right-[8vw] md:top-[9vh] md:h-24 md:w-24" />
      <Star className="pointer-events-none absolute right-[38vw] top-[62vh] hidden h-10 w-10 -rotate-12 text-[#3B43F5] md:block" />

      <div className={`${sectionCls} relative flex flex-1 flex-col justify-center pb-24 pt-28`}>
        <Reveal>
          <p className={`${kickerCls} text-[#3B43F5]`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F44B43]" />
            Рекламно-производственная компания · Пермь
          </p>
        </Reveal>
        <Reveal>
          <EditableText
            as="h1"
            value={block.title}
            editing={editing}
            onChange={(title) => patch({ title })}
            className="font-display mt-6 max-w-4xl text-[clamp(2.6rem,8.5vw,6.4rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-[#101014]"
            placeholder="Заголовок"
          />
        </Reveal>
        <Reveal>
          <EditableText
            as="p"
            value={block.subtitle}
            editing={editing}
            multiline
            onChange={(subtitle) => patch({ subtitle })}
            className="mt-8 max-w-xl whitespace-pre-wrap text-base leading-relaxed text-[#55555C] md:text-lg"
            placeholder="Описание"
          />
        </Reveal>
        <Reveal>
          <button
            onClick={onCtaClick}
            className="group mt-10 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full bg-[#101014] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#3B43F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B43F5] focus-visible:ring-offset-2"
          >
            <EditableText
              as="span"
              value={block.cta}
              editing={editing}
              onChange={(cta) => patch({ cta })}
              className="pointer-events-auto"
              placeholder="Текст кнопки"
            />
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[#101014]/30">
        <ArrowDown className="h-5 w-5 animate-bounce" strokeWidth={1.5} />
      </div>
    </header>
  )
}

/* ---------- бегущая строка ---------- */

export function Marquee() {
  const words = ['вывески', 'стеллы', 'баннеры', 'брендирование', 'арт-объекты', 'печать', 'фотозоны', 'навигация']
  const row = [...words, ...words]
  return (
    <div className="overflow-hidden bg-[#3B43F5] py-4" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {row.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8">
                <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white">
                  {w}
                </span>
                <Star className="h-3.5 w-3.5 text-[#F44B43]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- ТЕКСТ ---------- */

function TextView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'text') return null
  return (
    <section className={`${sectionCls} py-20 md:py-28`}>
      <Reveal>
        <EditableText
          as="h2"
          value={block.heading}
          editing={editing}
          onChange={(heading) => patch({ heading })}
          className={`${headingCls} text-[#101014]`}
          placeholder="Заголовок"
        />
      </Reveal>
      <div className="mt-10 grid gap-8 md:grid-cols-[5rem_1.4fr] md:gap-12">
        <Reveal className="hidden md:block">
          <div className="h-1.5 w-24 rounded-full bg-[#3B43F5]" />
        </Reveal>
        <Reveal>
          <EditableText
            as="div"
            value={block.body}
            editing={editing}
            multiline
            onChange={(body) => patch({ body })}
            className="max-w-[70ch] whitespace-pre-wrap text-base leading-[1.8] text-[#55555C] md:text-[17px]"
            placeholder="Текст раздела"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- ЦИФРЫ ---------- */

function StatsView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'stats') return null

  const patchItem = (itemId: string, p: Partial<StatItem>) =>
    patch({ items: block.items.map((it) => (it.id === itemId ? { ...it, ...p } : it)) })

  const addItem = () =>
    patch({ items: [...block.items, { id: Math.random().toString(36).slice(2, 10), value: '100', label: 'описание показателя' }] })

  const removeItem = (itemId: string) => {
    if (block.items.length <= 1) return
    patch({ items: block.items.filter((it) => it.id !== itemId) })
  }

  return (
    <section className="border-y border-[#E8E8E2] bg-[#F4F4F0] py-16 md:py-20">
      <div className={`${sectionCls}`}>
        <Reveal>
          <EditableText
            as="h2"
            value={block.heading}
            editing={editing}
            onChange={(heading) => patch({ heading })}
            className={`${headingCls} text-[#101014]`}
            placeholder="Заголовок"
          />
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) => (
            <Reveal key={item.id}>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="font-display block text-[clamp(3.4rem,7vw,5.6rem)] font-extrabold leading-none"
                  style={{ WebkitTextStroke: `2.5px ${i % 2 === 0 ? BRAND.blue : BRAND.red}`, color: 'transparent' }}
                >
                  <EditableText
                    as="span"
                    value={item.value}
                    editing={editing}
                    onChange={(value) => patchItem(item.id, { value })}
                    className="pointer-events-auto"
                    placeholder="0"
                  />
                </span>
                <EditableText
                  as="p"
                  value={item.label}
                  editing={editing}
                  multiline
                  onChange={(label) => patchItem(item.id, { label })}
                  className="mt-3 max-w-[24ch] text-sm font-medium leading-snug text-[#55555C]"
                  placeholder="Подпись"
                />
                {editing && (
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить показатель"
                    className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#F44B43] text-xs font-bold text-white shadow transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F44B43]"
                  >
                    ×
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {editing && (
          <button
            onClick={addItem}
            className="mt-8 cursor-pointer rounded-full border border-dashed border-[#101014]/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#101014]/60 transition-colors hover:border-[#3B43F5] hover:text-[#3B43F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B43F5]"
          >
            + Добавить показатель
          </button>
        )}
      </div>
    </section>
  )
}

/* ---------- СПИСОК / НАПРАВЛЕНИЯ ---------- */

function ListView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'list') return null

  const patchItem = (itemId: string, p: Partial<ListItem>) =>
    patch({ items: block.items.map((it) => (it.id === itemId ? { ...it, ...p } : it)) })

  const removeItem = (itemId: string) => {
    if (block.items.length <= 1) return
    patch({ items: block.items.filter((it) => it.id !== itemId) })
  }

  const addItem = () =>
    patch({ items: [...block.items, { id: Math.random().toString(36).slice(2, 10), title: 'Новое направление', text: 'Описание.' }] })

  return (
    <section className={`${sectionCls} py-20 md:py-28`}>
      <Reveal>
        <EditableText
          as="h2"
          value={block.heading}
          editing={editing}
          onChange={(heading) => patch({ heading })}
          className={`${headingCls} text-[#101014]`}
          placeholder="Заголовок"
        />
      </Reveal>
      <div className="mt-12">
        {block.items.map((item, i) => (
          <Reveal key={item.id}>
            <div className="group grid gap-2 border-t border-[#E8E8E2] py-7 transition-colors duration-200 last:border-b hover:bg-[#F4F4F0]/60 md:grid-cols-[5.5rem_1fr_1.6fr] md:gap-8 md:px-4">
              <span
                aria-hidden="true"
                className="font-display text-2xl font-extrabold leading-none md:pt-1"
                style={{ WebkitTextStroke: `1.8px ${BRAND.blue}`, color: 'transparent' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <EditableText
                  as="h3"
                  value={item.title}
                  editing={editing}
                  onChange={(title) => patchItem(item.id, { title })}
                  className="text-lg font-bold leading-snug text-[#101014] md:text-xl"
                  placeholder="Название"
                />
                {editing && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-[#F44B43] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F44B43]/60"
                  >
                    Удалить пункт
                  </button>
                )}
              </div>
              <EditableText
                as="p"
                value={item.text}
                editing={editing}
                multiline
                onChange={(text) => patchItem(item.id, { text })}
                className="text-[15px] leading-relaxed text-[#55555C]"
                placeholder="Описание"
              />
            </div>
          </Reveal>
        ))}
      </div>
      {editing && (
        <button
          onClick={addItem}
          className="mt-6 cursor-pointer rounded-full border border-dashed border-[#101014]/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#101014]/60 transition-colors hover:border-[#3B43F5] hover:text-[#3B43F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B43F5]"
        >
          + Добавить направление
        </button>
      )}
    </section>
  )
}

/* ---------- ГАЛЕРЕЯ ---------- */

function GalleryView({ block, editing, patch, onPickImage }: BlockViewProps) {
  if (block.type !== 'gallery') return null

  const patchCaption = (imageId: string, caption: string) =>
    patch({ images: block.images.map((im) => (im.id === imageId ? { ...im, caption } : im)) })

  const removeImage = (imageId: string) => {
    if (block.images.length <= 1) return
    patch({ images: block.images.filter((im) => im.id !== imageId) })
  }

  return (
    <section className={`${sectionCls} py-20 md:py-28`}>
      <Reveal>
        <EditableText
          as="h2"
          value={block.heading}
          editing={editing}
          onChange={(heading) => patch({ heading })}
          className={`${headingCls} text-[#101014]`}
          placeholder="Заголовок"
        />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {block.images.map((image, i) => (
          <Reveal key={image.id}>
            <div className="relative">
              <GalleryTile
                image={image}
                index={i}
                editing={editing}
                onPick={() => onPickImage(image.id)}
                onCaption={(caption) => patchCaption(image.id, caption)}
              />
              {editing && (
                <button
                  onClick={() => removeImage(image.id)}
                  aria-label="Удалить фото"
                  className="absolute -right-2 -top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#F44B43] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F44B43]"
                >
                  ×
                </button>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function GalleryTile({
  image,
  index,
  editing,
  onPick,
  onCaption,
}: {
  image: ImageItem
  index: number
  editing: boolean
  onPick: () => void
  onCaption: (caption: string) => void
}) {
  return (
    <figure
      className={`group/tile relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#E8E8E2] bg-[#F4F4F0] ${
        editing ? 'cursor-pointer' : ''
      }`}
      onClick={editing ? onPick : undefined}
      role={editing ? 'button' : undefined}
      tabIndex={editing ? 0 : undefined}
      onKeyDown={editing ? (e) => e.key === 'Enter' && onPick() : undefined}
    >
      {image.url ? (
        <img
          src={image.url}
          alt={image.caption}
          className="h-full w-full object-cover transition-transform duration-500 group-hover/tile:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover/tile:scale-[1.02]"
          style={{ backgroundImage: TILE_GRADIENTS[index % TILE_GRADIENTS.length] }}
        >
          {editing ? (
            <span className="flex flex-col items-center gap-2 text-[#101014]/45">
              <ImagePlus className="h-7 w-7" strokeWidth={1.5} />
              <span className="text-xs font-bold uppercase tracking-widest">Загрузить фото</span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="font-display text-5xl font-extrabold"
              style={{ WebkitTextStroke: `2px ${index % 2 === 0 ? BRAND.blue : BRAND.red}`, color: 'transparent' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 border-t border-[#E8E8E2]/70 bg-white/85 px-4 py-2.5 backdrop-blur-sm">
        <EditableText
          as="span"
          value={image.caption}
          editing={editing}
          onChange={onCaption}
          className="text-sm font-semibold text-[#101014]"
          placeholder="Подпись"
        />
      </figcaption>
    </figure>
  )
}

/* ---------- ЦИТАТА ---------- */

function QuoteView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'quote') return null
  return (
    <section className="bg-[#F4F4F0] py-20 md:py-28">
      <Reveal className={`${sectionCls} text-center`}>
        <Star className="mx-auto h-10 w-10 text-[#F44B43]" />
        <EditableText
          as="blockquote"
          value={block.text}
          editing={editing}
          multiline
          onChange={(text) => patch({ text })}
          className="font-display mx-auto mt-6 max-w-3xl whitespace-pre-wrap text-[clamp(1.4rem,3.6vw,2.6rem)] font-bold leading-[1.2] text-[#101014]"
          placeholder="Текст цитаты"
        />
        <EditableText
          as="p"
          value={block.author}
          editing={editing}
          onChange={(author) => patch({ author })}
          className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#3B43F5]"
          placeholder="Подпись"
        />
      </Reveal>
    </section>
  )
}

/* ---------- ФОРМА ЗАЯВКИ ---------- */

interface Lead { name: string; phone: string; message: string; date: string }

const LEADS_KEY = 'site-constructor-leads'

function saveLead(lead: Lead): boolean {
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    const leads: Lead[] = raw ? JSON.parse(raw) : []
    leads.push(lead)
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
    return true
  } catch {
    return false
  }
}

function FormView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'form') return null
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) return
    const errs: { name?: string; phone?: string } = {}
    if (name.trim().length < 2) errs.name = 'Укажите имя'
    if (!/^[+\d][\d\s()\-]{6,}$/.test(phone.trim())) errs.phone = 'Укажите корректный телефон'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSending(true)
    const lead: Lead = { name: name.trim(), phone: phone.trim(), message: message.trim(), date: new Date().toISOString() }
    window.setTimeout(() => {
      setSending(false)
      if (saveLead(lead)) {
        setDone(true)
        setName(''); setPhone(''); setMessage('')
        toast.success('Заявка отправлена. Мы свяжемся с вами!', { description: `Отправитель: ${lead.name}` })
        window.setTimeout(() => setDone(false), 4000)
      } else {
        toast.error('Не удалось сохранить заявку в этом браузере')
      }
    }, 600)
  }

  const inputCls = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-[#101014] placeholder:text-[#101014]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B43F5]/50 ${
      hasError ? 'border-[#F44B43]' : 'border-[#E8E8E2] hover:border-[#101014]/30'
    }`

  return (
    <section className={`${sectionCls} py-20 md:py-28`}>
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Reveal>
            <EditableText
              as="h2"
              value={block.heading}
              editing={editing}
              onChange={(heading) => patch({ heading })}
              className={`${headingCls} text-[#101014]`}
              placeholder="Заголовок формы"
            />
          </Reveal>
          <Reveal>
            <EditableText
              as="p"
              value={block.note}
              editing={editing}
              multiline
              onChange={(note) => patch({ note })}
              className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-[#55555C]"
              placeholder="Текст рядом с формой"
            />
          </Reveal>
        </div>
        <Reveal>
          <form onSubmit={submit} noValidate className="rounded-3xl border border-[#E8E8E2] bg-[#F4F4F0] p-6 md:p-8">
            <div className="grid gap-5">
              <div>
                <label htmlFor={`f-name-${block.id}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#101014]/50">
                  Ваше имя *
                </label>
                <input
                  id={`f-name-${block.id}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  className={inputCls(errors.name)}
                  disabled={sending}
                />
                {errors.name && <p className="mt-1.5 text-xs text-[#F44B43]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor={`f-phone-${block.id}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#101014]/50">
                  Телефон *
                </label>
                <input
                  id={`f-phone-${block.id}`}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className={inputCls(errors.phone)}
                  disabled={sending}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-[#F44B43]">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor={`f-msg-${block.id}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#101014]/50">
                  О задаче
                </label>
                <textarea
                  id={`f-msg-${block.id}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Например: нужна световая вывеска 3×1 м для магазина"
                  rows={4}
                  className={`${inputCls()} resize-y`}
                  disabled={sending}
                />
              </div>
              <button
                type="submit"
                disabled={sending || done}
                className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#3B43F5] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#2A31D8] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B43F5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : done ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? 'Отправляем…' : done ? 'Отправлено!' : block.button}
              </button>
              <p className="text-xs leading-relaxed text-[#101014]/40">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- КОНТАКТЫ ---------- */

function ContactsView({ block, editing, patch }: BlockViewProps) {
  if (block.type !== 'contacts') return null
  const rows = [
    { icon: Phone, label: 'Телефон', value: block.phone, key: 'phone', href: `tel:${block.phone.replace(/[^+\d]/g, '')}` },
    { icon: Mail, label: 'Почта', value: block.email, key: 'email', href: `mailto:${block.email}` },
    { icon: MapPin, label: 'Адрес', value: block.address, key: 'address', href: undefined },
  ] as const

  return (
    <section className={`${sectionCls} py-20 md:py-28`}>
      <Reveal>
        <EditableText
          as="h2"
          value={block.heading}
          editing={editing}
          onChange={(heading) => patch({ heading })}
          className={`${headingCls} text-[#101014]`}
          placeholder="Заголовок"
        />
      </Reveal>
      <div className="mt-12 grid gap-3">
        {rows.map(({ icon: Icon, label, value, key, href }) => (
          <Reveal key={key}>
            <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#E8E8E2] bg-white px-4 py-5 transition-colors hover:border-[#3B43F5]/50 md:gap-5 md:px-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3B43F5]/10 text-[#3B43F5]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="hidden w-20 shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-[#101014]/40 sm:block">
                {label}
              </span>
              <EditableText
                as={href && !editing ? 'a' : 'span'}
                href={href}
                value={value}
                editing={editing}
                onChange={(v) => patch({ [key]: v } as Partial<Block>)}
                className="min-w-0 flex-1 break-words text-base font-semibold text-[#101014] md:text-lg"
                placeholder={label}
              />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <EditableText
          as="p"
          value={block.note}
          editing={editing}
          multiline
          onChange={(note) => patch({ note })}
          className="mt-8 max-w-xl whitespace-pre-wrap text-[15px] leading-relaxed text-[#55555C]"
          placeholder="Примечание"
        />
      </Reveal>
    </section>
  )
}

/* ---------- диспетчер ---------- */

export default function BlockView(props: BlockViewProps) {
  switch (props.block.type) {
    case 'hero':
      return <HeroView {...props} />
    case 'text':
      return <TextView {...props} />
    case 'list':
      return <ListView {...props} />
    case 'stats':
      return <StatsView {...props} />
    case 'gallery':
      return <GalleryView {...props} />
    case 'quote':
      return <QuoteView {...props} />
    case 'form':
      return <FormView {...props} />
    case 'contacts':
      return <ContactsView {...props} />
  }
}
