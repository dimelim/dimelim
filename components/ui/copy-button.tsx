"use client"

import { Button } from "@heroui/react"
import { Check, Copy } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type CopyButtonProps = Omit<ComponentProps<typeof Button>, "onPress" | "children"> & {
  value: string
  children: ReactNode
}

type Status = "idle" | "copied" | "failed"

const feedback: Record<Exclude<Status, "idle">, string> = {
  copied: "Copiado",
  failed: "No se pudo copiar",
}

export function CopyButton({ value, children, className, ...props }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>("idle")
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  async function copy() {
    clearTimeout(timeout.current)
    try {
      await navigator.clipboard.writeText(value)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
    timeout.current = setTimeout(() => setStatus("idle"), 2200)
  }

  return (
    <Button onPress={copy} className={cn("font-semibold", className)} {...props}>
      <span className="relative size-5 sm:size-4">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={status === "copied" ? "check" : "copy"}
            className="absolute inset-0"
            initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            {status === "copied" ? <Check weight="bold" className="m-0 size-full" /> : <Copy weight="bold" className="m-0 size-full" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="grid">
        <span className={cn("col-start-1 row-start-1 transition-opacity duration-300", status !== "idle" && "opacity-0")}>
          {children}
        </span>
        <span
          aria-hidden
          className={cn("col-start-1 row-start-1 transition-opacity duration-300", status === "idle" && "opacity-0")}
        >
          {status !== "idle" && feedback[status]}
        </span>
      </span>
      <span role="status" className="sr-only">
        {status === "copied" && `${value} copiado al portapapeles`}
        {status === "failed" && `No se pudo copiar ${value}`}
      </span>
    </Button>
  )
}
