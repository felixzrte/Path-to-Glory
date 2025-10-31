import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Dices, 
  Sword, 
  Shield, 
  BookOpen, 
  Settings,
  Star,
  Zap
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Character Creation",
    description: "Create detailed characters with full archetype, talent, and gear selection from the Wrath & Glory core rules.",
    badge: "Core Feature"
  },
  {
    icon: Dices,
    title: "Dice Rolling",
    description: "Integrated dice roller with Wrath & Glory mechanics including Wrath dice, complications, and critical hits.",
    badge: "Mechanics"
  },
  {
    icon: Sword,
    title: "Combat Tracker",
    description: "Track initiative, wounds, stress, and conditions during intense 40K combat encounters.",
    badge: "Battle"
  },
  {
    icon: Shield,
    title: "Archetype Library",
    description: "Access all official archetypes from core rules and supplements, with custom archetype creation tools.",
    badge: "Characters"
  },
  {
    icon: BookOpen,
    title: "Rule Reference",
    description: "Quick access to rules, talent descriptions, and game mechanics without flipping through books.",
    badge: "Reference"
  },
  {
    icon: Settings,
    title: "GM Tools",
    description: "Manage NPCs, create encounters, and track campaign progress with dedicated Game Master utilities.",
    badge: "GM Only"
  },
  {
    icon: Star,
    title: "Campaign Management",
    description: "Track faction standings, corruption, glory points, and character advancement across sessions.",
    badge: "Campaign"
  },
  {
    icon: Zap,
    title: "Psyker Powers",
    description: "Complete psyker discipline management with power descriptions, perils tracking, and psychic phenomena.",
    badge: "Psychic"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for Wrath & Glory
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive tools for players and Game Masters in the grim darkness of the far future
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}