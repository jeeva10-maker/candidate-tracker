import { Routes, Route, Link } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Calendar from "./pages/Calendar";
import Invite from "./pages/Invite";
import Auth from "./pages/Auth";
import AuthHeader from "./components/AuthHeader";

export default function App() {
  return (
    <div className="p-6 space-y-6">
      {/* Top bar for sign in/out */}
      <AuthHeader />

      {/* Navigation */}
      <nav className="flex gap-4">
        <Link
          to="/"
          className="px-2 py-1 rounded hover:underline text-blue-600 font-medium"
        >
          Candidates
        </Link>
        <Link
          to="/calendar"
          className="px-2 py-1 rounded hover:underline text-blue-600 font-medium"
        >
          Calendar
        </Link>
        <Link
          to="/invite"
          className="px-2 py-1 rounded hover:underline text-blue-600 font-medium"
        >
          Invite
        </Link>
        <Link
          to="/login"
          className="px-2 py-1 rounded hover:underline text-blue-600 font-medium"
        >
          Login
        </Link>
      </nav>

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Candidates />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </div>
  );
}