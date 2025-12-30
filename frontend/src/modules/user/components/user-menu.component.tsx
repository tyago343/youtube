import type { User } from "@/modules/user/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar/avatar";
import { Link } from "react-router";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenu,
} from "@/shared/ui/navigation-menu/navigation-menu";

function UserMenuComponent({ user }: { user: User }) {
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
            <Link to="/logout">Logout</Link>
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
