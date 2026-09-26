"use client"

import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

export function SlidingDigits({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      {[...value].map((char, index) => (
        <span key={index} aria-hidden className="relative inline-flex overflow-hidden whitespace-pre">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={char}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}
