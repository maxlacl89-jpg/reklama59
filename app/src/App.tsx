import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Toaster } from 'sonner'
import { ContentProvider, useContent } from '@/lib/content'
import { EditorBar, Footer, Header, PageShell, TransitionCurtain } from '@/components/site/layout'
import Home from '@/pages/Home'
import Company from '@/pages/Company'
import Directions, { DirectionDetail } from '@/pages/Directions'
import Production from '@/pages/Production'
import Projects, { ProjectDetail } from '@/pages/Projects'
import { Articles, Career, Contacts, Excursions, NotFound } from '@/pages/Misc'

function DirectionRoute() {
  const { slug } = useParams()
  return <DirectionDetail slug={slug ?? ''} />
}

function ProjectRoute() {
  const { slug } = useParams()
  return <ProjectDetail slug={slug ?? ''} />
}

function Shell() {
  const location = useLocation()
  const { editing } = useContent()
  const lenisRef = useRef<Lenis | null>(null)

  // плавный скролл
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    // при переходе на новую страницу — всегда наверх
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    // якоря (#about и т.п.) при загрузке страницы
    const hash = window.location.hash.slice(1)
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    }
  }, [location.pathname])

  return (
    <div className={editing ? 'editing' : ''}>
      <Header />
      <TransitionCurtain />
      <AnimatePresence mode="wait">
        <PageShell pageKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/company" element={<Company />} />
            <Route path="/directions" element={<Directions />} />
            <Route path="/directions/:slug" element={<DirectionRoute />} />
            <Route path="/production" element={<Production />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectRoute />} />
            <Route path="/excursions" element={<Excursions />} />
            <Route path="/career" element={<Career />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageShell>
      </AnimatePresence>
      <Footer />
      <EditorBar />
      <Toaster theme="light" position="bottom-center" toastOptions={{ style: { background: '#101014', border: 'none', color: '#fff' } }} />
      <div className="noise" aria-hidden="true" />
    </div>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <Shell />
    </ContentProvider>
  )
}
