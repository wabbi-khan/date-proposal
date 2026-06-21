export default function FinalCelebration({
  toName,
  byName,
  activeImage,
  dateAnswer,
  timeAnswer,
  foodAnswer,
  onReset,
}) {
  return (
    <div className="text-center space-y-5 py-4 animate-[fadeIn_0.5s_ease]">
      {/* Celebration image */}
      <div className="relative">
        <img
          src={
            "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3o1c2FxbjJkaHJvdWxueWdieHNzM202cXQ4cGFwM3ZhN3B5dnlkMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fUQ4rhUZJYiQsas6WD/giphy.gif" ||
            activeImage.successUrl
          }
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

      {/* Names */}
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
        onClick={onReset}
        className="px-4 py-2 text-xs text-pink-400 hover:text-pink-600 underline transition cursor-pointer"
      >
        Reset & View Again
      </button>
    </div>
  );
}
