import { createMap } from "svg-dotted-map"
import { cn } from "@/lib/utils"

type Marker = { lat: number; lng: number; size?: number }
type Region = { lat: { min: number; max: number }; lng: { min: number; max: number } }

type DottedMapProps = {
  markers: Marker[]
  region?: Region
  className?: string
  width?: number
  height?: number
  mapSamples?: number
  dotRadius?: number
}

export function DottedMap({
  markers,
  region,
  className,
  width = 150,
  height = 75,
  mapSamples = 4000,
  dotRadius = 0.22,
}: DottedMapProps) {
  const { points, addMarkers } = createMap({ width, height, mapSamples, region })
  const rows = [...new Set(points.map((point) => point.y))].sort((a, b) => a - b)
  const xs = [...new Set(points.map((point) => point.x))].sort((a, b) => a - b)
  const step = xs.slice(1).reduce((min, x, i) => Math.min(min, x - xs[i]), Infinity)
  const shift = (y: number) => (rows.indexOf(y) % 2 === 1 ? (Number.isFinite(step) ? step : 1) / 2 : 0)

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full", className)}
    >
      {points.map((point) => (
        <circle
          key={`${point.x}-${point.y}`}
          cx={point.x + shift(point.y)}
          cy={point.y}
          r={dotRadius}
          fill="currentColor"
        />
      ))}
      {addMarkers(markers).map((marker) => {
        const x = marker.x + shift(marker.y)
        const r = marker.size ?? dotRadius
        return (
          <g key={`${marker.x}-${marker.y}`} className="fill-accent stroke-accent">
            <circle cx={x} cy={marker.y} r={r} />
            <circle cx={x} cy={marker.y} r={r} fill="none" strokeWidth={0.3} className="motion-reduce:hidden">
              <animate attributeName="r" values={`${r};${r * 3}`} dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}
