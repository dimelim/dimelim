import { buttonVariants } from "@heroui/styles"
import { ArrowUpRight, DiscordLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr"
import type { ReactNode } from "react"
import { SectionHeading } from "@/components/section-heading"
import { BlurFade } from "@/components/ui/blur-fade"
import { CopyButton } from "@/components/ui/copy-button"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

function ContactCard({
  icon,
  tile,
  network,
  action,
  delay,
}: {
  icon: ReactNode
  tile: string
  network: string
  action: ReactNode
  delay?: number
}) {
  return (
    <BlurFade delay={delay} className="h-full">
      <article className="flex h-full flex-col gap-8 rounded-3xl border border-border bg-surface p-6 transition duration-700 ease-out-fluid hover:-translate-y-1 hover:border-white/20 sm:p-8">
        <span className={cn("grid size-14 place-items-center rounded-2xl", tile)}>{icon}</span>
        <div>
          <h3 className="text-sm font-medium text-muted">{network}</h3>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">{site.handle}</p>
        </div>
        <div className="mt-auto">{action}</div>
      </article>
    </BlurFade>
  )
}

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        index="04"
        label="Contacto"
        title="Escríbeme por Discord"
        description="Es la forma más rápida de hablar conmigo. Todo mi código público está en GitHub."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <ContactCard
          network="Discord"
          tile="bg-[#5865f2] text-white"
          icon={<DiscordLogo weight="fill" className="size-7" />}
          action={
            <CopyButton value={site.handle} size="lg" className="px-3 text-base">
              Copiar usuario
            </CopyButton>
          }
        />
        <ContactCard
          network="GitHub"
          tile="bg-white text-black"
          icon={<GithubLogo weight="fill" className="size-7" />}
          delay={0.1}
          action={
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg", className: "group px-3 text-base font-semibold" })}
            >
              Ver perfil
              <ArrowUpRight className="transition-transform duration-500 ease-out-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          }
        />
      </div>
    </section>
  )
}
