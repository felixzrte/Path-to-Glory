import { CodexSection } from '@/components/codex/codex-section';
import { Footer } from '@/components/footer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/codex/')({
  component: CodexPage,
})

function CodexPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <CodexSection />
      </main>
      <Footer />
    </div>
  );
}
