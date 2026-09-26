import { ArrowUp } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-4 pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Hecho en Colombia con Next.js, HeroUI y Motion.
        </p>
        <a
          href="#inicio"
          className="group inline-flex w-fit items-center gap-2 rounded-full outline-none transition-colors duration-500 ease-out-fluid hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus"
        >
          Volver arriba
          <ArrowUp className="transition-transform duration-500 ease-out-fluid group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
