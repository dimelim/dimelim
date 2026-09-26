import type { ReactNode } from "react"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

type BentoCardProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
  delay?: number
}

export function BentoCard({ title, description, children, className, delay }: BentoCardProps) {
  return (
    <BlurFade
      delay={delay}
      className={cn(
        "flex flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors duration-700 ease-out-fluid hover:border-white/20 sm:p-8",
        className,
      )}
    >
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-base text-pretty text-muted">{description}</p>
      </div>
      {children}
    </BlurFade>
  )
}
