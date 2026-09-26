import { BlurFade } from "@/components/ui/blur-fade"
import { HyperText } from "@/components/ui/hyper-text"

type SectionHeadingProps = {
  index: string
  label: string
  title: string
  description: string
}

export function SectionHeading({ index, label, title, description }: SectionHeadingProps) {
  return (
    <BlurFade>
      <p className="font-mono text-sm text-accent">
        <HyperText startOnView duration={600} glyphClassName="text-foreground">
          {`${index} / ${label}`}
        </HyperText>
      </p>
      <h2 className="mt-4 max-w-[680px] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-[680px] text-lg text-pretty text-muted">{description}</p>
    </BlurFade>
  )
}
