import { Link } from "react-router";
import Button from "@/shared/ui/button/button";

function NotFound() {
  return (
    <div className="dark min-h-screen bg-background text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Page not found</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
