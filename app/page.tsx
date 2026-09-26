import { Contact } from "@/components/contact"
import { Hero } from "@/components/hero/hero"
import { Manifesto } from "@/components/manifesto"
import { Projects } from "@/components/projects/projects"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Skills } from "@/components/skills/skills"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { Work } from "@/components/work"

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-70 rounded-full bg-accent px-4 py-2 font-semibold text-accent-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Saltar al contenido
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Manifesto />
        <Work />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
