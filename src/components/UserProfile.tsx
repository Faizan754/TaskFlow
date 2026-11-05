import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useNavigate } from "react-router";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import {
  btnBase,
  btnGhost,
  btnIcon,
  btnMd,
  btnPrimary,
  btnSecondary,
  menuItem,
} from "../lib/ui";
import Loading from "./Loading";

const UserProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const handleOnClick = () => {
    supabase.auth
      .signOut()
      .then(() => navigate("/"))
      .catch((error) => console.log("Sign out failed!", error));
  };
  const username = user?.user_metadata?.username;

  return (
    <div className="relative flex items-center gap-2">
      {!loading && !user && (
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className={`${btnBase} ${btnMd} ${btnGhost}`}>
            Log in
          </Link>
          <Link to="/signup" className={`${btnBase} ${btnMd} ${btnPrimary}`}>
            Sign up
          </Link>
        </div>
      )}
      <Menu as="div" className={user ? "relative" : "relative md:hidden"}>
        {user ? (
          <MenuButton className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface pr-2.5 pl-1.5 text-sm font-semibold text-fg hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-open:bg-surface-sunken max-md:h-11">
            <span className="sr-only">Open user menu</span>
            <span
              aria-hidden="true"
              className="grid size-7 place-content-center rounded-full bg-linear-135 from-[#1a6bff] to-[#4b2ae8] text-xs font-bold text-white"
            >
              {(username?.[0] ?? "?").toUpperCase()}
            </span>
            <span className="max-md:hidden">
              {username ? username : "Unknown"}
            </span>
            <ChevronDown
              className="size-4 text-muted transition-transform group-data-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </MenuButton>
        ) : (
          <MenuButton
            className={`${btnBase} ${btnIcon} ${btnSecondary}`}
          >
            <span className="sr-only">Open user menu</span>
            <MenuIcon size={20} aria-hidden="true" />
          </MenuButton>
        )}
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-xl border border-border bg-surface-raised p-1.5 shadow-lg transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in motion-reduce:transition-none"
        >
          {loading ? (
            <Loading />
          ) : !user ? (
            <div>
              <MenuItem>
                <Link to="/login" className={menuItem}>
                  <User className="size-4 text-muted" aria-hidden="true" />
                  Log in
                </Link>
              </MenuItem>
              <div className="px-1 pt-1.5 pb-0.5">
                <MenuItem>
                  <Link
                    to="/signup"
                    className={`${btnBase} ${btnMd} ${btnPrimary} w-full`}
                  >
                    Sign up
                  </Link>
                </MenuItem>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-1 border-b border-border px-2.5 pt-2 pb-2.5">
                <div className="text-[13px] font-semibold text-fg">
                  {username ? username : "Unknown"}
                </div>
                <div className="text-xs text-muted">{user.email}</div>
              </div>
              <MenuItem>
                <Link to="/dashboard" className={menuItem}>
                  <LayoutDashboard
                    className="size-4 text-muted"
                    aria-hidden="true"
                  />
                  Dashboard
                </Link>
              </MenuItem>
              <div className="mx-1.5 my-1 h-px bg-border" />
              <MenuItem>
                <button
                  onClick={handleOnClick}
                  className={`${menuItem} text-danger-text`}
                >
                  <LogOut
                    className="size-4 text-danger-text"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </MenuItem>
            </div>
          )}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default UserProfile;
