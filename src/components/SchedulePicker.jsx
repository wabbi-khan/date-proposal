/**
 * Step 2 — Schedule picker where the user selects a date and time for the date.
 */
export default function SchedulePicker({
  dateAnswer,
  setDateAnswer,
  timeAnswer,
  setTimeAnswer,
  onNext,
}) {
  const handleSubmit = () => {
    if (!dateAnswer || !timeAnswer) {
      alert("Please pick a day and time first! 🥺");
      return;
    }
    onNext();
  };

  return (
    <div className="text-center space-y-6 py-4 animate-[fadeIn_0.4s_ease]">
      <div className="text-4xl space-x-1">📅🐾</div>
      <h2 className="text-3xl font-extrabold text-[#5c2a2a] leading-tight">
        So… when are you free?
      </h2>

      <div className="space-y-4 text-left px-2">
        {/* Date picker */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Pick a Day ✨
          </label>
          <input
            type="date"
            value={dateAnswer}
            placeholder="dd/mm/yyyy"
            onChange={(e) => setDateAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 bg-gray-50 text-gray-700 text-sm transition appearance-none cursor-pointer"
          />
        </div>

        {/* Time selector */}
        <div className="w-full">
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
        onClick={handleSubmit}
        className="w-full py-4 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-2xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer text-base"
      >
        set the date! ❤️
      </button>
    </div>
  );
}
