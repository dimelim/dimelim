"use client"

import { ToggleButton, ToggleButtonGroup } from "@heroui/react"
import { motion } from "motion/react"
import { useRef } from "react"
import { useTeam, type Team } from "@/components/team"

const teams: { id: Team; label: string }[] = [
  { id: "red", label: "Red" },
  { id: "blue", label: "Blue" },
]

export function TeamSwitch() {
  const { team, changeTeam } = useTeam()
  const buttons = useRef<Partial<Record<Team, HTMLButtonElement | null>>>({})

  return (
    <ToggleButtonGroup
      aria-label="Equipo"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[team]}
      onSelectionChange={(keys) => {
        const next = [...keys][0] as Team
        changeTeam(next, buttons.current[next])
      }}
      isDetached
      size="sm"
      className="gap-0 rounded-full bg-white/5 p-1"
    >
      {teams.map(({ id, label }) => (
        <ToggleButton
          key={id}
          id={id}
          ref={(element) => {
            buttons.current[id] = element
          }}
          className="h-8 bg-transparent px-3 font-semibold text-muted hover:text-foreground data-[selected=true]:bg-transparent data-[selected=true]:text-accent-foreground md:h-8"
        >
          {team === id && (
            <motion.span
              layoutId="team-pill"
              transition={{ duration: 0.5 }}
              className="absolute inset-0 -z-10 rounded-full bg-accent"
            />
          )}
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
