import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, Users, BarChart, Zap } from "lucide-react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <ClipboardList className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">JiraClone</span>
        </Link>
        <nav className="ml-auto px-4 mt-3 flex gap-4 sm:gap-6">
          {!user ? (
            <>
              <Button variant={"default"}>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="/sign-in"
                >
                  sign-in
                </Link>
              </Button>
              <Button variant={"default"}>
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href="/sign-up"
                >
                  sign-up
                </Link>
              </Button>
            </>
          ) : (
            <div>
              <Button variant={"secondary"}>
                <Link href={'/dashboard'}>
                Dashboard
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Streamline Your Project Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  JiraClone helps teams plan, track, and manage their work
                  efficiently. Boost productivity and deliver projects on time.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full mb-8 py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold mb-2">Team Collaboration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Work together seamlessly with your team members on projects
                  and tasks.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BarChart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor project progress with intuitive charts and dashboards.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-lg font-bold mb-2">Agile Workflows</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Implement agile methodologies with customizable boards and
                  sprints.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
