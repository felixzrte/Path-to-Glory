import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative px-6 lg:px-8 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Path to Glory
        </h1>
        
        <div className="mt-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Work in Progress
          </Badge>
        </div>
      </div>
    </section>
  )
}