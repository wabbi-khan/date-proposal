import React, { useState, useEffect, useRef } from "react";

// Built-in presets for GIFs / Illustrations
const CUTE_IMAGES = [
  {
    id: "cute-cat-asking",
    name: "Asking Cat 🐱",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmdzdWJwcnJkMG1iYnZqNmd2eW02ZHRheDJ6ZG9vdDU1OHk4MTU4YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bnNmspe9hFVkKMEtQS/giphy.gif",
    successUrl:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmdzdWJwcnJkMG1iYnZqNmd2eW02ZHRheDJ6ZG9vdDU1OHk4MTU4YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bnNmspe9hFVkKMEtQS/giphy.gif",
  },
  {
    id: "cute-cat-love",
    name: "Hugging Cats 🥰",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXFxcnlicHNnaTIwN3ZlYTh0Z2hvcmpqczRtbHZ4OWM1ZWFnemtjaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XaikVL6qbrJSJoQmCR/giphy.gif",
    successUrl:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXFxcnlicHNnaTIwN3ZlYTh0Z2hvcmpqczRtbHZ4OWM1ZWFnemtjaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XaikVL6qbrJSJoQmCR/giphy.gif",
  },
  {
    id: "mochi-asking",
    name: "Puppy Eyes 🥺",
    url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGN4aWt5c2l4bXJydHNtZnE4ODFsbTV4NGxhN3E4NHQ1Y2dxemFuZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sXv0vaA4331Ti/giphy.gif",
    successUrl:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGN4aWt5c2l4bXJydHNtZnE4ODFsbTV4NGxhN3E4NHQ1Y2dxemFuZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sXv0vaA4331Ti/giphy.gif",
  },
];

const PRESETS = [
  "Will you go on a date with me? 🌸",
  "Will you be my Valentine? 💝",
  "Will you make me the happiest person and be my partner? 💍",
  "Let's go grab a coffee/drink together? ☕",
];

// Custom Audio Synth to play soft, romantic chime melodies
class RomanticSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.seqId = null;
  }

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.isPlaying = true;

      // Melody: Canon in D/Romantic chords sequence
      // Notes: D4, F#4, A4, D5, C#5, A4, B4, D5, A4, F#4, G4, B4, A4...
      const notes = [
        293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 493.88, 587.33, 440.0,
        369.99, 392.0, 493.88, 440.0, 349.23, 392.0, 440.0,
      ];

      let step = 0;
      const playNote = () => {
        if (!this.isPlaying) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Soft triangle wave for a cozy chime sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        step++;
        // Play next note every 0.6 seconds
        this.seqId = setTimeout(playNote, 600);
      };

      playNote();
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.seqId) clearTimeout(this.seqId);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

function App() {
  // Read params from URL to determine if we show proposal mode
  const query = new URLSearchParams(window.location.search);
  const initialTo = query.get("to") || "";
  const initialBy = query.get("by") || "";
  const initialMsg = query.get("msg") || "Will you go on a date with me?";
  const initialGif = query.get("gif") || "0";

  const isProposalMode = !!(initialTo || query.get("proposal") === "true");

  // App States
  const [toName, setToName] = useState(initialTo);
  const [byName, setByName] = useState(initialBy);
  const [message, setMessage] = useState(initialMsg);
  const [selectedGifIndex, setSelectedGifIndex] = useState(
    parseInt(initialGif) || 0,
  );

  // Navigation & Interactive UI States
  const [viewMode, setViewMode] = useState(
    isProposalMode ? "proposal" : "create",
  ); // 'create', 'preview', 'proposal'
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
  // Post-yes answers
  const [dateAnswer, setDateAnswer] = useState("");
  const [timeAnswer, setTimeAnswer] = useState("");
  const [foodAnswer, setFoodAnswer] = useState("");

  // References
  const synthRef = useRef(null);
  const canvasRef = useRef(null);
  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize synth
  useEffect(() => {
    synthRef.current = new RomanticSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Handle music toggle
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

  // Generate shareable link
  const getShareUrl = () => {
    const params = new URLSearchParams();
    if (toName) params.set("to", toName);
    if (byName) params.set("by", byName);
    params.set("msg", message);
    params.set("gif", selectedGifIndex.toString());
    params.set("proposal", "true");
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Move NO button away dynamically
  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return;

    const mainRect = containerRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();

    // Find the YES button to avoid overlapping with it
    const yesBtn = containerRef.current.querySelector(".yes-button");
    const yesRect = yesBtn ? yesBtn.getBoundingClientRect() : null;

    // Compute range inside the container/card so it stays visible and reachable, leaving a small margin (12px)
    const maxX = mainRect.width - btnRect.width - 24;
    const maxY = mainRect.height - btnRect.height - 24;

    let newX = 0;
    let newY = 0;
    let attempts = 0;

    // Generate random positions until we find one that doesn't overlap with the YES button
    do {
      newX = Math.random() * maxX + 12;
      newY = Math.random() * maxY + 12;
      attempts++;
    } while (
      yesRect &&
      // check overlap relative to the main container coordinate space
      newX + btnRect.width > yesRect.left - mainRect.left - 15 &&
      newX < yesRect.right - mainRect.left + 15 &&
      newY + btnRect.height > yesRect.top - mainRect.top - 15 &&
      newY < yesRect.bottom - mainRect.top + 15 &&
      attempts < 30
    );

    setNoButtonPosition({
      x: newX,
      y: newY,
      moved: true,
    });
    setNoCount((prev) => prev + 1);
  };

  // Floating hearts / Confetti Canvas implementation
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles array
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 12 + 8;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = -(Math.random() * 2 + 1);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, ${Math.random() * 20 + 70}%)`;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        // Draw Heart
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -this.size / 2,
          -this.size / 2,
          -this.size,
          this.size / 3,
          0,
          this.size,
        );
        ctx.bezierCurveTo(
          this.size,
          this.size / 3,
          this.size / 2,
          -this.size / 2,
          0,
          0,
        );
        ctx.fill();
        ctx.restore();
      }
    }

    // Spawn initial particles
    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [yesStep]);

  const activeImage = CUTE_IMAGES[selectedGifIndex] || CUTE_IMAGES[0];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 selection:bg-pink-200">
      {/* Floating Canvas Hearts */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Floating Elements (Decorative CSS Hearts) */}
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

      {/* Main Container */}
      <main
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-pink-100 z-10 transition-all duration-500 hover:shadow-pink-100/50"
        ref={containerRef}
      >
        {/* Creator Wizard / Generator Screen */}
        {viewMode === "create" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-4xl">💖</span>
              <h1 className="text-3xl font-extrabold text-pink-600 tracking-tight font-playful">
                Date Proposal Maker
              </h1>
              <p className="text-sm text-gray-500">
                Create a personalized link to send to your partner!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aria"
                  value={byName}
                  onChange={(e) => setByName(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
                  Partner's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jamie"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">
                  Select a Message
                </label>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessage(p)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition ${
                        message === p
                          ? "border-pink-400 bg-pink-50 text-pink-700 font-medium"
                          : "border-gray-100 hover:bg-pink-50/30 text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or type a custom message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/20 text-gray-700 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pink-500 mb-2">
                  Choose Cute Illustration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CUTE_IMAGES.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedGifIndex(idx)}
                      className={`flex flex-col items-center p-2 rounded-xl border transition ${
                        selectedGifIndex === idx
                          ? "border-pink-400 bg-pink-50 text-pink-700 font-semibold scale-105"
                          : "border-gray-100 hover:bg-pink-50/10 text-gray-500"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-12 h-12 object-cover rounded-lg mb-1"
                      />
                      <span className="text-[10px] text-center line-clamp-1">
                        {img.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-pink-50 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className="flex-1 px-4 py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold rounded-xl transition shadow-md shadow-pink-100 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  👁️ Preview
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!toName}
                  className="flex-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  {copied ? "✅ Link Copied!" : "🔗 Copy Proposal Link"}
                </button>
              </div>

              {!toName && (
                <p className="text-center text-[11px] text-pink-400 animate-pulse">
                  ⚠️ Enter your partner's name to enable copying and sharing!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Receiver Proposal / Preview Mode */}
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

            {/* Post-YES Multi-step Flow */}
            {yesStep > 0 ? (
              <div className="w-full">
                {/* ── STEP 1: Shock screen ── */}
                {yesStep === 1 && (
                  <div className="text-center space-y-5 py-4 animate-[fadeIn_0.4s_ease]">
                    {/* Confetti dots decoration */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                      {["+", "■", "●", "▲"].map((s, i) => (
                        <span
                          key={i}
                          className="absolute text-xs font-bold animate-bounce"
                          style={{
                            top: `${10 + i * 20}%`,
                            left: `${5 + i * 22}%`,
                            color: ["#f9a8d4", "#93c5fd", "#fde68a", "#a5b4fc"][
                              i
                            ],
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${1.5 + i * 0.4}s`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {["+", "■", "●", "▲"].map((s, i) => (
                        <span
                          key={i + 4}
                          className="absolute text-xs font-bold animate-bounce"
                          style={{
                            top: `${15 + i * 18}%`,
                            right: `${5 + i * 20}%`,
                            color: ["#a5b4fc", "#fde68a", "#f9a8d4", "#93c5fd"][
                              i
                            ],
                            animationDelay: `${i * 0.2 + 0.5}s`,
                            animationDuration: `${2 + i * 0.3}s`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="relative inline-block">
                      <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-4 border-pink-200 shadow-lg bg-pink-500">
                        <img
                          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNwYXB2Nm1ndTdlYjlpNmwzZG5uamV0YTFxY3R3Z254ZDF3a2J3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cdkk6wFFqisTe/giphy.gif"
                          alt="Shocked reaction"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 px-2">
                      <h2 className="text-3xl font-extrabold text-gray-800 leading-tight uppercase tracking-tight">
                        WAIT YOU ACTUALLY
                        <br />
                        SAID YES?? 😭
                      </h2>
                      <p className="text-sm text-gray-400 italic">
                        I was so ready for you to say no 🙈
                      </p>
                    </div>

                    <button
                      onClick={() => setYesStep(2)}
                      className="mt-2 px-8 py-3 bg-pink-200 hover:bg-pink-300 text-pink-700 font-bold rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      okay okay! →
                    </button>
                  </div>
                )}

                {/* ── STEP 2: When are you free? ── */}
                {yesStep === 2 && (
                  <div className="text-center space-y-6 py-4 animate-[fadeIn_0.4s_ease]">
                    <div className="text-4xl space-x-1">📅🐾</div>
                    <h2 className="text-3xl font-extrabold text-[#5c2a2a] leading-tight">
                      So… when are you free?
                    </h2>

                    <div className="space-y-4 text-left px-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                          Pick a Day ✨
                        </label>
                        <input
                          type="date"
                          value={dateAnswer}
                          onChange={(e) => setDateAnswer(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 bg-gray-50 text-gray-700 text-sm transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                          What Time? 🕐
                        </label>
                        <select
                          value={timeAnswer}
                          onChange={(e) => setTimeAnswer(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 bg-gray-50 text-gray-700 text-sm transition appearance-none cursor-pointer"
                        >
                          <option value="">Select a time...</option>
                          <option>Morning (9am – 12pm) ☀️</option>
                          <option>Afternoon (12pm – 4pm) 🌤️</option>
                          <option>Evening (4pm – 7pm) 🌅</option>
                          <option>Night (7pm – 11pm) 🌙</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!dateAnswer || !timeAnswer) {
                          alert("Please pick a day and time first! 🥺");
                          return;
                        }
                        setYesStep(3);
                      }}
                      className="w-full py-4 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-2xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer text-base"
                    >
                      set the date! ❤️
                    </button>
                  </div>
                )}

                {/* ── STEP 3: What are we feeling? ── */}
                {yesStep === 3 && (
                  <div className="text-center space-y-5 py-4 animate-[fadeIn_0.4s_ease]">
                    <h2 className="text-2xl font-extrabold text-[#5c2a2a] leading-tight">
                      What are we feeling? 🍜✨
                    </h2>

                    <div className="grid grid-cols-3 gap-3 px-1">
                      {[
                        { emoji: "🍕", label: "Pizza" },
                        { emoji: "🍣", label: "Sushi" },
                        { emoji: "🍔", label: "Burgers" },
                        { emoji: "🍝", label: "Pasta" },
                        { emoji: "🌮", label: "Tacos" },
                        { emoji: "🍜", label: "Ramen" },
                      ].map(({ emoji, label }) => (
                        <button
                          key={label}
                          onClick={() => {
                            setFoodAnswer(label);
                            setTimeout(() => setYesStep(4), 350);
                          }}
                          className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                            foodAnswer === label
                              ? "border-pink-400 bg-pink-50 scale-105 shadow-lg shadow-pink-100"
                              : "border-gray-100 bg-gray-50 hover:bg-pink-50/50 hover:border-pink-200"
                          }`}
                        >
                          <span className="text-4xl">{emoji}</span>
                          <span className="text-xs font-semibold text-gray-600">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-gray-400">
                      (tap your choice to continue)
                    </p>
                  </div>
                )}

                {/* ── STEP 4: Shrek Message Card ── */}
                {yesStep === 4 && (
                  <div className="text-center space-y-5 py-4 animate-[fadeIn_0.5s_ease]">
                    {/* Shrek avatar */}
                    {/* <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-pink-200 shadow-md"> */}
                    <img
                      src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3J3MGhwbTJlMm51OGg4ejQ0c3ExM3c3eW9yZ3QyZmI5a24xdjZ2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OuQmhmAAdJFLi/giphy.gif"
                      alt="muah"
                      className="w-40 h-40 mx-auto object-cover rounded-2xl shadow-md border-4 border-pink-100"
                    />
                    {/* </div> */}

                    {/* Message text */}
                    <div className="space-y-2 px-2">
                      <p className="text-lg font-bold text-[#5c2a2a] leading-snug">
                        glad you didn't say no. be ready by 6, I'm coming to get
                        you 🚗
                      </p>
                    </div>

                    {/* Heart emojis row */}
                    <div className="flex justify-center gap-4 text-2xl">
                      {["💖", "💖", "💖", "💖"].map((h, i) => (
                        <span
                          key={i}
                          className="animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setYesStep(5)}
                      className="mt-2 px-8 py-3 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      can't wait! 💕
                    </button>
                  </div>
                )}

                {/* ── STEP 5: Final Celebration Card ── */}
                {yesStep === 5 && (
                  <div className="text-center space-y-5 py-4 animate-[fadeIn_0.5s_ease]">
                    <div className="relative">
                      <img
                        src={activeImage.successUrl}
                        alt="Happy Cat celebration"
                        className="w-40 h-40 mx-auto object-cover rounded-2xl shadow-md border-4 border-pink-100"
                      />
                      <span className="absolute -top-3 -right-3 text-3xl animate-bounce">
                        💖
                      </span>
                      <span className="absolute -bottom-3 -left-3 text-3xl animate-pulse">
                        ✨
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-3xl font-extrabold text-pink-600 leading-tight">
                        Yay! It's a date! 🎉
                      </h2>
                      {toName && (
                        <p className="text-base font-medium text-pink-800">
                          {toName} & {byName || "me"} 💑
                        </p>
                      )}
                    </div>

                    {/* Summary card */}
                    <div className="bg-pink-50 border border-pink-100 rounded-2xl px-5 py-4 space-y-2 text-left">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-lg">📅</span>
                        <span className="font-semibold">When:</span>
                        <span>
                          {dateAnswer} &mdash; {timeAnswer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-lg">🍽️</span>
                        <span className="font-semibold">Craving:</span>
                        <span>{foodAnswer}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                      Sending lots of hugs and sweet anticipation your way! 🌸
                    </p>

                    <button
                      onClick={() => {
                        setYesStep(0);
                        setNoButtonPosition({ x: 0, y: 0, moved: false });
                        setNoCount(0);
                        setDateAnswer("");
                        setTimeAnswer("");
                        setFoodAnswer("");
                      }}
                      className="px-4 py-2 text-xs text-pink-400 hover:text-pink-600 underline transition cursor-pointer"
                    >
                      Reset & View Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Content Card State: Pending Answer */
              <div className="text-center space-y-6 w-full flex flex-col items-center">
                {/* Proposal Header */}
                <div className="space-y-1">
                  {toName && (
                    <span className="inline-block px-3 py-1 bg-pink-50 border border-pink-100 text-pink-600 font-semibold text-xs rounded-full uppercase tracking-wider animate-pulse">
                      Hey {toName}! 👋
                    </span>
                  )}
                  {byName && (
                    <p className="text-xs text-gray-400">
                      You have a message from{" "}
                      <span className="font-semibold text-pink-500">
                        {byName}
                      </span>
                    </p>
                  )}
                </div>

                {/* Animated Image */}
                <div className="relative">
                  <img
                    src={
                      noCount > 6
                        ? "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjJhaW9zMWJobHYxc29zNWY1b2NhZ3hrdXlhencxODF1MGdqazh2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vltEVKbSy0U6ypwba1/giphy.gif"
                        : activeImage.url
                    }
                    alt="Proposing cat illustration"
                    className="w-48 h-48 object-cover rounded-2xl shadow-md border-4 border-pink-50"
                  />
                  {noCount > 0 && (
                    <div className="absolute -bottom-2 right-2 px-2 py-0.5 bg-red-100 text-red-600 border border-red-200 text-[10px] rounded-full font-bold">
                      Rejected {noCount} time{noCount > 1 ? "s" : ""} 🥺
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <h2 className="text-2xl font-bold text-gray-800 leading-snug px-2">
                  {message}
                </h2>

                {/* YES & NO buttons container */}
                <div className="w-full flex items-center justify-center gap-6 mt-6 min-h-[4rem]">
                  {/* YES Button */}
                  <button
                    onClick={() => setYesStep(1)}
                    style={{
                      transform: `scale(${1 + Math.min(noCount * 0.15, 1.2)})`,
                    }}
                    className="yes-button z-10 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-pink-200 cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    YES 💕
                  </button>

                  {/* NO Button - Dynamic fleeing position */}
                  <button
                    ref={noButtonRef}
                    onMouseEnter={moveNoButton}
                    onMouseOver={moveNoButton}
                    onFocus={moveNoButton}
                    onClick={moveNoButton}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      moveNoButton();
                    }}
                    style={
                      noButtonPosition.moved
                        ? {
                            position: "absolute",
                            left: `${noButtonPosition.x}px`,
                            top: `${noButtonPosition.y}px`,
                            zIndex: 20,
                          }
                        : {
                            position: "relative",
                          }
                    }
                    className="px-6 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-semibold rounded-full border border-purple-200 transition-all duration-100 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {noCount > 4
                      ? "Ohh Please? 🥺"
                      : noCount > 2
                        ? "No... 🙈"
                        : "No"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Branding */}
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
