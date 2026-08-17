import myLogo from "../assets/logo.png";
import UserProfile from "../components/UserProfile";

const Navbar = () => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img alt="Taskflow Logo" src={myLogo} className="h-11 w-auto" />
          </div>
          <div className="hidden sm:ml-4 sm:block">
            <span className="text-3xl font-bold text-white">TaskFlow</span>
          </div>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
