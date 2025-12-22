import type { User } from "@/features/user/types/user.type";
import UserMenuComponent from "@/features/user/components/user-menu.component";
import { Toaster } from "sonner";
import Button from "@/components/ui/button";
import { Link } from "react-router";
function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="dark min-h-screen bg-background text-white">
        <header className="flex justify-end items-center p-4">
          {user ? (
            <UserMenuComponent user={user} />
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Signup</Button>
              </Link>
            </div>
          )}
        </header>
        <main className="flex">
          <aside className="w-64 bg-sidebar p-4 border-r hidden md:block h-screen">
            Sidebar
          </aside>
          <section className="flex-1 p-4">{children}</section>
        </main>
      </div>
    </>
  );
}
export default MainLayout;
