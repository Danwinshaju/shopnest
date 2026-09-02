import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
