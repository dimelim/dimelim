import { CloudCheck, Funnel, LinkBreak, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { AnimatedList } from "@/components/ui/animated-list"

const incidents = [
  { icon: ShieldCheck, title: "Raid detenido", detail: "34 cuentas bloqueadas en 212 ms" },
  { icon: LinkBreak, title: "Enlace malicioso borrado", detail: "Phishing detectado en #general" },
  { icon: Funnel, title: "Spam filtrado", detail: "AutoMod frenó 9 invitaciones" },
  { icon: CloudCheck, title: "Copia de seguridad lista", detail: "Roles y canales guardados" },
]

export function IncidentFeed() {
  return (
    <>
      <Image
        src="/projects/shielus-banner.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 560px, 100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <AnimatedList delay={1400} className="w-full max-w-xs">
          {incidents.map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-xl shadow-black/50 backdrop-blur-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-accent">
                <Icon weight="bold" className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">{title}</span>
                <span className="truncate text-xs text-muted">{detail}</span>
              </span>
            </div>
          ))}
        </AnimatedList>
      </div>
    </>
  )
}
