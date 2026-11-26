import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EditableText from '@/components/EditableText'
import { EditableImage, Marquee } from '@/components/site/ui'
import { useContent } from '@/lib/content'
import { DIRECTIONS, PROJECTS } from '@/data/content'
import type { StatItem } from '@/data/content'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

type HeroTile = {
  src: string
  alt: string
  path?: string
  active?: boolean
  muted?: boolean
}

const HERO_TILES: readonly HeroTile[] = [
  { path: 'home.heroImg1', src: '/projects/may9/1.jpg', alt: 'Арт-объект ко Дню Победы', active: true },
  { src: '/projects/permperiod/1.jpg', alt: 'Брендирование городского пространства' },
  { path: 'home.heroImg2', src: '/projects/ohara/1.jpg', alt: 'Оформление ресторана Охара', muted: true },
  { path: 'home.heroImg3', src: '/projects/blogers/1.jpg', alt: 'Фестиваль Блогеры России', muted: true },
  { src: '/projects/sibur/1.jpg', alt: 'Стела СИБУР' },
  { src: '/projects/krasnaya/1.jpg', alt: 'Проект Красная машина' },
  { src: '/projects/domschastya/1.jpg', alt: 'Оформление жилого комплекса' },
] as const

function getHeroTitleLines(text: string): string[] {
  const sourceLines = text.split('.').map((line) => line.trim()).filter(Boolean)
  const words = sourceLines.join(' ').split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['']

  const totalLength = words.join(' ').length
  const automaticCount = totalLength > 70 ? 4 : totalLength > 42 ? 3 : totalLength > 18 ? 2 : 1
  const lineCount = Math.min(words.length, 4, Math.max(sourceLines.length, automaticCount))
  if (lineCount === 1) return [words.join(' ')]

  const target = totalLength / lineCount
  const costs = Array.from({ length: lineCount + 1 }, () => Array<number>(words.length + 1).fill(Infinity))
  const cuts = Array.from({ length: lineCount + 1 }, () => Array<number>(words.length + 1).fill(0))
  costs[0]![0] = 0

  for (let count = 1; count <= lineCount; count += 1) {
    for (let end = 1; end <= words.length; end += 1) {
      for (let start = count - 1; start < end; start += 1) {
        const lineLength = words.slice(start, end).join(' ').length
        const cost = costs[count - 1]![start]! + (lineLength - target) ** 2
        if (cost < costs[count]![end]!) {
          costs[count]![end] = cost
          cuts[count]![end] = start
        }
      }
    }
  }

  const lines: string[] = []
  let end = words.length
  for (let count = lineCount; count > 0; count -= 1) {
    const start = cuts[count]![end]!
    lines.unshift(words.slice(start, end).join(' '))
    end = start
  }
  return lines
}

export default function Home() {
  const { t, set, editing, get } = useContent()
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeDirection, setActiveDirection] = useState(0)

  const stats = get('home.stats') as StatItem[]
  const marqueeWords = get('home.marquee') as string[]
  const partners = get('home.partners') as string[]
  const featuredSlugs = get('home.featured') as string[]
  const featured = featuredSlugs
    .map((slug) => PROJECTS.find((project) => project.slug === slug))
    .filter((project): project is (typeof PROJECTS)[number] => Boolean(project))
  const heroTitle = t('home.title')
  const titleLines = getHeroTitleLines(heroTitle)
  const longestLine = Math.max(1, ...titleLines.map((line) => line.length))
  const desktopBaseSize = [7.2, 6.3, 5.65, 4.9][titleLines.length - 1] ?? 4.9
  const mobileBaseSize = [14, 12.5, 11.2, 9.8][titleLines.length - 1] ?? 9.8
  const heroTypeStyle = {
    '--hero-font-size': `${Math.min(desktopBaseSize, 100 / longestLine)}vw`,
    '--hero-font-size-mobile': `${Math.min(mobileBaseSize, 150 / longestLine)}vw`,
  } as CSSProperties
  const direction = DIRECTIONS[activeDirection] ?? DIRECTIONS[0]!

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const header = document.querySelector('.site-header--home')
    const setHeaderDark = (dark: boolean) => header?.classList.toggle('is-dark', dark)
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      const setupHero = (mobile: boolean) => {
        const hero = heroRef.current
        if (!hero) return
        const tiles = gsap.utils.toArray<HTMLElement>('.hero-tile', hero)
        const active = hero.querySelector<HTMLElement>('.hero-tile--active')
        const stackWidth = () => mobile ? window.innerWidth * 0.8 : Math.min(window.innerWidth * 0.36, 520)
        const stackHeight = () => mobile ? window.innerHeight * 0.44 : Math.min(window.innerHeight * 0.38, 370)
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: () => `+=${mobile ? 1350 : 2200}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setHeaderDark(self.progress > 0.55),
          },
        })

        timeline
          .to('.hero-meta', { opacity: 0, duration: 0.16 }, 0)
          .to('.hero-copy__line', {
            xPercent: (index) => index % 2 === 0 ? -135 : 135,
            opacity: 0,
            duration: 0.28,
            ease: 'power2.inOut',
          }, 0)

        tiles.forEach((tile, index) => {
          timeline.to(tile, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            width: stackWidth,
            height: stackHeight,
            rotation: mobile ? (index - 3) * 1.5 : (index - 3) * 2.2,
            duration: 0.44,
            ease: 'power3.inOut',
          }, 0.03 + index * 0.015)
        })

        timeline
          .to('.hero-copy', { opacity: 0, duration: 0.16 }, 0.48)
          .to(tiles.filter((tile) => tile !== active), { opacity: 0, scale: 0.88, duration: 0.18 }, 0.5)
          .to(active, {
            width: '100vw',
            height: '100svh',
            rotation: 0,
            duration: 0.38,
            ease: 'power2.inOut',
          }, 0.54)
          .to('.hero-scroll-note', { opacity: 0, duration: 0.15 }, 0.46)
          .to('.hero-bottom', { opacity: 0, duration: 0.15 }, 0.5)
          .to('.hero-tile__tag', { opacity: 0, duration: 0.15 }, 0.5)
      }

      const setupProjects = () => {
        const section = projectsRef.current
        const track = trackRef.current
        if (!section || !track || featured.length < 2) return
        const distance = () => window.innerWidth * (featured.length - 1)
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        timeline
          .to(track, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
          .fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
      }

      media.add('(min-width: 768px)', () => {
        setupHero(false)
        setupProjects()
      })
      media.add('(max-width: 767px)', () => setupHero(true))

      const headerThemes = [
        ['.about-scene', true],
        ['.directions-scene', false],
        ['.projects-scene', true],
        ['.team-scene', true],
        ['.final-scene', true],
      ] as const
      headerThemes.forEach(([selector, dark]) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 72px',
          end: 'bottom 72px',
          onEnter: () => setHeaderDark(dark),
          onEnterBack: () => setHeaderDark(dark),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 90, opacity: 0 }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top 92%', end: 'top 48%', scrub: 0.8 },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-team-photo]').forEach((photo, index) => {
        gsap.fromTo(photo, { y: 170 + index * 45, rotation: index === 1 ? 14 : -14 }, {
          y: 0,
          rotation: index === 1 ? 5 : -5,
          ease: 'none',
          scrollTrigger: { trigger: '.team-scene', start: 'top 85%', end: 'bottom 35%', scrub: 1 },
        })
      })

      gsap.utils.toArray<HTMLElement>('.final-line').forEach((line, index) => {
        gsap.fromTo(line, { xPercent: index === 1 ? 18 : -18 }, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.final-scene', start: 'top 85%', end: 'center 45%', scrub: 1 },
        })
      })
    }, rootRef)

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => {
      window.clearTimeout(refresh)
      media.revert()
      context.revert()
      header?.classList.remove('is-dark')
    }
  }, [featured.length, editing, heroTitle])

  return (
    <div ref={rootRef} className="home-page">
      <section ref={heroRef} className="hero-scene" aria-label="Реклама59 — дизайн, производство и монтаж">
        <div className="hero-meta hero-meta--left">
          Дизайн<br />Производство<br />Монтаж
        </div>
        <div className="hero-meta hero-meta--right">Начать проект <ArrowUpRight /></div>

        <h1 className="hero-copy" style={heroTypeStyle}>
          {editing ? (
            <EditableText
              as="span"
              value={heroTitle}
              onChange={(value) => set('home.title', value)}
              editing={editing}
              className="block text-center"
            />
          ) : (
            titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className="hero-copy__line">{line}</span>
            ))
          )}
        </h1>

        <div className="hero-media">
          {HERO_TILES.map((tile, index) => (
            <div
              key={`${tile.src}-${index}`}
              className={`hero-tile hero-tile--${index + 1} ${tile.active ? 'hero-tile--active' : ''} ${tile.muted ? 'hero-tile--muted' : ''}`}
              style={{ '--rotation': `${index % 2 === 0 ? -2 + index * 0.35 : 2 - index * 0.2}deg` } as CSSProperties}
            >
              {tile.path ? (
                <EditableImage path={tile.path} src={t(tile.path)} alt={tile.alt} className="h-full w-full" />
              ) : (
                <img src={tile.src} alt={tile.alt} className="h-full w-full object-cover" />
              )}
              {index === 0 && <span className="hero-tile__tag">Реальный объект / Пермь</span>}
              {index === 2 && (
                <span className="hero-tile__tags"><i>Печать</i><i>Дизайн</i><i>Монтаж</i></span>
              )}
            </div>
          ))}
        </div>

        <div className="hero-bottom hero-bottom--left">58.96° N<br />56.31° E</div>
        <div className="hero-bottom hero-bottom--center">16 лет в производстве<br />2010 — 2026</div>
        <div className="hero-bottom hero-bottom--right hero-scroll-note">Скролл<br />[ 00:00:00:01 ]</div>
        <ArrowDown className="hero-arrow" strokeWidth={1.4} />
      </section>

      <section className="about-scene">
        <div className="scene-kicker" data-reveal>01/ О компании</div>
        <p className="about-statement" data-reveal>
          Не просто макет в презентации. Проектируем, производим и устанавливаем рекламу в реальном пространстве.
        </p>
        <div className="about-description" data-reveal>
          <EditableText
            as="p"
            value={t('home.subtitle')}
            onChange={(value) => set('home.subtitle', value)}
            editing={editing}
            multiline
          />
          <Link to="/company" className="text-link">О компании <ArrowUpRight /></Link>
        </div>
        <div className="stats-row" data-reveal>
          {stats.map((stat, index) => (
            <div key={index} className="stat-cell">
              <strong><EditableText as="span" value={stat.value} onChange={(value) => set(`home.stats.${index}.value`, value)} editing={editing} /></strong>
              <EditableText as="span" value={stat.label} onChange={(value) => set(`home.stats.${index}.label`, value)} editing={editing} multiline />
            </div>
          ))}
        </div>
      </section>

      <section className="directions-scene">
        <div className="scene-kicker" data-reveal>02/ Направления</div>
        <div className="directions-layout">
          <div className="directions-list">
            {DIRECTIONS.map((item, index) => (
              <Link
                key={item.slug}
                to={`/directions/${item.slug}`}
                className={`direction-row ${activeDirection === index ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveDirection(index)}
                onFocus={() => setActiveDirection(index)}
                data-reveal
              >
                <span>{item.menu}<sup>{String(index + 1).padStart(2, '0')}</sup></span>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
          <div className="direction-preview" aria-hidden="true">
            <img key={direction.slug} src={direction.image} alt="" />
            <span>{String(activeDirection + 1).padStart(2, '0')} / {String(DIRECTIONS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      <section ref={projectsRef} className="projects-scene">
        <div className="projects-head">
          <span>03/ Выбранные проекты</span>
          <Link to="/projects">Все проекты <ArrowUpRight /></Link>
        </div>
        <div ref={trackRef} className="projects-track">
          {featured.map((project, index) => {
            const projectIndex = PROJECTS.indexOf(project)
            return (
              <article key={project.slug} className="project-panel">
                <div className="project-copy">
                  <span className="project-index">{String(index + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
                  <EditableText
                    as="p"
                    value={t(`projects.items.${projectIndex}.category`) || project.category}
                    onChange={(value) => set(`projects.items.${projectIndex}.category`, value)}
                    editing={editing}
                    className="project-category"
                  />
                  <EditableText
                    as="h2"
                    value={t(`projects.items.${projectIndex}.title`) || project.title}
                    onChange={(value) => set(`projects.items.${projectIndex}.title`, value)}
                    editing={editing}
                  />
                  <EditableText
                    as="p"
                    value={t(`projects.items.${projectIndex}.client`) || project.client}
                    onChange={(value) => set(`projects.items.${projectIndex}.client`, value)}
                    editing={editing}
                    className="project-client"
                  />
                  <Link to={`/projects/${project.slug}`} className="project-link">Смотреть проект <ArrowUpRight /></Link>
                </div>
                <Link to={`/projects/${project.slug}`} className="project-visual" tabIndex={editing ? -1 : undefined} onClick={(event) => editing && event.preventDefault()}>
                  <EditableImage
                    path={`projects.items.${projectIndex}.cover`}
                    src={t(`projects.items.${projectIndex}.cover`) || project.cover}
                    alt={project.title}
                    className="h-full w-full"
                  />
                  <span className="project-plus"><Plus /></span>
                </Link>
              </article>
            )
          })}
        </div>
        <div className="projects-progress"><div ref={progressRef} /></div>
      </section>

      <section className="team-scene">
        <div className="team-copy" data-reveal>
          <div className="scene-kicker">04/ Команда</div>
          <h2>Свои люди.<br />Своё производство.<br />Одна ответственность.</h2>
          <p>Дизайнеры, печатники, инженеры и монтажные бригады работают в одном процессе. Поэтому не теряем смысл между идеей и готовым объектом.</p>
          <Link to="/production" className="text-link">Производство <ArrowUpRight /></Link>
        </div>
        <div className="team-photos" aria-hidden="true">
          {['/projects/goodlife/2.jpg', '/projects/sibur/2.jpg', '/projects/domschastya/2.jpg'].map((image, index) => (
            <img key={image} src={image} alt="" data-team-photo className={`team-photo team-photo--${index + 1}`} loading="lazy" />
          ))}
        </div>
      </section>

      <div className="partners-strip">
        <Marquee words={partners} dark />
      </div>

      <section className="final-scene">
        <div className="scene-kicker">05/ Новый проект</div>
        <div className="final-title">
          <span className="final-line">Давайте</span>
          <span className="final-line">сделаем</span>
          <span className="final-line">вместе.</span>
        </div>
        <p>{marqueeWords.slice(0, 4).join(' · ')}</p>
        <Link to="/contacts" className="final-cta">
          <EditableText as="span" value={t('home.cta')} onChange={(value) => set('home.cta', value)} editing={editing} />
          <ArrowUpRight />
        </Link>
      </section>
    </div>
  )
}
