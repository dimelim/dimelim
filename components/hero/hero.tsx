import { buttonVariants } from "@heroui/styles"
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Headline } from "@/components/hero/headline"
import { HeroGrid } from "@/components/hero/hero-grid"
import { HeroTerminal } from "@/components/hero/hero-terminal"
import { BlurFade } from "@/components/ui/blur-fade"
import { CopyButton } from "@/components/ui/copy-button"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const proof = [
  { name: "Peek", note: "Donde trabajo", logo: "/brand/peek.svg", href: "#trabajo", tile: "bg-[#2462eb] p-2" },
  { name: "ShielUS", note: "Bot contra raids", logo: "/brand/shielus.png", href: "#proyectos", tile: "" },
  { name: "Miniout", note: "Open source", logo: "/brand/miniout.png", href: "#proyectos", tile: "" },
]

export function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-svh items-center overflow-hidden py-24">
      <HeroGrid />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <BlurFade offset={24}>
            <a
              href="#trabajo"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-muted outline-none transition-colors duration-500 ease-out-fluid hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Full stack en Peek
            </a>
          </BlurFade>
          <BlurFade delay={0.1}>
            <Headline />
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-6 max-w-[680px] text-lg text-pretty text-muted">{site.description}</p>
          </BlurFade>
          <BlurFade delay={0.3} className="mt-8 flex flex-wrap items-center gap-3">
            <CopyButton value={site.handle} size="lg" className="px-3 text-base">
              <span>
                Copiar mi Discord <span className="font-mono opacity-60">{site.handle}</span>
              </span>
            </CopyButton>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg", className: "px-3 text-base font-semibold" })}
            >
              <GithubLogo weight="bold" />
              GitHub
              <ArrowUpRight />
            </a>
          </BlurFade>
          <BlurFade delay={0.4} className="mt-12">
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {proof.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <span className={cn("relative size-9 overflow-hidden rounded-lg transition-transform duration-500 ease-out-fluid group-hover:-translate-y-0.5", item.tile)}>
                      <Image src={item.logo} alt="" width={36} height={36} unoptimized={item.logo.endsWith(".svg")} className="size-full object-contain" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className="text-xs text-muted">{item.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>
        <BlurFade delay={0.25}>
          <HeroTerminal />
        </BlurFade>
      </div>
    </section>
  )
}
