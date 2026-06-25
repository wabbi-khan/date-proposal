import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CUTE_IMAGES } from "../constants";
import db, { auth, timestamp } from "../firebase";
import useAuth from "../hooks/useAuth";
import CreatorWizard from "../components/CreatorWizard";
import { toast } from "react-toastify";

export default function CreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [toName, setToName] = useState("");
  const [byName, setByName] = useState("");
  const [message, setMessage] = useState("Will you go on a date with me?");
  const [selectedGifIndex, setSelectedGifIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const savedIdRef = useRef(null);

  // Save proposal to Firestore and return the doc ID
  const saveProposal = async () => {
    if (!user || savedIdRef.current) return savedIdRef.current;
    setSaving(true);
    try {
      const docRef = await db.collection("proposals").add({
        userId: user.uid,
        toName,
        byName,
        message,
        selectedGifIndex,
        createdAt: timestamp(),
      });
      savedIdRef.current = docRef.id;

      // Update the doc with the share URL once we have the ID
      const shareUrl = `${window.location.origin}/proposal/${docRef.id}`;
      await docRef.update({ shareUrl });

      return docRef.id;
    } catch (err) {
      console.warn("Failed to save proposal:", err);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async () => {
    const pid = await saveProposal();
    if (!pid) {
      alert("Failed to save proposal. Please try again! 🥺");
      return;
    }
    const shareUrl = `${window.location.origin}/proposal/${pid}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("🦄 copied link");
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePreview = async () => {
    if (!toName) {
      alert("Please enter your partner's name first! 🥺");
      return;
    }
    const pid = await saveProposal();
    if (!pid) {
      alert("Failed to save proposal. Please try again! 🥺");
      return;
    }
    window.open(`/proposal/${pid}`, "_blank");
  };

  const activeImage = CUTE_IMAGES[selectedGifIndex] || CUTE_IMAGES[0];

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/dashboard"
          className="px-2.5 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition cursor-pointer"
        >
          ⬅️ My Proposals
        </Link>
        <button
          onClick={async () => {
            await auth.signOut();
            navigate("/login", { replace: true });
          }}
          className="px-2.5 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition cursor-pointer"
        >
          Log Out
        </button>
      </div>

      <CreatorWizard
        toName={toName}
        setToName={setToName}
        byName={byName}
        setByName={setByName}
        message={message}
        setMessage={setMessage}
        selectedGifIndex={selectedGifIndex}
        setSelectedGifIndex={setSelectedGifIndex}
        copied={copied}
        copyToClipboard={copyToClipboard}
        onPreview={handlePreview}
        saving={saving}
      />
    </div>
  );
}
