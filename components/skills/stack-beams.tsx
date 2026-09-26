"use client"

import { useInView, useReducedMotion } from "motion/react"
import { useRef, type RefObject } from "react"
import { BrandIcon } from "@/components/brand-icon"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import type { Brand } from "@/lib/brands"
import { cn } from "@/lib/utils"

type NodeProps = {
  nodeRef: RefObject<HTMLDivElement | null>
  brand: Brand
  label: string
  large?: boolean
}

function Node({ nodeRef, brand, label, large = false }: NodeProps) {
  return (
    <div
      ref={nodeRef}
      title={label}
      className={cn(
        "z-10 grid place-items-center rounded-2xl border border-white/10 bg-surface-secondary shadow-lg shadow-black/40",
        large ? "size-20" : "size-12",
      )}
    >
      <BrandIcon brand={brand} className={large ? "size-9" : "size-5"} />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function StackBeams() {
  const container = useRef<HTMLDivElement>(null)
  const next = useRef<HTMLDivElement>(null)
  const react = useRef<HTMLDivElement>(null)
  const typescript = useRef<HTMLDivElement>(null)
  const tailwind = useRef<HTMLDivElement>(null)
  const supabase = useRef<HTMLDivElement>(null)
  const node = useRef<HTMLDivElement>(null)
  const vercel = useRef<HTMLDivElement>(null)
  const inView = useInView(container, { amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const active = inView && !reduceMotion

  const inputs = [react, typescript, tailwind]
  const outputs = [supabase, node, vercel]

  return (
    <div ref={container} className="relative flex items-center justify-between py-4 sm:px-8">
      <div className="flex flex-col gap-6">
        <Node nodeRef={react} brand="react" label="React" />
        <Node nodeRef={typescript} brand="typescript" label="TypeScript" />
        <Node nodeRef={tailwind} brand="tailwind" label="Tailwind CSS" />
      </div>
      <Node nodeRef={next} brand="nextjs" label="Next.js" large />
      <div className="flex flex-col gap-6">
        <Node nodeRef={supabase} brand="supabase" label="Supabase" />
        <Node nodeRef={node} brand="node" label="Node.js" />
        <Node nodeRef={vercel} brand="vercel" label="Vercel" />
      </div>
      {inputs.map((from, index) => (
        <AnimatedBeam
          key={`in-${index}`}
          containerRef={container}
          fromRef={from}
          toRef={next}
          active={active}
          delay={index * 0.4}
        />
      ))}
      {outputs.map((to, index) => (
        <AnimatedBeam
          key={`out-${index}`}
          containerRef={container}
          fromRef={next}
          toRef={to}
          active={active}
          delay={1.2 + index * 0.4}
        />
      ))}
    </div>
  )
}
