"use client"

import { useTeam, type Team } from "@/components/team"
import { Terminal, type TerminalLine } from "@/components/ui/terminal"

const scripts: Record<Team, TerminalLine[]> = {
  red: [
    { kind: "command", text: "whoami" },
    { kind: "output", text: "lim · full stack · red team" },
    { kind: "command", text: "recon lab.local" },
    { kind: "output", mark: "+", text: "3 puertos abiertos: 22, 80, 443" },
    { kind: "output", mark: "+", text: "/admin responde sin rate limit" },
    { kind: "output", mark: "!", text: "cookie de sesión sin HttpOnly" },
    { kind: "command", text: "reporte --entregar" },
    { kind: "output", text: "3 hallazgos con pasos para corregir" },
  ],
  blue: [
    { kind: "command", text: "whoami" },
    { kind: "output", text: "lim · full stack · blue team" },
    { kind: "command", text: "tail -f auth.log | detectar" },
    { kind: "output", mark: "!", text: "47 intentos fallidos en 30 s" },
    { kind: "output", mark: "ok", text: "IP bloqueada en 118 ms" },
    { kind: "output", mark: "ok", text: "alerta enviada a Discord" },
    { kind: "command", text: "estado" },
    { kind: "output", text: "0 incidentes abiertos" },
  ],
}

export function HeroTerminal() {
  const { team } = useTeam()

  return (
    <Terminal
      key={team}
      title={`lim@colombia ~/${team}-team`}
      lines={scripts[team]}
      className="shadow-2xl shadow-black/60"
    />
  )
}
