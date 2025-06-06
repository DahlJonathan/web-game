import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const Mute = ({ isMuted, toggleMute }) => {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full">
            <button onClick={toggleMute} style={{ position: 'absolute', top: '1px', right: '5px', zIndex: 1000 }}>
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
            </button>
        </div>
    );
};

export default Mute;