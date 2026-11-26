import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Check, ImagePlus, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import EditableText from '@/components/EditableText'
import { useContent } from '@/lib/content'

/* ---------- палитра ---------- */
export const C = {
  blue: '#1813F1',
  blueDark: '#100DC9',
  red: '#F44B43',
  orange: '#FF5D00',
  cyan: '#AAE8F7',
  ink: '#16150F',
  gray: '#6B675C',
  line: '#E4E4E0',
  surface: '#F4F4F2',
  cream: '#FFFFFF',
}

/* ---------- фирменный знак (крыло логотипа) ---------- */
export function Brackets({ className = '', strokeWidth: _strokeWidth }: { className?: string; strokeWidth?: number }) {
  return <img src="/brand/logo-wing.png" alt="" aria-hidden="true" className={className} draggable={false} />
}

/* ---------- уголки-скобки ⌐ ¬ (как у референса) ---------- */
export function Corners({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="6">
      <path d="M4 26 V10 Q4 4 10 4 H26" />
      <path d="M96 74 V90 Q96 96 90 96 H74" />
    </svg>
  )
}

/* ---------- звезда-стикер ---------- */
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
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- бегущая строка слов ---------- */
export function Marquee({ words, dark = false }: { words: string[]; dark?: boolean }) {
  const row = [...words, ...words]
  return (
    <div className={`overflow-hidden py-4 ${dark ? 'bg-[#16150F]' : 'bg-[#1813F1]'}`} aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {row.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8">
                <span className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white">{w}</span>
                <Star className="h-3.5 w-3.5 text-[#F44B43]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- крупная бегущая типографика ---------- */
export function BigMarquee({ words, className = '' }: { words: string[]; className?: string }) {
  const row = [...words, ...words, ...words]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track flex w-max items-baseline whitespace-nowrap" style={{ animationDuration: '36s' }}>
        {row.map((w, i) => (
          <span key={i} className="font-display mx-6 text-[clamp(3rem,8vw,7rem)] font-extrabold leading-none tracking-tight">
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(22,21,15,0.55)' }}>{w}</span>
            <span className="text-[#F44B43]">.</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- пилюля-кнопка с точкой (стиль референса) ---------- */
export function PillLink({ to, children, dark = false }: { to: string; children: ReactNode; dark?: boolean }) {
  return (
    <a
      href={to}
      className={`group inline-flex items-center gap-3 rounded-full border px-7 py-3.5 text-sm font-bold transition-all duration-300 ${
        dark
          ? 'border-white/30 text-white hover:border-white hover:bg-white hover:text-[#16150F]'
          : 'border-[#16150F]/25 text-[#16150F] hover:border-[#16150F] hover:bg-[#16150F] hover:text-white'
      }`}
    >
      {children}
      <span className="h-2 w-2 rounded-full bg-[#F44B43] transition-transform duration-300 group-hover:scale-125" />
    </a>
  )
}

/* ---------- редактируемая картинка ---------- */
export function EditableImage({
  path,
  src,
  alt = '',
  className = '',
  imgClassName = '',
}: {
  path: string
  src: string
  alt?: string
  className?: string
  imgClassName?: string
}) {
  const { editing, set, fileToResizedDataUrl } = useContent()
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const url = await fileToResizedDataUrl(file)
      set(path, url)
      toast.success('Фото заменено')
    } catch {
      toast.error('Не удалось загрузить изображение')
    }
  }

  return (
    <div
      className={`relative overflow-hidden ${className} ${editing ? 'cursor-pointer' : ''}`}
      onClick={editing ? () => inputRef.current?.click() : undefined}
      role={editing ? 'button' : undefined}
      tabIndex={editing ? 0 : undefined}
      onKeyDown={editing ? (e) => e.key === 'Enter' && inputRef.current?.click() : undefined}
    >
      <img src={src} alt={alt} className={`h-full w-full object-cover ${imgClassName}`} loading="lazy" />
      {editing && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/35 text-xs font-bold uppercase tracking-widest text-white opacity-0 transition-opacity hover:opacity-100">
          <ImagePlus className="h-5 w-5" /> Заменить фото
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ---------- заголовок внутренней страницы: «01/ Раздел» ---------- */
export function PageHeader({ index, kicker, title, text }: { index?: string; kicker: string; title: string; text?: string }) {
  return (
    <header className="blueprint relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      <Star className="pointer-events-none absolute right-[7vw] top-28 hidden h-16 w-16 rotate-12 text-[#F44B43] md:block" />
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-bold tracking-wide text-[#16150F]/70">
            <span className="font-display text-[#1813F1]">{index ?? '01'}/</span>{' '}
            <span className="uppercase tracking-[0.2em]">{kicker}</span>
          </p>
        </Reveal>
        <Reveal>
          <h1 className="font-display mt-5 max-w-4xl text-[clamp(2.4rem,7vw,5.2rem)] font-extrabold leading-[1.0] tracking-tight text-[#16150F]">
            {title}
          </h1>
        </Reveal>
        {text && (
          <Reveal>
            <p className="mt-7 max-w-2xl whitespace-pre-wrap text-base leading-relaxed text-[#6B675C] md:text-lg">{text}</p>
          </Reveal>
        )}
      </div>
    </header>
  )
}

/* ---------- секция-CTA с формой заявки ---------- */
interface Lead { name: string; phone: string; message: string; date: string }
const LEADS_KEY = 'r59-leads'

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

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const { t, set, editing } = useContent()
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
        toast.success(t('form.success'), { description: lead.name })
        window.setTimeout(() => setDone(false), 4000)
      } else {
        toast.error('Не удалось сохранить заявку в этом браузере')
      }
    }, 600)
  }

  const inputCls = (hasError?: string) =>
    `w-full rounded-full border bg-white px-5 py-3 text-base text-[#16150F] placeholder:text-[#16150F]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1813F1]/50 ${
      hasError ? 'border-[#F44B43]' : 'border-[#16150F]/20 hover:border-[#16150F]/40'
    }`

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 md:py-16" id="lead-form">
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:gap-12">
        <div>
          <Reveal>
            <EditableText
              as="h2"
              value={t('form.heading')}
              onChange={(v) => set('form.heading', v)}
              editing={editing}
              className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-extrabold leading-[1.05] tracking-tight text-[#16150F]"
              placeholder="Заголовок формы"
            />
          </Reveal>
          <Reveal>
            <EditableText
              as="p"
              value={t('form.note')}
              onChange={(v) => set('form.note', v)}
              editing={editing}
              multiline
              className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[#6B675C]"
              placeholder="Текст рядом с формой"
            />
          </Reveal>
        </div>
        <Reveal>
          <form onSubmit={submit} noValidate className="blueprint rounded-[1.75rem] border border-[#16150F]/15 bg-[#F4F4F2] p-5 md:p-7">
            <div className="grid gap-4">
              <div>
                <label htmlFor="lead-name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-[#16150F]/50">Ваше имя *</label>
                <input id="lead-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" className={inputCls(errors.name)} disabled={sending} />
                {errors.name && <p className="mt-1.5 text-xs text-[#F44B43]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-[#16150F]/50">Телефон *</label>
                <input id="lead-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className={inputCls(errors.phone)} disabled={sending} />
                {errors.phone && <p className="mt-1.5 text-xs text-[#F44B43]">{errors.phone}</p>}
              </div>
              {!compact && (
                <div>
                  <label htmlFor="lead-msg" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-[#16150F]/50">О задаче</label>
                  <textarea id="lead-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Например: нужна световая вывеска 3×1 м" rows={3} className={`${inputCls()} resize-y rounded-3xl`} disabled={sending} />
                </div>
              )}
              <button
                type="submit"
                disabled={sending || done}
                className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-[#16150F] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#1813F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {sending ? 'Отправляем…' : done ? 'Отправлено!' : t('form.button')}
                {!sending && !done && <span className="h-2 w-2 rounded-full bg-[#F44B43] transition-transform duration-300 group-hover:scale-125" />}
              </button>
              <p className="text-xs leading-relaxed text-[#16150F]/40">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- ссылка со стрелкой ---------- */
export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a
      href={to}
      className="group inline-flex items-center gap-2 text-sm font-bold tracking-wide text-[#1813F1] transition-colors hover:text-[#16150F]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  )
}

/* ---------- круглая стрелка-чеврон ---------- */
export function CircleArrow({ className = '' }: { className?: string }) {
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current transition-transform duration-300 group-hover:rotate-45 ${className}`}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  )
}

/* ---------- скролл-топ при смене страницы ---------- */
export function useScrollTopOnChange(dep: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [dep])
}

/* ===================== НАСТРОЙКА БЛОКОВ В РЕЖИМЕ ПРАВКИ ===================== */

export const ANIM_OPTIONS = [
  { value: 'up', label: 'Появление снизу' },
  { value: 'rise', label: 'Параплан (высоко)' },
  { value: 'fade', label: 'Плавное проявление' },
  { value: 'zoom', label: 'Увеличение' },
  { value: 'left', label: 'Выезд справа' },
  { value: 'right', label: 'Выезд слева' },
  { value: 'flip', label: 'Наклон и рост' },
  { value: 'blur', label: 'Проявление из размытия' },
  { value: 'clip', label: 'Раскрытие рамки' },
  { value: 'none', label: 'Без анимации' },
]

export const SIZE_OPTIONS = [
  { value: 'sm', label: 'Компактный' },
  { value: 'md', label: 'Средний' },
  { value: 'lg', label: 'Свободный' },
]

const ANIM_VARIANTS = {
  up: { opacity: 0, y: 36 },
  fade: { opacity: 0 },
  zoom: { opacity: 0, scale: 0.94 },
  left: { opacity: 0, x: 48 },
  right: { opacity: 0, x: -48 },
  flip: { opacity: 0, rotate: 2.5, scale: 0.96, y: 24 },
  blur: { opacity: 0, filter: 'blur(14px)', scale: 1.02 },
  clip: { opacity: 0, clipPath: 'inset(18% 6% 18% 6% round 2rem)', y: 20 },
  rise: { opacity: 0, y: 70, scale: 0.985 },
  none: {},
} as Record<string, Record<string, any>>

const ANIM_HIDDEN = {
  blur: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  clip: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)', y: 0 },
} as Record<string, Record<string, any>>

const PAD_CLASSES: Record<string, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-20 md:py-28',
  lg: 'py-28 md:py-40',
}

/* плавающая панель настроек блока (только в режиме правки) */
export function BlockSettings({
  bid,
  animValue,
  sizeValue,
  onAnim,
  onSize,
  showSize = true,
  animOptions = ANIM_OPTIONS,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: {
  bid: string
  animValue: string
  sizeValue?: string
  onAnim: (v: string) => void
  onSize?: (v: string) => void
  showSize?: boolean
  animOptions?: { value: string; label: string }[]
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}) {
  const { editing } = useContent()
  if (!editing) return null
  const sel =
    'cursor-pointer rounded-full border border-[#1813F1]/30 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#1813F1] focus:outline-none'
  const mv =
    'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#1813F1]/30 bg-white/80 text-[#1813F1] transition-colors hover:bg-[#1813F1] hover:text-white disabled:cursor-not-allowed disabled:opacity-30'
  return (
    <div
      className="absolute right-3 top-16 z-50 flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-end gap-1.5 rounded-2xl border border-[#1813F1]/25 bg-white/95 p-1.5 shadow-xl backdrop-blur md:rounded-full"
      onClick={(e) => e.stopPropagation()}
    >
      {(canMoveUp || canMoveDown) && (
        <span className="flex items-center gap-1 border-r border-[#1813F1]/15 pr-1.5">
          <button type="button" aria-label="Переместить блок выше" title="Переместить выше" className={mv} disabled={!canMoveUp} onClick={onMoveUp}>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="Переместить блок ниже" title="Переместить ниже" className={mv} disabled={!canMoveDown} onClick={onMoveDown}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </span>
      )}
      <select aria-label={`Анимация блока ${bid}`} title="Стиль анимации" value={animValue} onChange={(e) => onAnim(e.target.value)} className={sel}>
        {animOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {showSize && onSize && sizeValue && (
        <select aria-label={`Размер блока ${bid}`} title="Размер блока" value={sizeValue} onChange={(e) => onSize(e.target.value)} className={sel}>
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}

/* секция с настраиваемым размером и анимацией */
export function EditableBlock({
  bid,
  children,
  className = '',
  defaultAnim = 'up',
  defaultSize = 'md',
  id,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  noPad = false,
  sizeControl = true,
}: {
  bid: string
  children: ReactNode
  className?: string
  defaultAnim?: string
  defaultSize?: string
  id?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  noPad?: boolean
  sizeControl?: boolean
}) {
  const { ui, setUi } = useContent()
  const cfg = ui(bid)
  const anim = cfg.anim ?? defaultAnim
  const size = cfg.size ?? defaultSize
  const hidden = ANIM_HIDDEN[anim] ?? { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }

  return (
    <motion.section
      id={id}
      className={`relative ${noPad ? '' : PAD_CLASSES[size] ?? PAD_CLASSES.md} ${className}`}
      initial={ANIM_VARIANTS[anim] ?? ANIM_VARIANTS.up}
      whileInView={hidden}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      <BlockSettings
        bid={bid}
        animValue={anim}
        sizeValue={size}
        onAnim={(v) => setUi(bid, { anim: v })}
        onSize={(v) => setUi(bid, { size: v })}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        showSize={sizeControl}
      />
    </motion.section>
  )
}
