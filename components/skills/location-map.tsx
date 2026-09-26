import { MapPin } from "@phosphor-icons/react/dist/ssr"
import { LocalTime } from "@/components/local-time"
import { DottedMap } from "@/components/ui/dotted-map"

const latinAmerica = { lat: { min: -56, max: 33 }, lng: { min: -118, max: -34 } }

export function LocationMap() {
  return (
    <div className="relative mx-auto w-full max-w-72">
      <DottedMap
        width={94}
        height={100}
        mapSamples={2500}
        dotRadius={0.55}
        region={latinAmerica}
        markers={[{ lat: 4.6, lng: -74.1, size: 1.4 }]}
        className="text-white/20"
      />
      <p className="absolute bottom-0 left-0 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 font-mono text-sm backdrop-blur-md">
        <MapPin weight="fill" className="size-4 text-accent" />
        <span>Colombia</span>
        <LocalTime className="text-muted" />
      </p>
    </div>
  )
}
