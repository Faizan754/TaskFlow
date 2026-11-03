import { Link } from "react-router";
import myLogo from "../assets/logo.png";
import UserProfile from "../components/UserProfile";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      {/* Thin gradient accent line along the top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <img
            alt="Taskflow Logo"
            src={myLogo}
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
          />
          <span className="hidden text-2xl font-bold tracking-tight text-gray-900 sm:block">
            Task<span className="text-blue-600">Flow</span>
          </span>
        </Link>

        <UserProfile />
      </div>
    </nav>
  );
};

export default Navbar;
