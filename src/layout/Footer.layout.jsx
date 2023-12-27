import { NavLink, Outlet } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-col main-wrapper w-full">
      <Outlet />

      <div className="flex fixed bottom-0 w-full justify-center footer">
        <nav className="flex justify-between my-6 w-full max-w-3xl items-center px-5">
          <NavLink
            to="/invest"
            className="flex flex-col items-center cursor-pointer text-cyan-300 hover:text-white"
          >
            <span className="material-symbols-outlined">home</span>
            Home
          </NavLink>
        </nav>
      </div>
    </div>
  );
}