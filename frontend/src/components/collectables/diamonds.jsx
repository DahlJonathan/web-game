import React from "react";

const Diamonds = ({ x, y, width, height, diamondsImage }) => {
  // Debug log for diamonds image
  console.log("Diamonds image:", diamondsImage);
  return (
    <div
      className="diamonds"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${diamondsImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
};

export default Diamonds;