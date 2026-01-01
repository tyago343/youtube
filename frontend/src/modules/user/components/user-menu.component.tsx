import type { User } from "@user/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import { Link, useNavigate } from "react-router";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenu,
} from "@shared/ui/navigation-menu/navigation-menu";
import { useDispatch } from "react-redux";
import { logout } from "@auth/model/auth.actions";

function UserMenuComponent({ user }: { user: User }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function onLogout() {
    await logout(dispatch);
    navigate("/");
  }
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuItem className="hidden md:block bg-none border-none">
        <NavigationMenuTrigger className="bg-none border-none outline-none">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </NavigationMenuTrigger>
        <NavigationMenuContent className="min-w-[180px] left-auto right-0 z-50">
          <NavigationMenuLink>
            <Link to="/profile">Profile</Link>
          </NavigationMenuLink>
          <NavigationMenuLink>
            <p onClick={onLogout}>Logout</p>
          </NavigationMenuLink>
          <NavigationMenuLink>
            <Link to="/upload-video">Upload Video</Link>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
export default UserMenuComponent;
