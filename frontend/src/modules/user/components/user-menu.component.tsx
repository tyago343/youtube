import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { PlusIcon } from "lucide-react";
import Button from "@shared/ui/button/button";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar/avatar";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenu,
} from "@shared/ui/navigation-menu/navigation-menu";
import { logout } from "@auth/model/auth.actions";
import type { User } from "@user/types/user.type";

function UserMenuComponent({ user }: { user: User }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function onLogout() {
    await logout(dispatch);
    navigate("/");
  }
  return (
    <div className="flex items-center gap-2">
      <Link to="/upload-video">
        <Button variant="secondary" className="rounded-full cursor-pointer">
          <PlusIcon className="size-4" />
          Create
        </Button>
      </Link>
      <NavigationMenu viewport={false}>
        <NavigationMenuItem className="hidden md:block bg-none border-none">
          <NavigationMenuTrigger className="bg-none border-none outline-none">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[180px] left-auto right-0 z-50">
            <Link to="/profile">
              <NavigationMenuLink>Profile</NavigationMenuLink>
            </Link>
            <NavigationMenuLink className="cursor-pointer" onClick={onLogout}>
              Logout
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}
export default UserMenuComponent;
