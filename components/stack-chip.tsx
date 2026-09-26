import { Chip } from "@heroui/react"
import { BrandIcon } from "@/components/brand-icon"
import type { Brand } from "@/lib/brands"

export function StackChip({ brand, label }: { brand: Brand; label: string }) {
  return (
    <Chip size="lg" className="gap-2 bg-white/5 px-3 py-1 text-sm text-foreground">
      <BrandIcon brand={brand} className="size-4" />
      {label}
    </Chip>
  )
}
