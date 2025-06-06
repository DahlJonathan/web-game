//./frontend/src/components/startscreen/startscreen.jsx
import React from "react";

const StartScreen = ({ onSinglePlayer, onMultiPlayer, onHowToPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Panic Point Sprint</h1>
      
      <div className="flex flex-col items-center space-y-4 border-2 border-black bg-gray-800 rounded-lg p-5">
        <div className="flex space-x-4">
          <button
            onClick={onSinglePlayer}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Singleplayer
          </button>

          <button
            onClick={onMultiPlayer}
            className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition"
          >
            Multiplayer
          </button>
        </div>

        <button
          onClick={onHowToPlay}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-lg transition mt-4"
        >
          How to play
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
