import { Routes, Route, NavLink } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Calendar from "./pages/Calendar";
import Invite from "./pages/Invite";
import Login from "./pages/Login";
import AuthPage from "./pages/Auth";
import ResetPasswordPage from "./pages/ResetPassword";
import AuthHeader from "./components/AuthHeader";
import Dashboard from "./pages/Dashboard";

// Reusable navigation item with a more modern look
function NavItem({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

// New Layout Component with Sidebar
function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-bold">Candidate Tracker</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {/* Add a new NavItem for the Dashboard */}
          <NavItem to="/dashboard">
            <span className="icon">📊</span>
            Dashboard
          </NavItem>
          <NavItem to="/" end>
            <span className="icon">📋</span>
            Candidates
          </NavItem>
          <NavItem to="/calendar">
            <span className="icon">📅</span>
            Calendar
          </NavItem>
          <NavItem to="/invite">
            <span className="icon">📧</span>
            Invite
          </NavItem>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="main-content">
        <header className="top-header">
          <AuthHeader />
        </header>
        <main className="p-6">{children}</main>
        <footer className="footer-container">
          © {new Date().getFullYear()} The Subramanyan Team
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* All other routes are wrapped in the new Layout */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                {/* Add a new route for the Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Candidates />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/invite" element={<Invite />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}