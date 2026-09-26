"use client"

import { useTeam } from "@/components/team"
import { HyperText } from "@/components/ui/hyper-text"

const endings = {
  red: "y después intento romperla.",
  blue: "y después la defiendo.",
}

export function Headline() {
  const { team } = useTeam()

  return (
    <h1 className="mt-6 max-w-[680px] bg-linear-to-r from-white to-[#9b9b9b] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
      <span className="block text-balance">Construyo para la web</span>
      <HyperText key={team} delay={team === "red" ? 700 : 150} duration={900} className="block text-balance">
        {endings[team]}
      </HyperText>
    </h1>
  )
}
