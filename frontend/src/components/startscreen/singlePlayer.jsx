import React, { useState } from "react";
import GameWrapper from "../../GameWrapper";

const SinglePlayer = ({ onBack, setGameMode }) => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-full">
        <GameWrapper />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="font-bold text-2xl mb-6">Coming Soon!!!</h1>
      <div className="space-x-5">
        <button
          onClick={handleStartGame}
          className="px-6 py-3 mt-5 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition"
        >
          Start Game
        </button> 
      </div> 
      <button
        onClick={onBack}
        className="px-6 mt-5 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
      >
        Home
      </button>
    </div>
  );
};

export default SinglePlayer;