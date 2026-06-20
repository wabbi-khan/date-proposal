import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Wraps protected routes — redirects to /login if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <p className="text-pink-400 animate-pulse text-sm">Loading...</p> */}
        <img src="/cat-loading.gif" alt="cat-loading" className="w-60 h-60" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
