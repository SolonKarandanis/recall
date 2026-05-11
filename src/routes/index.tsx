import Navbar from '#/components/web/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div >
        <Navbar />
    </div>
  )
}
