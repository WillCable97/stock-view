import { Bell } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
      <h1 className="text-xl font-semibold">My Portfolio</h1>
      <div className="flex items-center gap-4">
        <Bell className="text-white" />
        <Button variant="secondary">Log out</Button>
      </div>
    </div>
  );

export default Navbar;