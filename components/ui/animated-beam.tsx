"use client"

import { motion } from "motion/react"
import { useEffect, useId, useState, type RefObject } from "react"

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  active: boolean
  curvature?: number
  reverse?: boolean
  delay?: number
  duration?: number
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  active,
  curvature = 0,
  reverse = false,
  delay = 0,
  duration = 4,
}: AnimatedBeamProps) {
  const id = useId()
  const [path, setPath] = useState("")
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const from = fromRef.current
      const to = toRef.current
      if (!from || !to) return
      const box = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      const startX = a.left - box.left + a.width / 2
      const startY = a.top - box.top + a.height / 2
      const endX = b.left - box.left + b.width / 2
      const endY = b.top - box.top + b.height / 2
      setSize({ width: box.width, height: box.height })
      setPath(`M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`)
    }

    const observer = new ResizeObserver(update)
    observer.observe(container)
    update()
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature])

  const x1 = reverse ? ["90%", "-10%"] : ["10%", "110%"]
  const x2 = reverse ? ["100%", "0%"] : ["0%", "100%"]

  return (
    <svg
      aria-hidden
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className="pointer-events-none absolute top-0 left-0"
    >
      <path d={path} strokeWidth={2} strokeLinecap="round" className="stroke-white/10" />
      {active && (
        <>
          <path d={path} strokeWidth={2} strokeLinecap="round" stroke={`url(#${id})`} />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{ x1, x2, y1: ["0%", "0%"], y2: ["0%", "0%"] }}
              transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity }}
            >
              <stop style={{ stopColor: "var(--accent)" }} stopOpacity="0" />
              <stop style={{ stopColor: "var(--accent)" }} />
              <stop offset="32.5%" style={{ stopColor: "var(--foreground)" }} />
              <stop offset="100%" style={{ stopColor: "var(--foreground)" }} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  )
}
