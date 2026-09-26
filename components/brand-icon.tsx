import { brands, type Brand } from "@/lib/brands"
import { cn } from "@/lib/utils"

export function BrandIcon({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={cn("size-5 shrink-0", className)}>
      <path d={brands[brand].path} />
    </svg>
  )
}
