import { useState, useEffect, useRef } from "react";

// Constants & utilities
import { CUTE_IMAGES } from "./constants";
import RomanticSynth from "./utils/RomanticSynth";

// Screen components
import FloatingHearts from "./components/FloatingHearts";
import CreatorWizard from "./components/CreatorWizard";
import ProposalQuestion from "./components/ProposalQuestion";
import ShockScreen from "./components/ShockScreen";
import SchedulePicker from "./components/SchedulePicker";
import FoodSelector from "./components/FoodSelector";
import ShrekMessage from "./components/ShrekMessage";
import FinalCelebration from "./components/FinalCelebration";

function App() {
  // ─── URL Params ───────────────────────────────────────────
  const query = new URLSearchParams(window.location.search);
  const initialTo = query.get("to") || "";
  const initialBy = query.get("by") || "";
  const initialMsg = query.get("msg") || "Will you go on a date with me?";
  const initialGif = query.get("gif") || "0";
  const isProposalMode = !!(initialTo || query.get("proposal") === "true");

  // ─── State ────────────────────────────────────────────────
  const [toName, setToName] = useState(initialTo);
  const [byName, setByName] = useState(initialBy);
  const [message, setMessage] = useState(initialMsg);
  const [selectedGifIndex, setSelectedGifIndex] = useState(
    parseInt(initialGif) || 0,
  );

  const [viewMode, setViewMode] = useState(
    isProposalMode ? "proposal" : "create",
  );
  // yesStep: 0=pending, 1=shock, 2=when-free, 3=food, 4=shrek-msg, 5=final
  const [yesStep, setYesStep] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({
    x: 0,
    y: 0,
    moved: false,
  });
  const [noCount, setNoCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const [dateAnswer, setDateAnswer] = useState("");
  const [timeAnswer, setTimeAnswer] = useState("");
  const [foodAnswer, setFoodAnswer] = useState("");

  // ─── Refs ─────────────────────────────────────────────────
  const synthRef = useRef(null);
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // ─── Synth Init ───────────────────────────────────────────
  useEffect(() => {
    synthRef.current = new RomanticSynth();
    return () => synthRef.current?.stop();
  }, []);

  const toggleMusic = () => {
    if (!synthRef.current) return;
    if (musicOn) {
      synthRef.current.stop();
      setMusicOn(false);
    } else {
      synthRef.current.start();
      setMusicOn(true);
    }
  };

  // ─── Share URL ────────────────────────────────────────────
  const getShareUrl = () => {
    const params = new URLSearchParams();
    if (toName) params.set("to", toName);
    if (byName) params.set("by", byName);
    params.set("msg", message);
    params.set("gif", selectedGifIndex.toString());
    params.set("proposal", "true");
    return `${window.location.origin}${window.location.pathname}?${params}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Fleeing NO Button ────────────────────────────────────
  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return;

    const mainRect = containerRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();
    const yesBtn = containerRef.current.querySelector(".yes-button");
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    const maxX = mainRect.width - btnRect.width - 24;
    const maxY = mainRect.height - btnRect.height - 24;

    let newX = 0,
      newY = 0,
      attempts = 0;
    do {
      newX = Math.random() * maxX + 12;
      newY = Math.random() * maxY + 12;
      attempts++;
    } while (
      yesRect &&
      newX + btnRect.width > yesRect.left - mainRect.left - 15 &&
      newX < yesRect.right - mainRect.left + 15 &&
      newY + btnRect.height > yesRect.top - mainRect.top - 15 &&
      newY < yesRect.bottom - mainRect.top + 15 &&
      attempts < 30
    );

    setNoButtonPosition({ x: newX, y: newY, moved: true });
    setNoCount((prev) => prev + 1);
  };

  // ─── Reset Handler ────────────────────────────────────────
  const handleReset = () => {
    setYesStep(0);
    setNoButtonPosition({ x: 0, y: 0, moved: false });
    setNoCount(0);
    setDateAnswer("");
    setTimeAnswer("");
    setFoodAnswer("");
  };

  // ─── Derived ──────────────────────────────────────────────
  const activeImage = CUTE_IMAGES[selectedGifIndex] || CUTE_IMAGES[0];

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 selection:bg-pink-200">
      {/* Background */}
      <FloatingHearts resetKey={yesStep} />

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
      <main
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-pink-100 z-10 transition-all duration-500 hover:shadow-pink-100/50"
        ref={containerRef}
      >
        {/* ── Creator Mode ── */}
        {viewMode === "create" && (
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
            onPreview={() => setViewMode("preview")}
          />
        )}

        {/* ── Proposal / Preview Mode ── */}
        {(viewMode === "proposal" || viewMode === "preview") && (
          <div className="space-y-6 relative flex flex-col items-center">
            {/* Header Controls */}
            <div className="absolute top-0 right-10 flex items-center gap-2">
              <button
                onClick={toggleMusic}
                className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center hover:bg-pink-100 transition shadow-sm cursor-pointer"
                title="Toggle Romantic Music"
              >
                {musicOn ? "🎵" : "🔇"}
              </button>
            </div>
            <div className="absolute top-0 left-0 flex items-center gap-2">
              {viewMode === "preview" && (
                <button
                  onClick={() => setViewMode("create")}
                  className="px-2.5 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition cursor-pointer"
                >
                  ⬅️ Back to Editor
                </button>
              )}
            </div>

            {/* Step-based content */}
            {yesStep > 0 ? (
              <div className="w-full">
                {yesStep === 1 && <ShockScreen onNext={() => setYesStep(2)} />}
                {yesStep === 2 && (
                  <SchedulePicker
                    dateAnswer={dateAnswer}
                    setDateAnswer={setDateAnswer}
                    timeAnswer={timeAnswer}
                    setTimeAnswer={setTimeAnswer}
                    onNext={() => setYesStep(3)}
                  />
                )}
                {yesStep === 3 && (
                  <FoodSelector
                    foodAnswer={foodAnswer}
                    onSelect={setFoodAnswer}
                    onNext={() => setYesStep(4)}
                  />
                )}
                {yesStep === 4 && <ShrekMessage onNext={() => setYesStep(5)} />}
                {yesStep === 5 && (
                  <FinalCelebration
                    toName={toName}
                    byName={byName}
                    activeImage={activeImage}
                    dateAnswer={dateAnswer}
                    timeAnswer={timeAnswer}
                    foodAnswer={foodAnswer}
                    onReset={handleReset}
                  />
                )}
              </div>
            ) : (
              <ProposalQuestion
                toName={toName}
                byName={byName}
                message={message}
                activeImage={activeImage}
                noCount={noCount}
                noButtonPosition={noButtonPosition}
                onYes={() => setYesStep(1)}
                onNoHover={moveNoButton}
                noButtonRef={noButtonRef}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-pink-400 font-medium z-10 space-y-1">
        <p>Made with 💖 for sweet couples</p>
        {viewMode !== "create" && (
          <button
            onClick={() => setViewMode("create")}
            className="text-pink-500 hover:underline font-bold transition cursor-pointer"
          >
            ✨ Create Your Own Proposal Link
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
