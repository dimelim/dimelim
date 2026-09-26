"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Photo = { src: string; alt: string }

const positions = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 32, y: 8, rotate: 6, scale: 0.94 },
  { x: 64, y: 16, rotate: 12, scale: 0.88 },
]

export function PhotoStack({ photos, className }: { photos: Photo[]; className?: string }) {
  const [order, setOrder] = useState(() => photos.map((_, index) => index))
  const dragged = useRef(false)

  const cycle = () => setOrder(([first, ...rest]) => [...rest, first])

  return (
    <div className={cn("relative aspect-[640/1304] w-36 sm:w-40", className)}>
      {order.map((photoIndex, position) => {
        const photo = photos[photoIndex]
        const front = position === 0

        return (
          <motion.button
            key={photo.src}
            type="button"
            disabled={!front}
            aria-hidden={!front}
            aria-label={front ? `${photo.alt}. Mostrar la siguiente captura` : undefined}
            drag={front ? "x" : false}
            dragSnapToOrigin
            onDragStart={() => {
              dragged.current = true
            }}
            onDragEnd={() => {
              cycle()
              requestAnimationFrame(() => {
                dragged.current = false
              })
            }}
            onClick={() => {
              if (!dragged.current) cycle()
            }}
            animate={positions[Math.min(position, positions.length - 1)]}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{ zIndex: photos.length - position }}
            className="absolute inset-0 origin-bottom-left cursor-grab overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-black/60 outline-none focus-visible:ring-2 focus-visible:ring-focus active:cursor-grabbing disabled:cursor-default"
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="160px"
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </motion.button>
        )
      })}
    </div>
  )
}
