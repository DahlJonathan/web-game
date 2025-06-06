import React, { useState, useEffect } from "react";
import ws from "../../../public/websocket";
import GameWrapper from "../../GameWrapper";
import Scoreboard from "../gameinfo/scoreboard";
import Timer from "../gameinfo/timer";
import Fps from "../gameinfo/fps";
import audio from "../../audio";
import Mute from "../gameinfo/mute";

const characters = [
  { id: 1, name: "Character 1", image: "../../src/images/1.png" },
  { id: 2, name: "Character 2", image: "../../src/images/2.png" },
  { id: 3, name: "Character 3", image: "../../src/images/3.png" },
  { id: 4, name: "Character 4", image: "../../src/images/4.png" },
];

const MultiPlayer = ({
  onGameRoomSelect,
  selectedRoom,
  onJoinGame,
  onGameStart,
  onBack,
  onQuit,
  scoreboard,
  onPause,
  onRestart,
  winnerName,
  winnerPoints,
  draw,
  drawPlayers,
  gameKey,
  restartTimer,
  endGame,
  onlyPlayer,
  setPlayerName,
  playerName,
  setCountdownActive,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [lobbyLeader, setLobbyLeader] = useState(null);
  const [timeUp, setTimeUp] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [time, setTime] = useState(60);
  const [countdown, setCountdown] = useState(5);
  const [hasJoined, setHasJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameMode, setGameMode] = useState("Gather");

  useEffect(() => {
    ws.send(JSON.stringify({ type: "requestPlayers" }));
  }, [players]);

  const back = () => {
    setPlayers([]);
    ws.send(
      JSON.stringify({ type: "leaveLobby", playerName, room: selectedRoom })
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audio.muteAll(!isMuted);
  };

  const handleInput = (e) => {
    const newName = e.target.value;

    ws.send(JSON.stringify({ type: "checkName", name: newName }));
  };

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "lobbyUpdate") {
        const updatedPlayers = Object.values(data.state.players);
        setPlayers(updatedPlayers);

        // Find the leader from the players list
        const leader = updatedPlayers.find((player) => player.isLeader);
        setLobbyLeader(leader);
      } else if (data.type === "init") {
        setGameStarted(true);
        setTime(60);
        setCountdown(5);
        onGameStart();
      } else if (data.type === "playerJoined" || data.type === "playerLeft") {
        const updatedPlayers = Object.values(data.state.players);
        setPlayers(updatedPlayers);
        if (updatedPlayers.length > 0) {
          setLobbyLeader(updatedPlayers[0]);
        }
        setPlayerName("");
      } else if (data.type === "error") {
        setMessage(data.message);
        setPlayerName("");
      } else if (data.type === "nameOkay") {
        setPlayerName(data.name);
        setMessage("");
      } else if (data.type === "gameMode") {
        setGameMode(data.mode);
      }
    };
  }, [gameStarted]);

  const handleJoin = () => {
    if (
      playerName.trim() &&
      selectedRoom &&
      players.length < 4 &&
      !players.some((player) => player.name === playerName.trim())
    ) {
      ws.send(
        JSON.stringify({ type: "joinLobby", playerName, room: selectedRoom })
      );
      setPlayerName(playerName.trim());
      setMessage("");
      setHasJoined(true);
      onJoinGame(playerName.trim());
    } else {
      setMessage("Username already taken");
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  const handleReady = () => {
    setIsReady(!isReady);
    ws.send(
      JSON.stringify({
        type: "ready",
        playerName,
        roomId: selectedRoom,
        isReady: !isReady,
      })
    );
  };

  useEffect(() => {
    ws.send(JSON.stringify({ type: "updateGameMode", mode: gameMode }));
  }, [gameMode]);

  const toggleGameMode = () => {
    setGameMode((prevMode) => (prevMode === "Gather" ? "Tag" : "Gather"));
  };

  const handleStartGame = () => {
    ws.send(
      JSON.stringify({
        type: "startGame",
        playerName,
        room: selectedRoom,
      })
    );
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    ws.send(
      JSON.stringify({
        type: "characterSelect",
        playerName,
        characterId: character.id,
      })
    );
  };

  if (gameStarted && playerName) {
    return (
      <>
        <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
          <Timer
            time={time}
            countdown={countdown}
            isPaused={onPause}
            onTimeUp={handleTimeUp}
            onRestart={onRestart}
            onQuit={onQuit}
            winnerName={winnerName}
            winnerPoints={winnerPoints}
            draw={draw}
            drawPlayers={drawPlayers}
            restartTimer={restartTimer}
            endGame={endGame}
            onlyPlayer={onlyPlayer}
            setCountdownActive={setCountdownActive}
          >
            <Fps className="absolute left-0 top-0 ml-4 mt-4 text-lg rounded-lg" />
            <div className="absolute right-0 top-0 text-lg rounded-lg">
              <Mute isMuted={isMuted} toggleMute={toggleMute} />
            </div>
          </Timer>
          <GameWrapper
            players={players}
            reset={onRestart}
            playerName={playerName}
            gameKey={gameKey}
            onRestart={handleStartGame}
          />
          <div className="w-full max-w-[1280px]">
            <Scoreboard players={scoreboard} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="font-bold text-3xl mb-3">Join a Game Room!</h1>

      <div className="flex flex-col md:flex-row w-full justify-center items-center">
        <div className="flex flex-col items-center max-w-[300px] md:w-1/4">
          {/* Username Input */}
          <h2 className="font-bold text-xl mb-3">Enter Unique Username</h2>
          <input
            type="text"
            maxLength={12}
            value={playerName}
            onChange={handleInput}
            className="p-2 font-bold text-center text-black rounded-lg mb-2 bg-white"
            placeholder="Name (max 12 characters)"
          />
          <p className="text-xl mt-3">Choose server</p>
          {/* Game Room Selection */}
          <div>
            {["Server 1"].map((room) => (
              <button
                key={room}
                onClick={() => onGameRoomSelect(room)}
                disabled={!playerName.trim()}
                className={`px-3 py-1 m-2 font-bold rounded-lg transition ${
                  selectedRoom === room
                    ? "bg-blue-500"
                    : "bg-red-500 hover:bg-red-700"
                } text-white`}
              >
                {room}
              </button>
            ))}
          </div>
          <p className="text-xl mt-3">Current mode: {gameMode}</p>
          <button
            onClick={toggleGameMode}
            disabled={!lobbyLeader || lobbyLeader.name !== playerName}
            className={`px-4 py-2 mb-4 font-bold rounded-lg transition ${
              lobbyLeader && lobbyLeader.name === playerName
                ? gameMode === "hunt"
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-green-500 hover:bg-green-700"
                : "bg-gray-500 cursor-not-allowed"
            } text-white`}
          >
            Switch to {gameMode === "Gather" ? "Tag" : "Gather"} Mode
          </button>
          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={
              !selectedRoom ||
              players.length >= 4 ||
              !playerName.trim() ||
              players.some((player) => player.name === playerName.trim())
            }
            className={`px-6 py-2 mb-2 font-bold rounded-lg transition ${
              selectedRoom &&
              players.length < 4 &&
              playerName.trim() &&
              !players.some((player) => player.name === playerName.trim())
                ? "bg-yellow-500 hover:bg-yellow-700"
                : "bg-gray-500 cursor-not-allowed"
            } text-white`}
          >
            {players.length < 4 ? "Join Server" : "Server Full"}
          </button>
          <div className="text-red-500 text-2xl">{message}</div>
        </div>

        <div className="flex flex-col items-center mt-5 max-w-[300px] md:w-1/4 p-4">
          {/* Player List */}
          <div className="border-2 border-white p-4 rounded-lg mb-4 max-w-[240px] h-[200px]">
            <h2 className="text-xl mb-2">
              Players on server: {players.length}/4
            </h2>
            <ul className="mb-4">
              {players.map((player, index) => (
                <li key={index} className="text-lg">
                  {player.name} {player.isReady ? "(R)" : ""}{" "}
                  {lobbyLeader?.name === player.name ? "(Leader)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-2 text-center">Choose character</h2>
        <div className="flex flex-wrap justify-center">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => handleCharacterSelect(character)}
              disabled={!hasJoined}
              className={`m-2 p-2 rounded-lg transition ${
                selectedCharacter?.id === character.id
                  ? "bg-blue-500"
                  : "bg-red-500 hover:bg-red-700"
              } text-white`}
            >
              <img
                src={`/images/${character.image}`}
                alt={character.name}
                width={50}
                height={50}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Centered Ready Button */}
      <div className="flex justify-center">
        <button
          onClick={handleReady}
          disabled={!selectedCharacter || !hasJoined}
          className={`px-6 py-2 mb-2 mt-3 font-bold rounded-lg transition ${
            isReady
              ? "bg-green-500 hover:bg-green-700"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
        >
          {isReady ? "Unready" : "Ready"}
        </button>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-10">
        {/* Back Button */}
        <button
          onClick={() => {
            onBack();
            back();
          }}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition"
        >
          Back
        </button>
        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          disabled={
            !lobbyLeader ||
            lobbyLeader.name !== playerName ||
            players.length < 2 ||
            !players.every((player) => player.isReady)
          }
          className={`px-4 py-3 font-bold rounded-lg transition ${
            lobbyLeader &&
            lobbyLeader.name === playerName &&
            players.length >= 2 &&
            players.every((player) => player.isReady)
              ? "bg-green-500 hover:bg-green-700"
              : "bg-gray-500 cursor-not-allowed"
          } text-white`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default MultiPlayer;
