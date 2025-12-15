import { selectUser } from "@/features/user/selector/user.selector";
import UserMenuComponent from "@user/components/user-menu.component";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector(selectUser);
  return (
    <header className="flex justify-end items-center p-4">
      {user ? <UserMenuComponent user={user} /> : null}
    </header>
  );
}

export default Home;
