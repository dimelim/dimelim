import { ArrowUpRight, Gauge, Translate, UsersThree } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { SectionHeading } from "@/components/section-heading"
import { StackChip } from "@/components/stack-chip"
import { BlurFade } from "@/components/ui/blur-fade"
import type { Brand } from "@/lib/brands"

const tasks = [
  { icon: UsersThree, text: "Rediseño el panel de referidos, con comisiones, pagos, metas y ranking." },
  { icon: Translate, text: "Llevo cada pantalla a cinco idiomas, del español al alemán." },
  { icon: Gauge, text: "Cuido que todo cargue rápido en móviles de gama media." },
]

const stack: { brand: Brand; label: string }[] = [
  { brand: "nextjs", label: "Next.js" },
  { brand: "react", label: "React" },
  { brand: "typescript", label: "TypeScript" },
  { brand: "heroui", label: "HeroUI" },
  { brand: "supabase", label: "Supabase" },
  { brand: "tailwind", label: "Tailwind CSS" },
]

export function Work() {
  return (
    <section id="trabajo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        index="01"
        label="Trabajo"
        title="Dónde trabajo"
        description="Construyo la tienda de Peek, un marketplace gaming hecho para jugadores de Latinoamérica."
      />
      <BlurFade className="mt-12">
        <article className="grid gap-8 rounded-3xl border border-border bg-surface p-6 transition duration-700 ease-out-fluid hover:-translate-y-1 hover:border-white/20 sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#2462eb] p-3">
                <Image src="/brand/peek.svg" alt="" width={32} height={32} unoptimized className="size-full" />
              </span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">Peek</h3>
                <p className="text-sm text-muted">Desarrollador full stack · Hoy</p>
              </div>
              <a
                href="https://peekstore.com"
                target="_blank"
                rel="noreferrer"
                className="group ml-auto inline-flex items-center gap-1 rounded-full font-mono text-sm text-muted outline-none transition-colors duration-500 ease-out-fluid hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus"
              >
                peekstore.com
                <ArrowUpRight className="transition-transform duration-500 ease-out-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </header>
            <p className="text-lg text-pretty text-muted">
              Peek vende Robux e items de Roblox a jugadores de toda Latinoamérica, con pagos locales y
              seguimiento de cada pedido.
            </p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {stack.map((item) => (
                <li key={item.brand}>
                  <StackChip {...item} />
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-3 self-start">
            {tasks.map(({ icon: Icon, text }, index) => (
              <li key={text}>
                <BlurFade delay={0.15 + index * 0.08} offset={24} className="flex items-start gap-4 rounded-2xl bg-surface-secondary p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-accent">
                    <Icon weight="bold" className="size-5" />
                  </span>
                  <p className="pt-2 text-base text-pretty">{text}</p>
                </BlurFade>
              </li>
            ))}
          </ul>
        </article>
      </BlurFade>
    </section>
  )
}
