import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-950">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
