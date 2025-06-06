# Backend Documentation

## Overview

The backend of this project is responsible for handling real-time communication between clients, managing game state, and serving static files. It is built using Node.js, Express, and WebSocket.

## Project Structure

```
backend/
├── config.js          # Configuration (port, network settings)
├── gameState.js       # Rules, scoring, and updates
├── server.js          # WebSocket server, game state management
└── README.md          # Backend documentation
```

## Configuration

### `config.js`

This file contains configuration settings for the backend server.

## Gamestate

### `gameState.js`

This file is responsible for managing the state of the game and players.

## WebSocket Server

### `server.js`

This file sets up the WebSocket server using Express and WebSocket. It handles client connections, updates the game state, and broadcasts the updated state to all connected clients.

## How to Run

1. Install the dependencies in `/web-game/` and in `/web-game/frontend`:
    ```sh
    npm install
    ```

2. Start frontend and backend servers in `/web-game/`:
    ```sh
    npm start
    ```

The backend server will start on the port specified in config.js (default is 8080). You can then open your web browser and navigate to `http://localhost:5173/` to start the game.

## Dependencies

- `express`: A minimal and flexible Node.js web application framework.
- `ws`: A simple to use, blazing fast, and thoroughly tested WebSocket client and server for Node.js.