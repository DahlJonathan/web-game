import React from "react";

const EndScreen = ({
  onQuit,
  onRestart,
  winnerName,
  winnerPoints,
  draw,
  drawPlayers,
  onlyPlayer,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 border-2 bg-gray-900 rounded-lg p-10 text-center shadow-lg">
        {draw ? (
          <div>
            <h1 className="mb-5 text-3xl text-white">Draw!</h1>
            <h1 className="mb-5 text-xl text-white">
              {drawPlayers === 2
                ? drawPlayers.join(" and ")
                : drawPlayers.slice(0, -1).join(", ") +
                  " and " +
                  drawPlayers.slice(-1)}{" "}
              have the same amount of points!
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="mb-5 text-3xl text-white">{winnerName} Wins!</h1>
            <h1 className="mb-5 text-xl text-white">
              {winnerName} has {winnerPoints} points!
            </h1>
            {onlyPlayer && (
              <h1 className="mb-5 text-xl text-white">
                You are the only player left!
              </h1>
            )}
          </div>
        )}
        {!onlyPlayer && (
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition m-2"
          >
            Rematch
          </button>
        )}
        <button
          onClick={onQuit}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition m-2"
        >
          Quit
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
