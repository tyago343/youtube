import { Link } from "react-router";
import Button from "@/components/ui/button";

function Home() {
  return (
    <header className="flex justify-end items-center p-4">
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline">Signup</Button>
        </Link>
      </div>
    </header>
  );
}

export default Home;
