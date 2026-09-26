import { buttonVariants } from "@heroui/styles"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { HyperText } from "@/components/ui/hyper-text"

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="flex max-w-[680px] flex-col items-center text-center">
        <p className="font-mono text-sm text-accent">
          <HyperText duration={700} glyphClassName="text-foreground">
            Error 404
          </HyperText>
        </p>
        <h1 className="mt-4 bg-linear-to-r from-white to-[#9b9b9b] bg-clip-text text-5xl font-semibold tracking-tight text-balance text-transparent">
          Esta página no existe
        </h1>
        <p className="mt-4 text-lg text-pretty text-muted">
          Puede que el enlace esté roto o que la página se haya movido.
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: "primary", size: "lg", className: "mt-8 px-3 text-base font-semibold" })}
        >
          <ArrowLeft weight="bold" />
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
