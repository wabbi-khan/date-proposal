import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingHearts from "./components/FloatingHearts";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePage from "./pages/CreatePage";
import ProposalPage from "./pages/ProposalPage";

/**
 * App — layout shell with routing.
 * Wraps every screen in the shared background, card container, and footer.
 */
export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isProposalRoute = location.pathname.startsWith("/proposal");

  // ─── Auth loading spinner ─────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/cat-loading.gif" alt="cat-loading" className="w-60 h-60" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 selection:bg-pink-200">
      {/* Background */}
      <FloatingHearts resetKey={location.pathname} />

      {/* Decorative floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-10 left-10 text-pink-300 text-3xl opacity-40 animate-bounce"
          style={{ animationDuration: "4s" }}
        >
          🌸
        </div>
        <div
          className="absolute top-20 right-20 text-pink-300 text-2xl opacity-40 animate-pulse"
          style={{ animationDuration: "3s" }}
        >
          💖
        </div>
        <div
          className="absolute bottom-20 left-20 text-pink-300 text-4xl opacity-30 animate-bounce"
          style={{ animationDuration: "6s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-10 right-10 text-pink-300 text-3xl opacity-40 animate-pulse"
          style={{ animationDuration: "5s" }}
        >
          🌸
        </div>
      </div>

      {/* Main Card */}
      <main className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl sm:p-8 p-4 border border-pink-100 z-10 transition-all duration-500 hover:shadow-pink-100/50">
        <Routes>
          {/* Auth routes — redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignupPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />

          {/* Public proposal route */}
          <Route path="/proposal/:id" element={<ProposalPage />} />

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-pink-400 font-medium z-10 space-y-1">
        <p>Made with 💖 for sweet couples</p>
        {isProposalRoute && !user && (
          <Link
            to="/login"
            className="text-pink-500 hover:underline font-bold transition"
          >
            ✨ Create Your Own Proposal Link
          </Link>
        )}
        {user && !["/create"].includes(location.pathname) && (
          <Link
            to="/create"
            className="text-pink-500 hover:underline font-bold transition"
          >
            ✨ Create New Proposal
          </Link>
        )}
      </footer>
    </div>
  );
}
