import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CUTE_IMAGES } from "../constants";
import RomanticSynth from "../utils/RomanticSynth";
import db, { timestamp } from "../firebase";

// Screen components
import ProposalQuestion from "../components/ProposalQuestion";
import ShockScreen from "../components/ShockScreen";
import SchedulePicker from "../components/SchedulePicker";
import FoodSelector from "../components/FoodSelector";
import ShrekMessage from "../components/ShrekMessage";
import FinalCelebration from "../components/FinalCelebration";

export default function ProposalPage() {
  const { id } = useParams();

  // ─── Proposal data from Firestore ─────────────────────────
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Interactive state ────────────────────────────────────
  const [yesStep, setYesStep] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({
    x: 0,
    y: 0,
    moved: false,
  });
  const [noCount, setNoCount] = useState(0);
  const [musicOn, setMusicOn] = useState(false);

  const [dateAnswer, setDateAnswer] = useState("");
  const [timeAnswer, setTimeAnswer] = useState("");
  const [foodAnswer, setFoodAnswer] = useState("");

  // ─── Refs ─────────────────────────────────────────────────
  const synthRef = useRef(null);
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // ─── Fetch proposal ───────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    db.collection("proposals")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setProposal({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ─── Synth ────────────────────────────────────────────────
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

  // ─── Save recipient answers ───────────────────────────────
  const saveAnswers = async () => {
    if (!id) return;
    try {
      await db.collection("proposals").doc(id).update({
        dateAnswer,
        timeAnswer,
        foodAnswer,
        completedAt: timestamp(),
      });
    } catch (err) {
      console.warn("Failed to save answers:", err);
    }
  };

  // ─── NO button flee ───────────────────────────────────────
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

  const handleReset = () => {
    setYesStep(0);
    setNoButtonPosition({ x: 0, y: 0, moved: false });
    setNoCount(0);
    setDateAnswer("");
    setTimeAnswer("");
    setFoodAnswer("");
  };

  const handleFinalStep = () => {
    setYesStep(5);
    saveAnswers();
  };

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="text-center">
          <img src="/cat-loading.gif" alt="cat-loading" className="w-30 h-30" />
          <p className="text-sm text-gray-400 animate-pulse">
            Loading your proposals...
          </p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center space-y-4 py-12">
        <span className="text-5xl">😢</span>
        <p className="text-gray-500">
          This proposal link is invalid or expired.
        </p>
        <Link
          to="/login"
          className="text-pink-500 font-semibold hover:underline text-sm"
        >
          Create your own proposal ✨
        </Link>
      </div>
    );
  }

  // ─── Derived ──────────────────────────────────────────────
  const activeImage = CUTE_IMAGES[proposal.selectedGifIndex] || CUTE_IMAGES[0];

  return (
    <div
      className="space-y-6 relative flex flex-col items-center"
      ref={containerRef}
    >
      {/* Header Controls */}
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <button
          onClick={toggleMusic}
          className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center hover:bg-pink-100 transition shadow-sm cursor-pointer"
          title="Toggle Music"
        >
          {musicOn ? "🎵" : "🔇"}
        </button>
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
          {yesStep === 4 && <ShrekMessage onNext={handleFinalStep} />}
          {yesStep === 5 && (
            <FinalCelebration
              toName={proposal.toName}
              byName={proposal.byName}
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
          toName={proposal.toName}
          byName={proposal.byName}
          message={proposal.message}
          activeImage={activeImage}
          noCount={noCount}
          noButtonPosition={noButtonPosition}
          onYes={() => setYesStep(1)}
          onNoHover={moveNoButton}
          noButtonRef={noButtonRef}
        />
      )}
    </div>
  );
}
