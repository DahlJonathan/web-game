

const PowerUp = ({ x, y, width, height }) => {
    return (
        <div
        className="power-up"
        style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '50%',
          }}
        ></div>
    );
}

export default PowerUp;