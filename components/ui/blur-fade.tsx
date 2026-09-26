"use client"

import { motion, useInView, type HTMLMotionProps } from "motion/react"
import { useRef } from "react"
import { fluid } from "@/lib/motion"

type BlurFadeProps = HTMLMotionProps<"div"> & {
  delay?: number
  offset?: number
  blur?: number
  duration?: number
}

export function BlurFade({
  delay = 0,
  offset = 64,
  blur = 12,
  duration = 0.8,
  ...props
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset, filter: `blur(${blur}px)` }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ delay, duration, ease: fluid }}
      {...props}
    />
  )
}
