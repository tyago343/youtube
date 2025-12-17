import type { User } from "@/features/user/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenu,
} from "@/components/ui/navigation-menu";

function UserMenuComponent({ user }: { user: User }) {
  return (
    <NavigationMenu>
      <NavigationMenuItem className="hidden md:block bg-none border-none">
        <NavigationMenuTrigger className="bg-none border-none outline-none">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink asChild>
            <Link to="/profile">Profile</Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link to="/logout">Logout</Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link to="/upload-video">Upload Video</Link>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
export default UserMenuComponent;
