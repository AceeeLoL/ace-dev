import { useEffect, useReducer, useRef } from 'react'

export type TerminalLine =
  | { kind: 'command'; text: string }
  | { kind: 'output'; text: string; highlight?: boolean }

interface TerminalProps {
  title: string
  lines: TerminalLine[]
  charMs?: number
  linePauseMs?: number
  startDelayMs?: number
}

interface TerminalState {
  line: number
  chars: number
  done: boolean
}

type Action =
  | { type: 'char' }
  | { type: 'nextLine' }
  | { type: 'finish' }
  | { type: 'complete' }

function reducer(state: TerminalState, action: Action): TerminalState {
  switch (action.type) {
    case 'char':
      return { ...state, chars: state.chars + 1 }
    case 'nextLine':
      return { line: state.line + 1, chars: 0, done: false }
    case 'finish':
      return { ...state, done: true }
    case 'complete':
      return { line: 1e9, chars: 1e9, done: true }
  }
}

export function Terminal({
  title,
  lines,
  charMs = 35,
  linePauseMs = 250,
  startDelayMs = 650,
}: TerminalProps) {
  const [state, dispatch] = useReducer(reducer, { line: 0, chars: 0, done: false })
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      dispatch({ type: 'complete' })
      return
    }

    let timer = 0
    let cancelled = false

    const step = () => {
      if (cancelled) return
      const current = stateRef.current
      if (current.done) return

      const line = lines[current.line]
      if (current.chars >= line.text.length) {
        if (current.line >= lines.length - 1) {
          dispatch({ type: 'finish' })
          return
        }
        dispatch({ type: 'nextLine' })
        timer = window.setTimeout(step, linePauseMs)
      } else {
        dispatch({ type: 'char' })
        timer = window.setTimeout(step, charMs)
      }
    }

    timer = window.setTimeout(step, startDelayMs)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [charMs, linePauseMs, startDelayMs, lines])

  return (
    <div className="overflow-hidden rounded-xl border border-cozy-border bg-cozy-bg/70 text-left backdrop-blur-sm">
      <div className="flex items-center gap-1.5 border-b border-cozy-border px-4 py-2.5">
        <span className="size-2 rounded-full bg-cozy-border/80" aria-hidden="true"></span>
        <span className="size-2 rounded-full bg-cozy-border/60" aria-hidden="true"></span>
        <span className="size-2 rounded-full bg-cozy-border/40" aria-hidden="true"></span>
        <span className="ml-2 font-mono text-[11px] text-cozy-muted">{title}</span>
      </div>
      <div className="px-4 py-4 font-mono text-sm leading-relaxed sm:px-5">
        {lines.map((line, i) => {
          const isCurrent = i === state.line && !state.done
          const text = isCurrent ? line.text.slice(0, state.chars) : line.text
          const withCaret = isCurrent || (state.done && i === lines.length - 1)
          const tone =
            line.kind === 'command' || (line.kind === 'output' && line.highlight)
              ? 'text-cozy-text'
              : 'text-cozy-muted'
          return (
            <p key={i} className={i > 0 && line.kind === 'command' ? 'mt-3 ' + tone : tone}>
              {line.kind === 'command' && <span className="text-cozy-muted">$ </span>}
              {text}
              {withCaret && <span className="caret" aria-hidden="true"></span>}
            </p>
          )
        })}
      </div>
    </div>
  )
}
