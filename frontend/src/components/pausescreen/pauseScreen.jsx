

const PauseScreen = ({
  onContinue,
  onQuit,
  pausedPlayer,
  onRestart,
  onlyPlayer,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0"></div>

      {/* Pause menu */}
      <div className="relative z-10 border-2 bg-gray-900 rounded-lg p-10 text-center shadow-lg">
        <h1 className="mb-5 text-3xl text-white">{pausedPlayer}</h1>
        <h1 className="mb-5 text-xl text-white">Paused The Game</h1>
        {!onlyPlayer && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onContinue();
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition m-2"
          >
            Continue
          </button>
        )}

        {!onlyPlayer && (
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg transition m-2"
          >
            Restart
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

export default PauseScreen;
