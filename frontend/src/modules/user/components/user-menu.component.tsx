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
import Button from "@shared/ui/button/button";
import { PlusIcon } from "lucide-react";

function UserMenuComponent({ user }: { user: User }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function onLogout() {
    await logout(dispatch);
    navigate("/");
  }
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" className="rounded-full">
        <PlusIcon className="size-4" />
        <Link to="/upload-video">Create</Link>
      </Button>
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
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}
export default UserMenuComponent;
