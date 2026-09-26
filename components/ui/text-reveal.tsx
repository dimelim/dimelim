"use client"

import { useMotionValueEvent, useScroll } from "motion/react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Segment = { text: string; accent?: boolean }

export function TextReveal({ segments, className }: { segments: Segment[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const words = segments.flatMap((segment) =>
    segment.text.split(" ").map((word) => ({ word, accent: segment.accent })),
  )
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.ceil(progress * words.length))
  })

  return (
    <div ref={ref} className={cn("relative h-[180vh]", className)}>
      <div className="sticky top-0 flex h-svh items-center">
        <p className="mx-auto max-w-[680px] text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {words.map(({ word, accent }, index) => (
            <span
              key={index}
              className={cn(
                "transition-colors duration-700 ease-out-fluid",
                index >= active && "text-foreground/25",
                index < active && (accent ? "text-accent" : "text-foreground"),
              )}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
