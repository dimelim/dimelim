import { SectionHeading } from "@/components/section-heading"
import { BentoCard } from "@/components/skills/bento-card"
import { CodeSnippet } from "@/components/skills/code-card"
import { LocationMap } from "@/components/skills/location-map"
import { SecurityCard } from "@/components/skills/security-card"
import { StackBeams } from "@/components/skills/stack-beams"
import { StackMarquee } from "@/components/skills/stack-marquee"
import { BlurFade } from "@/components/ui/blur-fade"

export function Skills() {
  return (
    <section id="habilidades" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        index="02"
        label="Habilidades"
        title="Lo que sé hacer"
        description="Next.js y JavaScript todos los días, y la seguridad vista desde los dos lados."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        <BentoCard
          title="Next.js de punta a punta"
          description="Interfaces con React y TypeScript, APIs en Node.js y datos en Supabase o MySQL, todo desplegado en Vercel."
          className="lg:col-span-2"
        >
          <StackBeams />
        </BentoCard>
        <BentoCard
          title="Red team y blue team"
          description="Elige un lado y todo el sitio cambia con él."
          className="lg:row-span-2"
          delay={0.1}
        >
          <SecurityCard />
        </BentoCard>
        <BentoCard
          title="JavaScript todos los días"
          description="TypeScript cuando el proyecto crece. Mi perfil de GitHub también está escrito así."
          delay={0.15}
        >
          <CodeSnippet />
        </BentoCard>
        <BentoCard
          title="Desde Colombia"
          description="Esta es mi hora local, por si quieres escribirme."
          delay={0.2}
        >
          <LocationMap />
        </BentoCard>
      </div>
      <BlurFade delay={0.1} className="mt-4">
        <StackMarquee />
      </BlurFade>
    </section>
  )
}
