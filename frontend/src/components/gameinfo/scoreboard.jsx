import React from "react";

function Scoreboard({ players }) {
  return (
    <div className="w-full bg-gray-800 text-white text-2xl p-4 shadow-lg flex justify-center items-center gap-4 rounded-lg">
      {players.map((player, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-10 h-10"
            style={{
              backgroundImage: `url(${player.character})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <span>
            {player.isIT ? "(IT)" : ""} {player.name}: {player.points}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Scoreboard;
