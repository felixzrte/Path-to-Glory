import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/codex/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/codex/"!</div>
}
