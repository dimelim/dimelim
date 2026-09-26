"use client"

import { motion, useInView } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type TerminalLine =
  | { kind: "command"; text: string }
  | { kind: "output"; text: string; mark?: string }

type TerminalProps = {
  title: string
  lines: TerminalLine[]
  className?: string
}

const typingDelay = 42
const pauseAfter = { command: 320, output: 260 }

export function Terminal({ title, lines, className }: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(0)
  const done = step >= lines.length

  useEffect(() => {
    if (!inView || done) return
    const line = lines[step]
    const typing = line.kind === "command" && typed < line.text.length
    const timeout = setTimeout(
      () => {
        if (typing) {
          setTyped((count) => count + 1)
          return
        }
        setStep((current) => current + 1)
        setTyped(0)
      },
      typing ? typingDelay : pauseAfter[line.kind],
    )
    return () => clearTimeout(timeout)
  }, [inView, done, step, typed, lines])

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="size-2.5 rounded-full bg-surface-tertiary" />
        <span className="size-2.5 rounded-full bg-surface-tertiary" />
        <span className="size-2.5 rounded-full bg-surface-tertiary" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="h-px bg-border" />
      <pre className="overflow-x-auto p-4 font-mono text-sm">
        <code className="grid gap-1">
          {lines.map((line, index) => {
            const current = index === step
            const visible = index < step || (current && inView && line.kind === "command")
            const text = current ? line.text.slice(0, typed) : line.text

            return (
              <motion.span
                key={index}
                initial={false}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="whitespace-pre"
              >
                {line.kind === "command" ? (
                  <>
                    <span className="text-accent">$ </span>
                    <span className="text-foreground">{text}</span>
                    {current && <Caret />}
                  </>
                ) : (
                  <>
                    {line.mark && <span className="text-accent">[{line.mark}] </span>}
                    <span className="text-muted">{text}</span>
                  </>
                )}
              </motion.span>
            )
          })}
          <span className={cn("whitespace-pre", !done && "invisible")}>
            <span className="text-accent">$ </span>
            <Caret />
          </span>
        </code>
      </pre>
    </div>
  )
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-caret-blink bg-accent motion-reduce:animate-none" />
  )
}
