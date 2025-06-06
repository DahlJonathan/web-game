import React from "react";

const HowToPlay = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Panic Point Sprint</h1>
      <p className="text-lg text-center max-w-md">
        Panic Point Sprint is a fast-paced multiplayer game where you and your
        friends compete to collect as many points as possible in a limited time.
        The player with the most points at the end of the game wins.
      </p>
      <h1 className="text-3xl font-bold m-2">Gamemodes</h1>
      <p className="text-lg text-center max-w-md">
        The leader can choose from two different game modes: "Gather" and "Tag".
      </p>
      <div className="flex flex-row justify-center space-x-6 m-2">
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold m-2">Gather</h2>
          <p className="text-lg max-w-md">
            In Gather mode, you must collect various items to earn points.
          </p>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold m-2">Tag</h2>
          <p className="text-lg max-w-md">
            In Tag mode, you must tag other players by pushing them. Once you
            successfully push another player, they become the tagger.
          </p>
        </div>
      </div>
      <div>
        <div className="text-lg text-center max-w-md mb-4"></div>
        <p>
          Collect the green and pink diamonds to earn points and powerups to get
          advantage.
        </p>
        <div className="flex justify-center items-center mt-4 space-x-5">
          <div className="flex flex-col items-center">
            <img src="src/images/gem.png" alt="collectables" />
            <p>1 point</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="src/images/diamond.png" alt="collectables" />
            <p>5 points</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="src/images/powerjump.png"
              alt="collectables"
              style={{ width: "42px", height: "70px" }}
            />
            <p>jump</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="src/images/powerspeed.png"
              alt="collectables"
              style={{ width: "42px", height: "70px" }}
            />
            <p>speed</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <div className="flex flex-col items-center">
          <img src="src/images/esc.png" alt="keys" />
          <p>Pause</p>
        </div>
      </div>

      <div className="text-lg text-center max-w-md mt-4 mb-4">
        <p className="mb-2">Use the arrow keys to move:</p>
        <div className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <img src="src/images/left.png" alt="keys" />
            <p>Left</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="src/images/up.png" alt="keys" />
            <p>Jump</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="src/images/right.png" alt="keys" />
            <p>Right</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-center mt-2">
          <div className="flex flex-col items-center">
            <img src="src/images/space.png" alt="keys" />
            <p>Push other players near you</p>
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg text-center max-w-md mt-4 mb-4">
          <p>Long jump</p>
          <div className="flex flex-col items-center">
            <img src="src/images/longjump.png" alt="longjump" />
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="px-3 py-2 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
      >
        Back
      </button>
    </div>
  );
};

export default HowToPlay;
