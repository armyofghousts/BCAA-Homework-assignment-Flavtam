import Navigation from "./navigation";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navigation />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
