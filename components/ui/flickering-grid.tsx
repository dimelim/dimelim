"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type FlickeringGridProps = {
  className?: string
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  maxOpacity?: number
}

const frameInterval = 60

function toRgbaPrefix(color: string) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return "rgba(255, 255, 255,"
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b},`
}

export function FlickeringGrid({
  className,
  squareSize = 3,
  gridGap = 7,
  flickerChance = 0.3,
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!container || !canvas || !context) return

    const color = toRgbaPrefix(getComputedStyle(container).color)
    const cell = squareSize + gridGap
    let columns = 0
    let rows = 0
    let ratio = 1
    let squares = new Float32Array(0)
    let frame = 0
    let last = 0

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          context.fillStyle = `${color}${squares[x * rows + y]})`
          context.fillRect(x * cell * ratio, y * cell * ratio, squareSize * ratio, squareSize * ratio)
        }
      }
    }

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      ratio = window.devicePixelRatio || 1
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      columns = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      squares = Float32Array.from({ length: columns * rows }, () => Math.random() * maxOpacity)
      draw()
    }

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick)
      if (time - last < frameInterval) return
      const elapsed = (time - last) / 1000
      last = time
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * elapsed) squares[i] = Math.random() * maxOpacity
      }
      draw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (!entry.isIntersecting || reduceMotion) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    })
    intersectionObserver.observe(container)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, maxOpacity, reduceMotion])

  return (
    <div ref={containerRef} aria-hidden className={cn("h-full w-full", className)}>
      <canvas ref={canvasRef} className="pointer-events-none block" />
    </div>
  )
}
