import UserMenuComponent from "@user/components/user-menu.component";
import Button from "@shared/ui/button/button";
import { Link } from "react-router";
import type { User } from "@user/types/user.type";
import { selectUser } from "@user/model/user.selectors";
import { useSelector } from "react-redux";
import SearchBarComponent from "@search/components/search-bar.component";

interface HeaderProps {
  showSearch?: boolean;
}

function Header({ showSearch = false }: HeaderProps) {
  const user = useSelector(selectUser) as User;
  return (
    <header className="flex items-center justify-between p-4 border-b gap-4">
      <div className="flex-1 max-w-2xl">
        {showSearch && <SearchBarComponent />}
      </div>
      <div className="flex items-center gap-2">
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
