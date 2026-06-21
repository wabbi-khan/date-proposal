const FOOD_OPTIONS = [
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍝", label: "Pasta" },
  { emoji: "🌮", label: "Tacos" },
  { emoji: "🍜", label: "Ramen" },
];

export default function FoodSelector({ foodAnswer, onSelect, onNext }) {
  return (
    <div className="text-center space-y-5 py-4 animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl font-extrabold text-[#5c2a2a] leading-tight">
        What are we feeling? 🍜✨
      </h2>

      <div className="grid grid-cols-3 gap-3 px-1">
        {FOOD_OPTIONS.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => {
              onSelect(label);
              setTimeout(onNext, 350);
            }}
            className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 cursor-pointer ${
              foodAnswer === label
                ? "border-pink-400 bg-pink-50 scale-105 shadow-lg shadow-pink-100"
                : "border-gray-100 bg-gray-50 hover:bg-pink-50/50 hover:border-pink-200"
            }`}
          >
            <span className="text-4xl">{emoji}</span>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">(tap your choice to continue)</p>
    </div>
  );
}
