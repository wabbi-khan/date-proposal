import { CUTE_IMAGES, PRESETS } from "../constants";

/**
 * Creator Wizard — the main editor screen where users build their proposal.
 * Handles name inputs, message selection, illustration picker, preview & share.
 */
export default function CreatorWizard({
  toName,
  setToName,
  byName,
  setByName,
  message,
  setMessage,
  selectedGifIndex,
  setSelectedGifIndex,
  copied,
  copyToClipboard,
  onPreview,
}) {
  return (
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
        {/* Your Name */}
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

        {/* Partner's Name */}
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

        {/* Message Selection */}
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

        {/* Illustration Picker */}
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

      {/* Action Buttons */}
      <div className="pt-4 border-t border-pink-50 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={onPreview}
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
  );
}
