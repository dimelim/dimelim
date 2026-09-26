import { TextReveal } from "@/components/ui/text-reveal"

const segments = [
  { text: "Lo que construyo tiene que ser rápido, claro y" },
  { text: "difícil de romper.", accent: true },
  { text: "Por eso lo ataco antes de publicarlo." },
]

export function Manifesto() {
  return (
    <section id="manifiesto" aria-label="Manifiesto" className="mx-auto max-w-6xl px-4 sm:px-6">
      <TextReveal segments={segments} />
    </section>
  )
}
