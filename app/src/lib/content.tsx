import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { DEFAULT_CONTENT } from '@/data/content'
import type { SiteContent } from '@/data/content'

const STORAGE_KEY = 'r59-content-v1'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o: unknown, k) => {
    if (o == null) return undefined
    return (o as Record<string, unknown>)[k]
  }, obj)
}

function setPath(obj: unknown, path: string, value: unknown): void {
  const keys = path.split('.')
  let cur = obj as Record<string, unknown>
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]] = value
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/* сохранённый контент поверх свежих умолчаний: новые поля не теряются */
function deepMerge(base: Record<string, unknown>, over: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base }
  for (const k of Object.keys(over)) {
    const b = base[k]
    const o = over[k]
    out[k] = isObj(b) && isObj(o) ? deepMerge(b, o) : o !== undefined ? o : b
  }
  return out
}

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SiteContent
      if (parsed && parsed.brand && parsed.home && parsed.contacts) {
        return deepMerge(clone(DEFAULT_CONTENT) as unknown as Record<string, unknown>, parsed as unknown as Record<string, unknown>) as unknown as SiteContent
      }
    }
  } catch {
    // ignore
  }
  return clone(DEFAULT_CONTENT)
}

interface ContentCtx {
  content: SiteContent
  editing: boolean
  setEditing: (v: boolean | ((p: boolean) => boolean)) => void
  t: (path: string) => string
  get: (path: string) => unknown
  set: (path: string, value: string) => void
  ui: (key: string) => { size?: string; anim?: string }
  setUi: (key: string, patch: { size?: string; anim?: string; order?: string[] }) => void
  pushItem: (path: string, item: unknown) => void
  removeAt: (path: string, index: number) => void
  exportJson: () => void
  importJson: (file: File | undefined) => void
  reset: () => void
  fileToResizedDataUrl: (file: File) => Promise<string>
}

const Ctx = createContext<ContentCtx | null>(null)

export function useContent(): ContentCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useContent outside provider')
  return ctx
}

export function resizeImage(file: File, maxSide = 1800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx2 = canvas.getContext('2d')
        if (!ctx2) throw new Error('no 2d')
        ctx2.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      } catch (e) {
        URL.revokeObjectURL(url)
        reject(e)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('load failed'))
    }
    img.src = url
  })
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch {
      toast.error('Хранилище переполнено — удалите часть загруженных фото')
    }
  }, [content])

  const t = useCallback((path: string) => {
    const v = getPath(content, path)
    return typeof v === 'string' ? v : ''
  }, [content])

  const get = useCallback((path: string) => getPath(content, path), [content])

  const set = useCallback((path: string, value: string) => {
    setContent((c) => {
      const next = clone(c)
      setPath(next, path, value)
      return next
    })
  }, [])

  const ui = useCallback((key: string) => content.ui?.[key] ?? {}, [content.ui])

  const setUi = useCallback((key: string, patch: { size?: string; anim?: string; order?: string[] }) => {
    setContent((c) => {
      const next = clone(c)
      next.ui = next.ui ?? {}
      next.ui[key] = { ...next.ui[key], ...patch }
      return next
    })
  }, [])

  const pushItem = useCallback((path: string, item: unknown) => {
    setContent((c) => {
      const next = clone(c)
      const arr = getPath(next, path)
      if (Array.isArray(arr)) arr.push(item)
      return next
    })
  }, [])

  const removeAt = useCallback((path: string, index: number) => {
    setContent((c) => {
      const next = clone(c)
      const arr = getPath(next, path)
      if (Array.isArray(arr) && arr.length > 1) arr.splice(index, 1)
      return next
    })
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-content.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Файл site-content.json сохранён')
  }, [content])

  const importJson = useCallback((file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteContent
        if (!parsed || !parsed.brand || !Array.isArray(parsed.home?.stats)) throw new Error('bad')
        setContent(parsed)
        toast.success('Контент импортирован')
      } catch {
        toast.error('Файл не похож на экспорт сайта')
      }
    }
    reader.readAsText(file)
  }, [])

  const reset = useCallback(() => {
    if (!window.confirm('Вернуть исходный контент? Ваши изменения будут удалены.')) return
    localStorage.removeItem(STORAGE_KEY)
    setContent(clone(DEFAULT_CONTENT))
    toast.success('Исходный контент восстановлен')
  }, [])

  const value = useMemo<ContentCtx>(
    () => ({
      content, editing, setEditing, t, get, set, ui, setUi, pushItem, removeAt, exportJson, importJson, reset,
      fileToResizedDataUrl: resizeImage,
    }),
    [content, editing, t, get, set, ui, setUi, pushItem, removeAt, exportJson, importJson, reset]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
