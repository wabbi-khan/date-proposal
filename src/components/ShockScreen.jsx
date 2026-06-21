export default function ShockScreen({ onNext }) {
  return (
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
              color: ["#f9a8d4", "#93c5fd", "#fde68a", "#a5b4fc"][i],
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
              color: ["#a5b4fc", "#fde68a", "#f9a8d4", "#93c5fd"][i],
              animationDelay: `${i * 0.2 + 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Shocked reaction GIF */}
      <div className="relative inline-block">
        <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-4 border-pink-200 shadow-lg bg-pink-500">
          <img
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNwYXB2Nm1ndTdlYjlpNmwzZG5uamV0YTFxY3R3Z254ZDF3a2J3ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Cdkk6wFFqisTe/giphy.gif"
            alt="Shocked reaction"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text */}
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
        onClick={onNext}
        className="mt-2 px-8 py-3 bg-pink-400 hover:bg-pink-400 text-white font-bold rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
      >
        okay okay! →
      </button>
    </div>
  );
}
