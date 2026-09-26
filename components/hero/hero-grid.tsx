"use client"

import { useTeam } from "@/components/team"
import { FlickeringGrid } from "@/components/ui/flickering-grid"

export function HeroGrid() {
  const { team } = useTeam()

  return (
    <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_75%_35%,black,transparent_70%)]">
      <FlickeringGrid key={team} className="text-accent" maxOpacity={0.28} flickerChance={0.2} />
    </div>
  )
}
