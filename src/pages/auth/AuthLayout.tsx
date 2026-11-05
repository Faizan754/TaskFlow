import { Outlet } from "react-router";
import Navbar from "../Navbar";

const AuthLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
