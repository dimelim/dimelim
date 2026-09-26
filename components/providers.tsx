"use client"

import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"
import { TeamProvider } from "@/components/team"
import { fluid } from "@/lib/motion"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: fluid }}>
      <TeamProvider>{children}</TeamProvider>
    </MotionConfig>
  )
}
