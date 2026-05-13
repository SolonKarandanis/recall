import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "./theme-toggle"
import { Button, buttonVariants } from "../ui/button"
import { authClient } from "#/lib/auth-client";
import { toast } from "sonner";

const Navbar = () => {
    const {data:session,isPending} = authClient.useSession();
     const handleSignOut = async () => {
        await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                toast.success('Signed out successfully')
            },
            onError: ({ error }) => {
                toast.error(error.message)
            },
        },
        })
    }
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
                    {isPending ? null: session ? (
                       <>
                            <Button onClick={handleSignOut}>Logout</Button>
                            <Link to="/" className={buttonVariants({ variant: "secondary" })}>
                                Dashboard
                            </Link>
                       </>
                    ) : (
                        <>
                            <Link className={buttonVariants({ variant: "outline" })} to="/login">
                                Login
                            </Link>
                            <Link className={buttonVariants({ variant: "secondary" })} to="/signup">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar