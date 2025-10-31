import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/codex/species')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/codex/species"!</div>
}
