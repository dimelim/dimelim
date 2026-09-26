import { Chip } from "@heroui/react"
import { buttonVariants } from "@heroui/styles"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import type { ReactNode } from "react"
import { StackChip } from "@/components/stack-chip"
import { BlurFade } from "@/components/ui/blur-fade"
import type { Brand } from "@/lib/brands"

export type Project = {
  name: string
  badge: string
  logo: string
  description: string
  stack: { brand: Brand; label: string }[]
  links: { label: string; href: string }[]
}

export function ProjectCard({
  project,
  media,
  delay,
}: {
  project: Project
  media: ReactNode
  delay?: number
}) {
  return (
    <BlurFade delay={delay} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition duration-700 ease-out-fluid hover:-translate-y-1 hover:border-white/20">
        <div className="relative m-2 h-80 overflow-hidden rounded-2xl bg-black">{media}</div>
        <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
          <header className="flex items-center gap-3">
            <Image src={project.logo} alt="" width={40} height={40} className="size-10 rounded-xl" />
            <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
            <Chip color="accent" variant="soft" size="md" className="font-mono">
              {project.badge}
            </Chip>
          </header>
          <p className="text-base text-pretty text-muted">{project.description}</p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item.brand}>
                <StackChip {...item} />
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline", className: "group px-3 font-semibold" })}
              >
                {link.label}
                <ArrowUpRight className="transition-transform duration-500 ease-out-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>
      </article>
    </BlurFade>
  )
}
