"use client"

import { useTeam } from "@/components/team"
import { HyperText } from "@/components/ui/hyper-text"

const fields = [
  ["rol", "full stack"],
  ["framework", "next.js"],
  ["lenguaje", "javascript"],
]

export function CodeSnippet() {
  const { team } = useTeam()

  return (
    <pre className="my-auto overflow-x-auto rounded-2xl bg-black/40 p-4 font-mono text-sm">
      <code className="text-muted">
        <span className="text-accent">const</span> <span className="text-foreground">lim</span> = {"{"}
        {fields.map(([key, value]) => (
          <span key={key}>
            {"\n  "}
            {key}: <span className="text-foreground">&quot;{value}&quot;</span>,
          </span>
        ))}
        {"\n  "}modo: <span className="text-foreground">&quot;</span>
        <HyperText key={team} delay={200} duration={600} className="text-accent" glyphClassName="text-foreground">
          {`${team} team`}
        </HyperText>
        <span className="text-foreground">&quot;</span>,
        {"\n}"}
      </code>
    </pre>
  )
}
