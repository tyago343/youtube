import UserMenuComponent from "@/modules/user/components/user-menu.component";
import Button from "@/shared/ui/button/button";
import { Link } from "react-router";
import type { User } from "@/modules/user/types/user.type";
import { selectUser } from "@/modules/user/model/user.selectors";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector(selectUser) as User;
  return (
    <header className="flex justify-end items-center p-4">
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
    </header>
  );
}
export default Header;
