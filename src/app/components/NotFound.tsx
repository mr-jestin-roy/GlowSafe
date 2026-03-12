import { Link } from "react-router";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="text-6xl mb-4">🌞</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist
      </p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}