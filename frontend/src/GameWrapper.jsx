// GameWrapper.jsx
import { useEffect, useState } from "react";

const GameWrapper = ({ gameKey }) => {
  const [prevKey, setPrevKey] = useState(null);

  useEffect(() => {
    if (prevKey === null || prevKey !== gameKey) {

      const gameContainer = document.getElementById("game-container");

      if (!gameContainer) {
        console.error("Game container not found!");
        return;
      }

      const script = document.createElement("script");
      script.type = "module"; // Ensures ES module support
      script.src = `./app.js?cb=${Date.now()}`;
      script.async = true;

      // Append script inside the game container
      gameContainer.appendChild(script);

      return () => {
        gameContainer.removeChild(script);
      };
    }

    setPrevKey(gameKey);
  }, [gameKey, prevKey]);

  return (
    <div className="">
      <div
        id="game-container"
        className="relative w-[90vw] border border-black rounded-lg mt-15 bg-cover bg-center"
        /* style={{ backgroundImage: 'url(/background.png)' }} */ //for netlify
        style={{ backgroundImage: "url(/images/background.png)" }}
      ></div>
    </div>
  );
};

export default GameWrapper;
