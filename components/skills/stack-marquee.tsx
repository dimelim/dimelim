import { BrandIcon } from "@/components/brand-icon"
import { Marquee } from "@/components/ui/marquee"
import type { Brand } from "@/lib/brands"

type Item = { brand: Brand; label: string }

const build: Item[] = [
  { brand: "nextjs", label: "Next.js" },
  { brand: "react", label: "React" },
  { brand: "javascript", label: "JavaScript" },
  { brand: "typescript", label: "TypeScript" },
  { brand: "tailwind", label: "Tailwind CSS" },
  { brand: "heroui", label: "HeroUI" },
  { brand: "node", label: "Node.js" },
  { brand: "supabase", label: "Supabase" },
  { brand: "mysql", label: "MySQL" },
  { brand: "expo", label: "Expo" },
  { brand: "discordjs", label: "discord.js" },
  { brand: "vercel", label: "Vercel" },
]

const secure: Item[] = [
  { brand: "kali", label: "Kali Linux" },
  { brand: "burp", label: "Burp Suite" },
  { brand: "metasploit", label: "Metasploit" },
  { brand: "owasp", label: "OWASP" },
  { brand: "wireshark", label: "Wireshark" },
  { brand: "cloudflare", label: "Cloudflare" },
  { brand: "linux", label: "Linux" },
  { brand: "docker", label: "Docker" },
  { brand: "git", label: "Git" },
]

function Row({ items, reverse }: { items: Item[]; reverse?: boolean }) {
  return (
    <Marquee pauseOnHover reverse={reverse} className="[--duration:48s]">
      {items.map((item) => (
        <span
          key={item.brand}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors duration-500 ease-out-fluid hover:text-foreground"
        >
          <BrandIcon brand={item.brand} className="size-4" />
          {item.label}
        </span>
      ))}
    </Marquee>
  )
}

export function StackMarquee() {
  return (
    <div>
      <p className="sr-only">Uso {[...build, ...secure].map((item) => item.label).join(", ")}.</p>
      <div
        aria-hidden
        className="flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <Row items={build} />
        <Row items={secure} reverse />
      </div>
    </div>
  )
}
