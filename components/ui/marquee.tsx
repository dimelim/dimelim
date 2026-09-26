import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  reverse?: boolean
  pauseOnHover?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn("group flex gap-(--gap) overflow-hidden [--duration:40s] [--gap:1rem]", className)}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          aria-hidden={index > 0}
          className={cn(
            "flex shrink-0 animate-marquee justify-around gap-(--gap) motion-reduce:animate-none",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
