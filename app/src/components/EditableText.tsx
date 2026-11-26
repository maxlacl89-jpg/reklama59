import { createElement, forwardRef, useEffect, useRef } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'a' | 'blockquote'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  editing: boolean
  as?: Tag
  className?: string
  multiline?: boolean
  placeholder?: string
  style?: CSSProperties
  href?: string
}

interface InnerProps {
  tag: Tag
  className?: string
  style?: CSSProperties
  href?: string
  value: string
  editing: boolean
  multiline: boolean
  placeholder?: string
  onCommit: (value: string) => void
}

const Inner = forwardRef<HTMLSpanElement, InnerProps>(function Inner(props, outerRef) {
  const { tag, className, style, href, value, editing, multiline, placeholder, onCommit } = props
  const innerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = innerRef.current
    if (el && document.activeElement !== el && el.innerText !== value) {
      el.innerText = value
    }
  }, [value, editing])

  const editableProps: Record<string, unknown> = editing
    ? {
        contentEditable: true,
        suppressContentEditableWarning: true,
        spellCheck: false,
        'data-placeholder': placeholder,
        onBlur: () => {
          const el = innerRef.current
          if (el) onCommit(el.textContent?.replace(/\n{3,}/g, '\n\n').trimEnd() ?? '')
        },
        onKeyDown: (e: KeyboardEvent) => {
          if (!multiline && e.key === 'Enter') {
            e.preventDefault()
            ;(e.target as HTMLElement).blur()
          }
          if (e.key === 'Escape') (e.target as HTMLElement).blur()
        },
      }
    : {}

  return createElement(tag, {
    ref: (node: HTMLElement | null) => {
      innerRef.current = node
      if (typeof outerRef === 'function') outerRef(node)
      else if (outerRef) (outerRef as { current: HTMLElement | null }).current = node
    },
    className,
    style,
    href: href ?? undefined,
    ...editableProps,
  })
})

/** Текст, который в режиме редактирования меняется прямо по клику. */
export default function EditableText({
  value,
  onChange,
  editing,
  as = 'span',
  className,
  multiline = false,
  placeholder,
  style,
  href,
}: EditableTextProps) {
  const ref = useRef<HTMLElement | null>(null)

  return (
    <Inner
      ref={ref}
      tag={as}
      className={className}
      style={style}
      href={href}
      value={value}
      editing={editing}
      multiline={multiline}
      placeholder={placeholder}
      onCommit={onChange}
    />
  )
}
