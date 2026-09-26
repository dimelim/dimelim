"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { flushSync } from "react-dom"

export type Team = "red" | "blue"

type TeamContextValue = {
  team: Team
  changeTeam: (next: Team, origin?: Element | null) => void
}

const TeamContext = createContext<TeamContextValue | null>(null)

function revealFrom(origin: Element | null | undefined) {
  const rect = origin?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 700,
      easing: "cubic-bezier(0.32, 0.72, 0, 1)",
      pseudoElement: "::view-transition-new(root)",
    },
  )
}

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>("red")

  function changeTeam(next: Team, origin?: Element | null) {
    if (next === team) return

    const apply = () => {
      document.documentElement.dataset.team = next
      flushSync(() => setTeam(next))
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || !("startViewTransition" in document)) {
      apply()
      return
    }

    document.startViewTransition(apply).ready.then(
      () => revealFrom(origin),
      () => undefined,
    )
  }

  return <TeamContext value={{ team, changeTeam }}>{children}</TeamContext>
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (!context) throw new Error("useTeam necesita un TeamProvider")
  return context
}
