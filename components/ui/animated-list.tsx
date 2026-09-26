"use client"

import { AnimatePresence, motion, useInView } from "motion/react"
import { Children, useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type AnimatedListProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedList({ children, className, delay = 1200 }: AnimatedListProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const items = Children.toArray(children)
  const [count, setCount] = useState(0)
  const shown = items.slice(0, count).map((item, index) => ({ item, index })).reverse()

  useEffect(() => {
    if (!inView || count >= items.length) return
    const timeout = setTimeout(() => setCount((current) => current + 1), count === 0 ? 300 : delay)
    return () => clearTimeout(timeout)
  }, [inView, count, items.length, delay])

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence initial={false}>
        {shown.map(({ item, index }) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.9, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
