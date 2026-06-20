import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";

/**
 * Signup page — email + password + confirm password.
 */
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields 💕");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters 🔐");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match 🥺");
      return;
    }

    setLoading(true);
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message?.replace("Firebase: ", "") || "Signup failed 🥺");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-4xl">💝</span>
        <h1 className="text-3xl font-extrabold text-pink-600 tracking-tight">
          Create Account
        </h1>
        <p className="text-sm text-gray-500">
          Sign up to start creating proposal links!
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-pink-200 disabled:opacity-50 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
        >
          {loading ? "Creating account..." : "Sign Up 💖"}
        </button>
      </form>

      {/* Switch link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-pink-500 font-semibold hover:underline"
        >
          Log In 💕
        </Link>
      </p>
    </div>
  );
}
