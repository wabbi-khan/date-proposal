import { useState, useEffect } from "react";
import { auth } from "../firebase";

/**
 * Shared hook that tracks Firebase auth state.
 * Returns { user, loading }.
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
