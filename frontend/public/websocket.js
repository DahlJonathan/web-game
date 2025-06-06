// frontend/public/websocket.js
if (!window.__ws) {
    const wsUrl =
        window.location.hostname === "localhost"
            ? "ws://localhost:8080"
            : "wss://web-game-production-23a6.up.railway.app";

    window.__ws = new WebSocket(wsUrl);

    window.__ws.onopen = () => {
        console.log('WebSocket connection established');
    };
    window.__ws.onmessage = (event) => {
        // console.log(`WebSocket message received: ${event}`);
    };
    window.__ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    window.__ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

const ws = window.__ws;
export default ws;