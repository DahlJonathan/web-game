// frontend/public/websocket.js
if (!window.__ws) {

    window.__ws = new WebSocket('ws://localhost:8080'); //ngrok adress here

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