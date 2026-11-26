import type { SiteData } from '@/types/site'

const STORAGE_KEY = 'site-constructor-v3'

export function loadSite(fallback: () => SiteData): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SiteData
      if (parsed && Array.isArray(parsed.blocks) && typeof parsed.title === 'string') {
        return parsed
      }
    }
  } catch {
    // повреждённые данные — берём демо
  }
  return fallback()
}

export function saveSite(data: SiteData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false // переполнение квоты localStorage
  }
}

export function clearSite(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** Читает картинку, уменьшает до разумного размера и возвращает data-url (JPEG). */
export function fileToResizedDataUrl(file: File, maxSide = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('no 2d context')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(objectUrl)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      } catch (e) {
        URL.revokeObjectURL(objectUrl)
        reject(e)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('image load failed'))
    }
    img.src = objectUrl
  })
}
