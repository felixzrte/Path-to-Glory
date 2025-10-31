import { CodexSection } from '@/components/codex/codex-section';
import { Footer } from '@/components/footer';
import { NavigationBar } from '@/components/navigation/navigation-bar';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/codex/')({
  component: CodexPage,
})

function CodexPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="pt-20">
        <CodexSection />
      </main>
      <Footer />
    </div>
  );
}
