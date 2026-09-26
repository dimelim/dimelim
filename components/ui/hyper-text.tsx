"use client"

import { useReducedMotion } from "motion/react"
import { Fragment, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>/"

function randomGlyph() {
  return glyphs[Math.floor(Math.random() * glyphs.length)]
}

type HyperTextProps = {
  children: string
  className?: string
  glyphClassName?: string
  duration?: number
  delay?: number
  startOnView?: boolean
  animateOnHover?: boolean
}

export function HyperText({
  children,
  className,
  glyphClassName = "text-accent",
  duration = 800,
  delay = 0,
  startOnView = false,
  animateOnHover = false,
}: HyperTextProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [running, setRunning] = useState(false)
  const [scramble, setScramble] = useState<(string | null)[] | null>(null)

  useEffect(() => {
    if (reduceMotion) return
    let timeout: ReturnType<typeof setTimeout> | undefined
    const play = () => {
      timeout = setTimeout(() => setRunning(true), delay)
    }

    if (!startOnView) {
      play()
      return () => clearTimeout(timeout)
    }

    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        play()
      },
      { rootMargin: "0px 0px -20% 0px" },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [delay, startOnView, reduceMotion])

  useEffect(() => {
    if (!running) return
    const chars = [...children]
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      if (progress === 1) {
        setScramble(null)
        setRunning(false)
        return
      }
      const revealed = Math.floor(progress * chars.length)
      setScramble(
        chars.map((char, index) =>
          index < revealed || char === " " ? null : randomGlyph(),
        ),
      )
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [running, duration, children])

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={animateOnHover && !reduceMotion ? () => setRunning(true) : undefined}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {scramble ? (
          <Scrambled text={children} scramble={scramble} glyphClassName={glyphClassName} />
        ) : (
          children
        )}
      </span>
    </span>
  )
}

function Scrambled({
  text,
  scramble,
  glyphClassName,
}: {
  text: string
  scramble: (string | null)[]
  glyphClassName: string
}) {
  let offset = 0

  return text.split(" ").map((word, wordIndex) => {
    const start = offset
    const chars = [...word]
    offset += chars.length + 1

    return (
      <Fragment key={wordIndex}>
        {wordIndex > 0 && " "}
        <span className="whitespace-nowrap">
          {chars.map((char, index) => {
            const glyph = scramble[start + index]
            if (!glyph) return char
            return (
              <span key={index} className="relative inline-block">
                <span className="invisible">{char}</span>
                <span className={cn("absolute inset-0 text-center", glyphClassName)}>
                  {glyph}
                </span>
              </span>
            )
          })}
        </span>
      </Fragment>
    )
  })
}
