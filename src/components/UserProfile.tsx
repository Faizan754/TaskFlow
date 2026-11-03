import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
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
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <Menu as="div" className="relative ml-3">
        <div className="flex flex-row gap-3 justify-between items-center">
          <span className="text-base font-semibold text-gray-700">
            {username ? username : "Unknown"}
          </span>

          <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>

            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-gray-200 outline outline-1 -outline-offset-1 outline-gray-300 shadow-sm"
            />
          </MenuButton>
        </div>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {loading ? (
            <Loading />
          ) : !user ? (
            <div>
              <MenuItem>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none"
                >
                  Login
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none"
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
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none"
                >
                  Dashboard
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleOnClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer data-focus:bg-gray-100 data-focus:outline-none"
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
