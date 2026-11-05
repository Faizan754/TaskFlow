import { Link } from "react-router";
import { MessageSquare } from "lucide-react";
import Logo from "../components/Logo";
import UserProfile from "../components/UserProfile";
import ThemeToggle from "../components/ThemeToggle";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="flex h-[68px] items-center gap-2 px-6 max-md:h-[60px] max-md:px-3">
        <Link
          to="/"
          aria-label="TaskFlow home"
          className="mr-auto flex min-h-11 items-center gap-2.5 rounded-lg font-display text-lg font-bold tracking-tight text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Logo />
          TaskFlow
        </Link>
        <Link
          to="/contact"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-muted hover:bg-surface-sunken hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus max-md:size-11 max-md:justify-center max-md:px-0"
        >
          <MessageSquare className="size-4 max-md:size-5" aria-hidden="true" />
          <span className="max-md:sr-only">Contact</span>
        </Link>
        <ThemeToggle />
        <UserProfile />
      </div>
    </nav>
  );
};

export default Navbar;
