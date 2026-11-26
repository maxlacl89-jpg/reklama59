import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Download, Menu, PenLine, RotateCcw, Upload, X } from 'lucide-react'
import { DIRECTIONS } from '@/data/content'
import { useContent } from '@/lib/content'
import { Brackets, Corners } from './ui'

/* ===================== МЕНЮ ===================== */

const MENU = [
  { label: 'Компания', to: '/company', index: '01' },
  { label: 'Направления', to: '/directions', index: '02' },
  { label: 'Продукция', to: '/production', index: '03' },
  { label: 'Проекты', to: '/projects', index: '04' },
  { label: 'Карьера', to: '/career', index: '05' },
  { label: 'Статьи', to: '/articles', index: '06' },
  { label: 'Контакты', to: '/contacts', index: '07' },
]

function goTo(to: string) {
  const [path, hash] = to.split('#')
  if (window.location.pathname === path && hash) {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.href = to
  }
}

/* ===================== ШАПКА ===================== */

export function Header() {
  const { editing, setEditing } = useContent()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [canBack, setCanBack] = useState(false)

  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => setCanBack(window.history.length > 1 && window.location.pathname !== '/'), [location.pathname])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b border-[#16150F]/10 bg-white/85 backdrop-blur-md ${location.pathname === '/' ? 'site-header--home' : ''}`}>
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
          <Link to="/" className="site-logo flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1]/50" aria-label="На главную">
            <img src="/brand/logo-full.png" alt="Реклама59" className="h-6 w-auto md:h-7" draggable={false} />
          </Link>

          <div className="flex items-center gap-2.5">
            {canBack && (
              <button
                onClick={() => navigate(-1)}
                aria-label="Вернуться назад"
                title="Назад"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#16150F]/25 text-[#16150F] transition-colors hover:bg-[#16150F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1]/60"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <a
              href="tel:+73422148200"
              className="hidden cursor-pointer items-center gap-2.5 rounded-full border border-[#16150F]/25 px-5 py-2.5 text-[13px] font-bold text-[#16150F] transition-all duration-300 hover:bg-[#16150F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1]/50 md:inline-flex"
            >
              Связаться
              <span className="h-2 w-2 rounded-full bg-[#F44B43]" />
            </a>
            <button
              onClick={() => setEditing((e) => !e)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1]/70 ${
                editing ? 'bg-[#1813F1] text-white' : 'border border-[#16150F]/20 text-[#16150F]/80 hover:border-[#1813F1] hover:text-[#1813F1]'
              }`}
            >
              {editing ? <X className="h-3.5 w-3.5" /> : <PenLine className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{editing ? 'Готово' : 'Править'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Открыть меню"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#16150F]/25 text-[#16150F] transition-colors hover:bg-[#16150F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1813F1]/60"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* полноэкранное меню */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="blueprint fixed inset-0 z-[70] flex flex-col overflow-hidden bg-white"
          >
            <div className="flex h-16 items-center justify-between px-5 md:h-[72px] md:px-8">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                <img src="/brand/logo-full.png" alt="Реклама59" className="h-6 w-auto md:h-7" draggable={false} />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#16150F]/25 text-[#16150F] transition-colors hover:bg-[#16150F] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mx-auto grid w-full max-w-[1400px] flex-1 gap-10 overflow-y-auto px-5 pb-10 pt-6 md:grid-cols-[1.3fr_1fr] md:px-8 lg:grid-cols-[1.5fr_1fr_1fr]">
              {/* основные разделы */}
              <nav>
                {MENU.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.35 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-baseline gap-4 border-b border-[#16150F]/10 py-3.5 transition-colors ${
                          isActive ? 'text-[#1813F1]' : 'text-[#16150F] hover:text-[#1813F1]'
                        }`
                      }
                    >
                      <span className="font-display text-sm font-bold text-[#1813F1]">{item.index}/</span>
                      <span className="font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-extrabold leading-none tracking-tight">
                        {item.label}
                      </span>
                      <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100" />
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                >
                  <NavLink
                    to="/excursions"
                    className="group flex items-baseline gap-4 py-3.5 text-[#16150F] transition-colors hover:text-[#1813F1]"
                  >
                    <span className="font-display text-sm font-bold text-[#1813F1]">08/</span>
                    <span className="font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-extrabold leading-none tracking-tight">
                      Бизнес-экскурсии
                    </span>
                    <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100" />
                  </NavLink>
                </motion.div>
              </nav>

              {/* направления */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="hidden md:block"
              >
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#16150F]/45">Направления</p>
                <div className="mt-4 grid gap-2.5">
                  {DIRECTIONS.map((d) => (
                    <button
                      key={d.slug}
                      onClick={() => goTo(`/directions/${d.slug}`)}
                      className="cursor-pointer text-left text-sm font-semibold text-[#16150F]/70 transition-colors hover:text-[#1813F1]"
                    >
                      {d.menu}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* контакты */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#16150F]/45">Контакты</p>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-[#16150F]/80">
                  <a href="tel:+73422148200" className="transition-colors hover:text-[#1813F1]">+7 (342) 214-82-00</a>
                  <a href="mailto:zakaz@rpkreklama59.ru" className="break-all transition-colors hover:text-[#1813F1]">zakaz@rpkreklama59.ru</a>
                  <span className="text-[#16150F]/60">614010, г. Пермь, ул. Маршрутная, д. 15</span>
                  <span className="text-[#16150F]/60">Пн–Пт с 9:00 до 18:00</span>
                </div>
                <Corners className="mt-8 hidden h-20 w-20 text-[#16150F]/30 lg:block" />
              </motion.div>
            </div>

            <div className="border-t border-[#16150F]/10">
              <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#16150F]/45 md:px-8">
                <span>© {new Date().getFullYear()} Реклама59 · Рекламно-производственная компания</span>
                <span className="flex items-center gap-2">
                  <Brackets className="h-4 w-4" /> Пермь, 16 лет на рынке
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ===================== ПОДВАЛ ===================== */

export function Footer() {
  const { t } = useContent()
  return (
    <footer className="rounded-t-[2.5rem] bg-[#16150F] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Brackets className="h-9 w-9" />
              <span className="font-display text-xl font-extrabold tracking-tight">{t('brand.title')}</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              {t('brand.tagline')}. От концепции до реализации — 16 лет на рынке.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/40">Направления</h4>
            <div className="grid gap-2">
              {DIRECTIONS.slice(0, 6).map((d) => (
                <Link key={d.slug} to={`/directions/${d.slug}`} className="text-sm text-white/65 transition-colors hover:text-white">
                  {d.menu}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/40">Компания</h4>
            <div className="grid gap-2">
              <Link to="/company" className="text-sm text-white/65 transition-colors hover:text-white">О компании</Link>
              <Link to="/projects" className="text-sm text-white/65 transition-colors hover:text-white">Проекты</Link>
              <Link to="/excursions" className="text-sm text-white/65 transition-colors hover:text-white">Бизнес-экскурсии</Link>
              <Link to="/career" className="text-sm text-white/65 transition-colors hover:text-white">Карьера</Link>
              <Link to="/articles" className="text-sm text-white/65 transition-colors hover:text-white">Статьи</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/40">Контакты</h4>
            <div className="grid gap-2 text-sm text-white/65">
              <a href={`tel:${t('contacts.phone').replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-white">{t('contacts.phone')}</a>
              <a href={`mailto:${t('contacts.email')}`} className="transition-colors hover:text-white">{t('contacts.email')}</a>
              <span>{t('contacts.address')}</span>
              <span>{t('contacts.hours')}</span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
          <span>© {new Date().getFullYear()} {t('brand.title')} · Рекламно-производственная компания</span>
          <span>Политика конфиденциальности</span>
        </div>
      </div>
    </footer>
  )
}

/* ===================== ОБОЛОЧКА СТРАНИЦЫ + ПЕРЕХОД ===================== */

export function PageShell({ children, pageKey }: { children: React.ReactNode; pageKey: string }) {
  return (
    <motion.main
      key={pageKey}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}

/* шторка при переходе между страницами: каскад цветных полос */
export function TransitionCurtain() {
  const location = useLocation()
  const [active, setActive] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setActive(true)
    const tm = window.setTimeout(() => setActive(false), 620)
    return () => window.clearTimeout(tm)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[80] flex" aria-hidden="true">
          {[
            { bg: '#16150F', d: 0 },
            { bg: '#1813F1', d: 0.07 },
            { bg: '#F44B43', d: 0.14 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="h-full flex-1"
              style={{ background: s.bg, originY: 0 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 0.62, times: [0, 0.34, 0.62, 1], delay: s.d, ease: ['easeIn', 'linear', 'linear', 'easeOut'] }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.7], rotate: [-14, 0, 0, 10] }}
            transition={{ duration: 0.62, times: [0, 0.3, 0.66, 1], delay: 0.1, ease: 'easeInOut' }}
          >
            <Brackets className="h-20 w-20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ===================== ПАНЕЛЬ РЕДАКТОРА ===================== */

export function EditorBar() {
  const { editing, exportJson, importJson, reset } = useContent()
  const importRef = useRef<HTMLInputElement>(null)

  return (
    <>
      {editing && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-[#1813F1]/20 bg-[#1813F1]/[0.06] py-2 text-center text-xs font-semibold text-[#1813F1] backdrop-blur-sm md:top-[72px]">
          Режим редактирования: клик по тексту — изменить · клик по фото — заменить · изменения сохраняются автоматически
        </div>
      )}
      {editing && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#16150F]/15 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-md">
          <ToolBtn onClick={exportJson}><Download className="h-4 w-4" /><span className="hidden sm:inline">Экспорт</span></ToolBtn>
          <ToolBtn onClick={() => importRef.current?.click()}><Upload className="h-4 w-4" /><span className="hidden sm:inline">Импорт</span></ToolBtn>
          <span className="h-5 w-px bg-[#16150F]/15" />
          <ToolBtn onClick={reset}><RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Сброс</span></ToolBtn>
        </div>
      )}
      <input
        ref={importRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          importJson(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </>
  )
}

function ToolBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-[#16150F]/70 transition-colors hover:bg-[#16150F] hover:text-white"
    >
      {children}
    </button>
  )
}
