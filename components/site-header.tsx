"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { TeamSwitch } from "@/components/team-switch"
import { HyperText } from "@/components/ui/hyper-text"
import { cn } from "@/lib/utils"

const links = [
  { id: "trabajo", label: "Trabajo" },
  { id: "habilidades", label: "Habilidades" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
]

const tracked = ["inicio", "manifiesto", ...links.map((link) => link.id)]

function useActiveSection() {
  const [active, setActive] = useState("inicio")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    for (const id of tracked) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  return active
}

function useMenuLock(open: boolean, setOpen: (open: boolean) => void) {
  useEffect(() => {
    if (!open) return
    const background = document.querySelectorAll("main, footer")
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.documentElement.style.overflow = "hidden"
    background.forEach((element) => element.setAttribute("inert", ""))
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.documentElement.style.overflow = ""
      background.forEach((element) => element.removeAttribute("inert"))
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, setOpen])
}

export function SiteHeader() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)

  useMenuLock(open, setOpen)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <MobileMenu open={open} active={active} onNavigate={() => setOpen(false)} />
      <nav
        aria-label="Principal"
        className="relative mt-6 flex w-max items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-xl"
      >
        <a
          href="#inicio"
          aria-label="Lim, volver al inicio"
          className="flex items-center rounded-full px-3 py-2 font-mono text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <HyperText animateOnHover duration={500}>lim</HyperText>
          <span aria-hidden className="ml-0.5 h-4 w-2 animate-caret-blink bg-accent motion-reduce:animate-none" />
        </a>
        <ul className="hidden items-center md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "location" : undefined}
                className={cn(
                  "relative isolate block rounded-full px-3 py-2 text-sm font-semibold outline-none transition-colors duration-500 ease-out-fluid focus-visible:ring-2 focus-visible:ring-focus",
                  active === link.id ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white/10"
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <TeamSwitch />
        <MenuButton open={open} onToggle={() => setOpen((value) => !value)} />
      </nav>
    </header>
  )
}

function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const line = "absolute top-[19px] left-3 h-0.5 w-4 rounded-full bg-foreground transition-transform duration-700 ease-out-fluid"

  return (
    <button
      type="button"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={open}
      aria-controls="menu-movil"
      onClick={onToggle}
      className="relative size-10 rounded-full outline-none transition-colors duration-500 ease-out-fluid hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-focus active:scale-95 md:hidden"
    >
      <span className={cn(line, open ? "rotate-45" : "-translate-y-1")} />
      <span className={cn(line, open ? "-rotate-45" : "translate-y-1")} />
    </button>
  )
}

function MobileMenu({
  open,
  active,
  onNavigate,
}: {
  open: boolean
  active: string
  onNavigate: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-movil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-3xl md:hidden"
        >
          <nav aria-label="Menú" className="flex h-full flex-col justify-center gap-2 px-8">
            {links.map((link, index) => (
              <div key={link.id} className="overflow-hidden">
                <motion.a
                  href={`#${link.id}`}
                  onClick={onNavigate}
                  aria-current={active === link.id ? "location" : undefined}
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.7 }}
                  className={cn(
                    "flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight outline-none focus-visible:text-accent",
                    active === link.id ? "text-foreground" : "text-muted",
                  )}
                >
                  <span className="font-mono text-sm text-accent">0{index + 1}</span>
                  {link.label}
                </motion.a>
              </div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
