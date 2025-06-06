import React from 'react';

const Collectable = ({ x, y, width, height, color }) => {
  console.log("Rendering collectable at:", { x, y, width, height, color });
  return (
    <div
      className="collectable"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        borderRadius: '50%',
      }}
    ></div>
  );
};

export default Collectable;