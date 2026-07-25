import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <h1 className="text-3xl font bold text-blue-600">
        This is the layout page!
      </h1>
      <Outlet />
    </div>
  );
}

export default Layout;
