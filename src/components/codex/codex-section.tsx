import { FeatureCard } from "@/components/ui/feature-card"
import { 
  BookOpen,
  Users,
  User,
  UserCircle,
  Wrench,
  Zap,
  Swords,
  Shield,
  Sparkles,
  TrendingUp
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Core Rules",
    description: "",
    href: "/codex/rules"
  },
  {
    icon: Users,
    title: "Factions",
    description: "",
    href: "/codex/factions"
  },
  {
    icon: User,
    title: "Species",
    description: "",
    href: "/codex/species"
  },
  {
    icon: UserCircle,
    title: "Archetypes",
    description: "",
    href: "/codex/archetypes"
  },
  {
    icon: Wrench,
    title: "Attributes & Skills",
    description: "",
    href: "/codex/attributes"
  },
  {
    icon: Zap,
    title: "Talents",
    description: "",
    href: "/codex/talents"
  },
  {
    icon: Swords,
    title: "Combat",
    description: "",
    href: "/codex/combat"
  },
  {
    icon: Shield,
    title: "Wargear",
    description: "",
    href: "/codex/wargear"
  },
  {
    icon: Sparkles,
    title: "Psychic Powers",
    description: "",
    href: "/codex/psychic"
  },
  {
    icon: TrendingUp,
    title: "Advancement",
    description: "",
    href: "/codex/advancement"
  }
]

export function CodexSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            The Codex
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Complete rules reference and database to quickly find the information you need during gameplay.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}