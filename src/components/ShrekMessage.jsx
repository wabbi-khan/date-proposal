/**
 * Step 4 — Shrek-themed message card shown after food selection.
 * Displays a GIF, a personal message, and animated hearts.
 */
export default function ShrekMessage({ onNext }) {
  return (
    <div className="text-center space-y-5 py-4 animate-[fadeIn_0.5s_ease]">
      {/* GIF */}
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3J3MGhwbTJlMm51OGg4ejQ0c3ExM3c3eW9yZ3QyZmI5a24xdjZ2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OuQmhmAAdJFLi/giphy.gif"
        alt="muah"
        className="w-40 h-40 mx-auto object-cover rounded-2xl shadow-md border-4 border-pink-100"
      />

      {/* Message text */}
      <div className="space-y-2 px-2">
        <p className="text-lg font-bold text-[#5c2a2a] leading-snug">
          glad you didn't say no. be ready by 6, I'm coming to get you 🚗
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
        onClick={onNext}
        className="mt-2 px-8 py-3 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
      >
        can't wait! 💕
      </button>
    </div>
  );
}
