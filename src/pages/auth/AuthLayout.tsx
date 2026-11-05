import { Outlet } from "react-router";
import Logo from "../../components/Logo";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-2.5 pt-10 font-display text-lg font-bold tracking-tight text-fg max-md:pt-6"
      >
        <Logo /> TaskFlow
      </div>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
