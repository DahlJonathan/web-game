import React, { useState, useEffect, useRef } from "react";

function Fps() {
  const [fps, setFps] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const requestRef = useRef(null);

  useEffect(() => {
    const handleFrame = (timestamp) => {
      frameCountRef.current += 1;
      const deltaTime = timestamp - lastTimeRef.current;

      if (deltaTime >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }

      requestRef.current = requestAnimationFrame(handleFrame);
    };

    requestRef.current = requestAnimationFrame(handleFrame);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, fontSize: 24, color: 'black', backgroundColor: 'white' }}>
      <div className="bg-gray-800 text-white ">FPS: {fps}</div>
    </div>
  );
}

export default Fps;