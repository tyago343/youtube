import { useSelector } from "react-redux";
import { Link } from "react-router";
import { ThemeToggle } from "@/shared/components/theme-toggle/theme-toggle";
import Button from "@shared/ui/button/button";
import SearchBarComponent from "@search/components/search-bar.component";
import UserMenuComponent from "@user/components/user-menu.component";
import { selectUser } from "@user/model/user.selectors";
import { Logo } from "./logo";

interface HeaderProps {
  showSearch?: boolean;
}

function Header({ showSearch = false }: HeaderProps) {
  const user = useSelector(selectUser);
  return (
    <header className="flex items-center justify-between p-4 px-8 gap-4 z-20 sticky top-0 bg-background">
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex-1 max-w-2xl">
        {showSearch && <SearchBarComponent />}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user ? (
          <UserMenuComponent user={user} />
        ) : (
          <div className="flex gap-2">
            <Link to="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="outline">Signup</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
