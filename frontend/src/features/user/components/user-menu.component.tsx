import type { User } from "@/features/user/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

function UserMenuComponent({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section className="relative">
      <div onClick={handleOpen}>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      {isOpen && (
        <div className="absolute top-10 right-0 bg-white p-4 rounded-md shadow-md">
          <h1>{user.username}</h1>
          <p>{user.email}</p>
        </div>
      )}
    </section>
  );
}
export default UserMenuComponent;
