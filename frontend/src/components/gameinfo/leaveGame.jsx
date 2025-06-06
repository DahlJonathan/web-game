import React, { useEffect, useState } from "react";

function LeaveGame({ playerLeft, onClose }) {
  const [animationPhase, setAnimationPhase] = useState("enter");

  useEffect(() => {
    // Allow a short delay to trigger the slide-in transition from below.
    const enterTimer = setTimeout(() => {
      setAnimationPhase("display");
    }, 50);

    // Stay visible for 3 seconds.
    const displayTimer = setTimeout(() => {
      setAnimationPhase("exit");
    }, 3050);

    // After exit animation (1s), trigger onClose to unmount the component.
    const exitTimer = setTimeout(() => {
      onClose();
    }, 4050);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(displayTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  // Determine the transform and opacity based on the current phase.
  let transformClasses = "";
  let opacityClasses = "";

  if (animationPhase === "enter") {
    // Start off-screen below (100% of its own height) and hidden.
    transformClasses = "translate-y-full";
    opacityClasses = "opacity-0";
  } else if (animationPhase === "display") {
    // Slide into view.
    transformClasses = "translate-y-0";
    opacityClasses = "opacity-100";
  } else if (animationPhase === "exit") {
    // Slide back downward and fade out.
    transformClasses = "translate-y-full";
    opacityClasses = "opacity-0";
  }

  return (
    <div
      className={`absolute bottom-100 z-10 left-1/2 transform -translate-x-1/2 ${transformClasses} ${opacityClasses} transition-all duration-1000 bg-gray-900 bg-opacity-80 border-2 border-gray-700 rounded-lg p-5 text-center shadow-lg`}
    >
      <h1 className="text-xl text-red-600 font-bold">
        {playerLeft} has left the game!
      </h1>
    </div>
  );
}

export default LeaveGame;
