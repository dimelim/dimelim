import { IncidentFeed } from "@/components/projects/incident-feed"
import { ProjectCard, type Project } from "@/components/projects/project-card"
import { SectionHeading } from "@/components/section-heading"
import { PhotoStack } from "@/components/ui/photo-stack"

const shielus: Project = {
  name: "ShielUS",
  badge: "v1.15",
  logo: "/brand/shielus.png",
  description:
    "Bot de Discord gratuito que frena raids en milisegundos, con un panel web para configurar módulos, AutoMod, whitelist y copias de seguridad.",
  stack: [
    { brand: "nextjs", label: "Next.js" },
    { brand: "heroui", label: "HeroUI" },
    { brand: "mysql", label: "MySQL" },
    { brand: "discordjs", label: "discord.js" },
  ],
  links: [
    { label: "shielus.lat", href: "https://www.shielus.lat" },
    { label: "Documentación", href: "https://www.shielus.lat/docs" },
  ],
}

const miniout: Project = {
  name: "Miniout",
  badge: "Open source",
  logo: "/brand/miniout.png",
  description:
    "Apuntes y tareas de universidad. Primero escribes y después archivas, y lo que mencionas de un día cae en ese día.",
  stack: [
    { brand: "expo", label: "Expo" },
    { brand: "react", label: "React Native" },
    { brand: "heroui", label: "HeroUI Native" },
  ],
  links: [
    { label: "Código en GitHub", href: "https://github.com/dimelim/miniout" },
    { label: "APK para Android", href: "https://github.com/dimelim/miniout/releases" },
  ],
}

const screenshots = [
  { src: "/projects/inicio.png", alt: "Pantalla de inicio de Miniout" },
  { src: "/projects/dia.png", alt: "Vista del día en Miniout" },
  { src: "/projects/mascota.png", alt: "Pantalla de la mascota de Miniout" },
]

export function Projects() {
  return (
    <section id="proyectos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        index="03"
        label="Proyectos"
        title="Proyectos propios"
        description="Cosas que empecé por mi cuenta y que sigo manteniendo."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <ProjectCard project={shielus} media={<IncidentFeed />} />
        <ProjectCard
          project={miniout}
          delay={0.1}
          media={
            <div className="flex h-full items-center justify-center">
              <PhotoStack photos={screenshots} className="-translate-x-8" />
              <p className="absolute right-4 bottom-3 font-mono text-xs text-muted">Toca o arrastra</p>
            </div>
          }
        />
      </div>
    </section>
  )
}
