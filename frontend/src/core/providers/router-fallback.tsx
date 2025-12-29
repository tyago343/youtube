import { Spinner } from "@/shared/ui/spinner/spinner";

export const RouterFallback = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-end items-center p-4">
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </div>
      </header>
      <main className="flex">
        <aside className="w-64 bg-sidebar p-4 border-r hidden md:block h-screen">
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          </div>
        </aside>
        <section className="flex-1 p-4 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-10 animate-spin" />
            <p className="text-muted-foreground text-sm">Cargando...</p>
          </div>
        </section>
      </main>
    </div>
  );
};
