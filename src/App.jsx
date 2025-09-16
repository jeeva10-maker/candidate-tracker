import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Calendar from "./pages/Calendar";
import Invite from "./pages/Invite";

// Small NavItem wrapper for clean active link styling
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-2 py-1 rounded ${
        isActive ? "text-blue-700 font-semibold" : "text-blue-600"
      } hover:underline`
    }
  >
    {children}
  </NavLink>
);

export default function App() {
  return (
    <div className="p-4">
      {/* Top navigation */}
      <nav className="mb-4 space-x-4">
        <NavItem to="/">Candidates</NavItem>
        <NavItem to="/calendar">Calendar</NavItem>
        <NavItem to="/invite">Invite</NavItem>
      </nav>

      {/* Routes (no <BrowserRouter> here) */}
      <Routes>
        <Route path="/" element={<Candidates />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/invite" element={<Invite />} />
      </Routes>
    </div>
  );
}
