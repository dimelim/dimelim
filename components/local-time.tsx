"use client"

import { useEffect, useState } from "react"
import { SlidingDigits } from "@/components/ui/sliding-digits"
import { site } from "@/lib/site"

const clock = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: site.timeZone,
})

export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState("--:--")

  useEffect(() => {
    const update = () => setTime(clock.format(new Date()))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return <SlidingDigits value={time} className={className} />
}
