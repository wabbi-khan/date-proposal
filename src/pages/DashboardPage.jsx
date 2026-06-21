import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import db from "../firebase";
import useAuth from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to Firestore records in real-time
  useEffect(() => {
    if (!user) return;
    const unsubscribe = db
      .collection("proposals")
      .where("userId", "==", user.uid)
      // .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || null,
          }));
          setRecords(data);
          setLoading(false);
        },
        () => setLoading(false),
      );
    return unsubscribe;
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-pink-600 tracking-tight">
            My Proposals 💖
          </h1>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/create"
            className="px-3 py-1.5 text-xs bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-md shadow-pink-200 active:scale-95 cursor-pointer"
          >
            ✨ New
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col justify-center items-center">
          <div className="text-center">
            <img
              src="/cat-loading.gif"
              alt="cat-loading"
              className="w-30 h-30"
            />
            <p className="text-sm text-gray-400 animate-pulse">
              Loading your proposals...
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && records.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <span className="text-5xl">🌸</span>
          <p className="text-gray-500 text-sm">
            No proposals yet! Create your first one.
          </p>
          <Link
            to="/create"
            className="inline-block px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-pink-200 active:scale-95 cursor-pointer"
          >
            Create Proposal 💕
          </Link>
        </div>
      )}

      {/* Records list */}
      {!loading && records.length > 0 && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
          {/* show records in descending order */}
          {records
            ?.slice()
            ?.reverse()
            ?.map((record) => (
              <div
                key={record.id}
                className="bg-pink-50/60 border border-pink-100 rounded-2xl p-4 space-y-2 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {record.toName || "Unnamed"} 💌
                    </p>
                    <p className="text-xs text-gray-500">
                      from {record.byName || "You"}
                    </p>
                  </div>
                  {record.createdAt && (
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {record.message}
                </p>

                {/* Date details */}
                {(record.dateAnswer ||
                  record.timeAnswer ||
                  record.foodAnswer) && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {record.dateAnswer && (
                      <span className="px-2 py-0.5 bg-white border border-pink-100 rounded-full text-gray-600">
                        📅 {record.dateAnswer}
                      </span>
                    )}
                    {record.timeAnswer && (
                      <span className="px-2 py-0.5 bg-white border border-pink-100 rounded-full text-gray-600">
                        🕐 {record.timeAnswer}
                      </span>
                    )}
                    {record.foodAnswer && (
                      <span className="px-2 py-0.5 bg-white border border-pink-100 rounded-full text-gray-600">
                        🍽️ {record.foodAnswer}
                      </span>
                    )}
                  </div>
                )}

                {/* Share link */}
                {record.shareUrl && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(record.shareUrl)
                    }
                    className="text-[11px] text-pink-500 hover:underline font-medium cursor-pointer"
                  >
                    📋 Copy share link
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
