import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from 'motion/react'
import Lenis from 'lenis'
import { Constellation } from './components/Constellation'
import { Terminal, type TerminalLine } from './components/Terminal'

const status = [
  { index: '01', label: 'setup', detail: 'tooling, structure, this page', state: 'done' },
  { index: '02', label: 'scene', detail: 'the 3D corner — modeled in Blender', state: 'active' },
  { index: '03', label: 'shipping', detail: 'this page becomes the real thing', state: 'next' },
] as const

const terminalLines: TerminalLine[] = [
  { kind: 'command', text: 'whoami' },
  { kind: 'output', text: 'Luigi Ace A. Losa — 3rd year Computer Science student, aspiring data engineer' },
  { kind: 'command', text: 'status' },
  { kind: 'output', text: 'working on the 3D blender scene', highlight: true },
  { kind: 'command', text: 'plan' },
  { kind: 'output', text: 'new portfolio · cleaner writing · build efficiently' },
]

const stateDot: Record<(typeof status)[number]['state'], string> = {
  done: 'bg-cozy-ok',
  active: 'bg-cozy-hazard',
  next: 'bg-cozy-border',
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function App() {
  const reduceMotion = useReducedMotion()
  const spotX = useMotionValue(-999)
  const spotY = useMotionValue(-999)
  const springX = useSpring(spotX, { stiffness: 60, damping: 20 })
  const springY = useSpring(spotY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return

    const onMove = (event: MouseEvent) => {
      spotX.set(event.clientX)
      spotY.set(event.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [spotX, spotY])

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    })

    let frame = 0

    const onFrame = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(onFrame)
    }

    frame = window.requestAnimationFrame(onFrame)

    return () => {
      window.cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-cozy-bg text-cozy-text">
      <Constellation />
      <div className="vignette pointer-events-none fixed inset-0 z-0" aria-hidden="true"></div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1]"
        style={{ x: springX, y: springY }}
      >
        <div className="h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(211,163,71,0.12),transparent_60%)]" />
      </motion.div>

      <header className="relative z-10 border-b border-cozy-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-cozy-text">ace.dev</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cozy-muted">
            v0.1
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="w-full max-w-xl"
        >
          <motion.div variants={itemVariants} className="relative isolate text-center">
            <div
              className="glow-headline pointer-events-none absolute inset-x-0 -top-12 z-[-1] mx-auto h-40 w-3/4 rounded-full"
              aria-hidden="true"
            ></div>
            <h1 className="headline relative font-sans text-cozy-text">
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }}
                className="inline-block"
              >
                under
              </motion.span>{' '}
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.42 }}
                className="relative inline-block"
              >
                <span className="italic text-gradient-warm">
                  construction
                  <span className="caret caret--headline text-cozy-text" aria-hidden="true"></span>
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-px overflow-hidden rounded-full bg-cozy-border/50">
                  <motion.span
                    initial={reduceMotion ? false : { width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
                    className="block h-full bg-cozy-hazard"
                  />
                </span>
              </motion.span>
            </h1>

            <div className="mt-12 text-left">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-cozy-muted">
                <span>building</span>
                <span>60%</span>
              </div>
              <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-cozy-border/60">
                <motion.div
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 1 }}
                  className="progress-fill h-full rounded-full bg-cozy-hazard"
                >
                  <span className="progress-shimmer" aria-hidden="true"></span>
                </motion.div>
                <span className="progress-tip" aria-hidden="true"></span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-left">
            <Terminal title="~/build.log" lines={terminalLines} />
            <ul className="mt-10">
              {status.map((entry) => (
                <li
                  key={entry.index}
                  className="flex items-center gap-4 border-t border-cozy-border py-3 last:border-b"
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${stateDot[entry.state]}`}
                    aria-hidden="true"
                  ></span>
                  <span className="font-mono text-xs text-cozy-muted">{entry.index}</span>
                  <span className="text-sm text-cozy-text">{entry.label}</span>
                  <span className="ml-auto hidden font-mono text-xs text-cozy-muted sm:block">
                    {entry.detail}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-cozy-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 pb-5 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cozy-muted/70">
            © 2026 · hand-built
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cozy-muted/70">
            Still in progress
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
