"use client"

import { Tabs } from "@heroui/react"
import {
  Bug,
  Crosshair,
  DiscordLogo,
  FileText,
  Pulse,
  ShieldCheck,
  Siren,
  TerminalWindow,
  type Icon,
} from "@phosphor-icons/react"
import { motion } from "motion/react"
import { useRef } from "react"
import { BrandIcon } from "@/components/brand-icon"
import { useTeam, type Team } from "@/components/team"
import type { Brand } from "@/lib/brands"

type Side = {
  label: string
  title: string
  items: { icon: Icon; text: string }[]
  tools: { brand: Brand; label: string }[]
}

const sides: Record<Team, Side> = {
  red: {
    label: "Red team",
    title: "Pienso como atacante",
    items: [
      { icon: Crosshair, text: "Reconocimiento y mapeo de la superficie de ataque" },
      { icon: Bug, text: "Pruebas de aplicaciones web guiadas por OWASP Top 10" },
      { icon: TerminalWindow, text: "Explotación controlada en laboratorios" },
      { icon: FileText, text: "Informes con pasos para reproducir y corregir" },
    ],
    tools: [
      { brand: "kali", label: "Kali Linux" },
      { brand: "burp", label: "Burp Suite" },
      { brand: "metasploit", label: "Metasploit" },
    ],
  },
  blue: {
    label: "Blue team",
    title: "Defiendo lo que construyo",
    items: [
      { icon: ShieldCheck, text: "Hardening de servidores y aplicaciones" },
      { icon: Pulse, text: "Monitoreo y lectura de logs" },
      { icon: Siren, text: "Detección y respuesta a incidentes" },
      { icon: DiscordLogo, text: "Defensa contra raids en Discord con ShielUS" },
    ],
    tools: [
      { brand: "wireshark", label: "Wireshark" },
      { brand: "cloudflare", label: "Cloudflare" },
      { brand: "linux", label: "Linux" },
    ],
  },
}

const order: Team[] = ["red", "blue"]

export function SecurityCard() {
  const { team, changeTeam } = useTeam()
  const tabs = useRef<Partial<Record<Team, HTMLElement | null>>>({})
  const direction = team === "blue" ? 1 : -1

  return (
    <Tabs
      selectedKey={team}
      onSelectionChange={(key) => changeTeam(key as Team, tabs.current[key as Team])}
      className="gap-0"
    >
      <Tabs.ListContainer className="bg-white/5">
        <Tabs.List aria-label="Lado de la seguridad">
          {order.map((id) => (
            <Tabs.Tab
              key={id}
              id={id}
              ref={(element) => {
                tabs.current[id] = element
              }}
              className="h-9 font-semibold data-[selected=true]:text-accent-foreground"
            >
              {sides[id].label}
              <Tabs.Indicator className="bg-accent" />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {order.map((id) => (
        <Tabs.Panel key={id} id={id} className="mt-6 p-0">
          <motion.div
            initial={{ opacity: 0, x: 32 * direction, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-sm text-accent">{sides[id].title}</p>
            <ul className="mt-4 grid gap-3">
              {sides[id].items.map(({ icon: ItemIcon, text }, index) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-accent">
                    <ItemIcon weight="bold" className="size-4" />
                  </span>
                  <span className="pt-1 text-sm text-pretty">{text}</span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 text-xs font-medium text-muted">Herramientas</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {sides[id].tools.map((tool) => (
                <li
                  key={tool.brand}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm"
                >
                  <BrandIcon brand={tool.brand} className="size-4" />
                  {tool.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
