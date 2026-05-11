import { Button } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-2xl
        support-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2 py-4">
                <img src="/tanstack-logo.png" 
                    className="size-9"
                    alt="logo"/>
                <h1 className="text-lg font-semibold">TanStack Start</h1>
            </div>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button variant="outline">Login</Button>
                <Button variant="secondary">Get Started</Button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar