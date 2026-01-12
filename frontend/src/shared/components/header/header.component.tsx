import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/shared/components/theme-toggle/theme-toggle";
import Button from "@shared/ui/button/button";
import SearchBarComponent from "@search/components/search-bar.component";
import UserMenuComponent from "@user/components/user-menu.component";
import { selectUser } from "@user/model/user.selectors";
import { Logo } from "./logo";
import { MenuIcon } from "lucide-react";

interface HeaderProps {
  showSearch?: boolean;
}

function Header({ showSearch = false }: HeaderProps) {
  const { t } = useTranslation("shared");
  const user = useSelector(selectUser);
  return (
    <header className="flex items-center justify-between p-4 px-5 gap-4 z-20 sticky top-0 bg-background">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full cursor-pointer dark:hover:bg-accent"
        >
          <MenuIcon className="size-6" />
        </Button>
        <Link to="/">
          <Logo />
        </Link>
      </div>
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
              <Button variant="outline">{t("login")}</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="outline">{t("signup")}</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
