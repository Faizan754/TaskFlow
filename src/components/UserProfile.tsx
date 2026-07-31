import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import type { User } from "@supabase/supabase-js";
import { Link, Navigate, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";

interface Props {
  user: User | null;
}

const UserProfile = ({ user }: Props) => {
  const navigate = useNavigate();
  const handleOnClick = () => {
    supabase.auth
      .signOut()
      .then(() => navigate("/"))
      .catch((error) => console.log("Sign out failed!", error));
  };
  const username = user?.user_metadata?.username;
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div className="flex flex-row gap-2 justify-between items-center">
          <h1 className="text-3xl font bold text-white">
            {username ? username : "Your Name"}
          </h1>
          <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>

            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
            />
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {!user ? (
            <div>
              <MenuItem>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                >
                  Login
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                >
                  Sign up
                </Link>
              </MenuItem>
            </div>
          ) : (
            <div>
              <MenuItem>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                >
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleOnClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 cursor-pointer data-focus:bg-white/5 data-focus:outline-hidden"
                >
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
