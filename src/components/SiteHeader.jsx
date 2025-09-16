import { NavLink } from "react-router-dom";
import AuthHeader from "./AuthHeader";

export default function SiteHeader() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold">Candidate Tracker</h1>
        <nav className="flex gap-2">
          <NavLink to="/" className={linkClass} end>
            Candidates
          </NavLink>
          <NavLink to="/calendar" className={linkClass}>
            Calendar
          </NavLink>
          <NavLink to="/invite" className={linkClass}>
            Invite
          </NavLink>
        </nav>
        <AuthHeader />
      </div>
    </header>
  );
}