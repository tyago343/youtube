import { selectUser } from "@/features/user/selector/user.selector";
import UserMenuComponent from "@user/components/user-menu.component";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector(selectUser);
  return user ? <UserMenuComponent user={user} /> : null;
}

export default Home;
