export default function ProposalQuestion({
  toName,
  byName,
  message,
  activeImage,
  noCount,
  noButtonPosition,
  onYes,
  onNoHover,
  noButtonRef,
}) {
  return (
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
            <span className="font-semibold text-pink-500">{byName}</span>
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

      {/* YES & NO buttons */}
      <div className="w-full flex items-center justify-center gap-6 mt-6 min-h-[4rem]">
        {/* YES Button — grows with each rejection */}
        <button
          onClick={onYes}
          style={{
            transform: `scale(${1 + Math.min(noCount * 0.15, 1.2)})`,
          }}
          className="yes-button z-10 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-pink-200 cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          YES 💕
        </button>

        {/* NO Button — flees from cursor */}
        <button
          ref={noButtonRef}
          onMouseEnter={onNoHover}
          onMouseOver={onNoHover}
          onFocus={onNoHover}
          onClick={onNoHover}
          onTouchStart={(e) => {
            e.preventDefault();
            onNoHover();
          }}
          style={
            noButtonPosition.moved
              ? {
                  position: "absolute",
                  left: `${noButtonPosition.x}px`,
                  top: `${noButtonPosition.y}px`,
                  zIndex: 20,
                }
              : { position: "relative" }
          }
          className="px-6 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-semibold rounded-full border border-purple-200 transition-all duration-100 shadow-sm cursor-pointer whitespace-nowrap"
        >
          {noCount > 4 ? "Ohh Please? 🥺" : noCount > 2 ? "No... 🙈" : "No"}
        </button>
      </div>
    </div>
  );
}
