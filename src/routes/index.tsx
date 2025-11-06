import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
