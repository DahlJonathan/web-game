# Frontend Documentation

## Overview

The frontend of this project is responsible for rendering the game UI and handling user interactions. It is built using React.

## Project Structure

```
frontend/
├── node_modules/
├── public/
│   ├── app.js        # Initializes the game and handles WebSocket messages
│   ├── game.js       # Contains the game logic and rendering
│   ├── websocket.js  # Handles WebSocket connections
├── src/
│   ├── components/
│   │   ├── collectables/
│   │   │   ├── collectable.jsx
│   │   ├── gameinfo/
│   │   │   ├── fps.jsx
│   │   │   ├── scoreboard.jsx  # Displays the scoreboard
│   │   │   ├── timer.jsx       # Displays the game timer
│   │   ├── pausescreen/
│   │   │   ├── pausescreen.jsx # Displays the pause screen
│   │   ├── startscreen/
│   │   │   ├── howToPlay.jsx
│   │   │   ├── multiplayer.jsx # Handles multiplayer start screen
│   │   │   ├── singleplayer.jsx# Handles singleplayer start screen
│   │   │   ├── startscreen.jsx # Displays the start screen
│   ├── images/
│   ├── App.jsx                 # Main React component
│   ├── GameWrapper.jsx         # Wraps the game area and loads the game script
│   ├── main.css                # Main CSS file
│   ├── main.jsx                # Entry point for the React application
├── .gitignore                  # Ignore node_modules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package-lock.json           # Lock file for npm dependencies
├── package.json                # Project metadata and dependencies
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # Frontend documentation
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite configuration
```

## How to Run

1. Install the dependencies in `/web-game/` and in `/web-game/frontend`:
    ```sh
    npm install
    ```

2. Start frontend and backend servers in `/web-game/`:
    ```sh
    npm start
    ```

The frontend development server will start on the port specified in the configuration (default is 5173). You can then open your web browser and navigate to `http://localhost:5173/` to start the game.

## Dependencies

- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Provides DOM-specific methods that can be used at the top level of your app.
- `vite`: A build tool that aims to provide a faster and leaner development experience for modern web projects.

## Game Flow

1. **Opening Page**: Multi mode, player name, choose game room button.
2. **Single Mode**: Added later, start game button.
3. **Join Game Room**: User joins a game room, session starts for the current user.
4. **Game Room Page**: Lists all players in the game room, max 4 players. When all players click start game, the game screen opens. Game room page has start game and leave game room buttons.

## Components

### App.jsx

The main React component that manages the state of the game and renders the appropriate screens based on the game state.

### GameWrapper.jsx

Wraps the game area and loads the game script.

### `components/startscreen`

Contains components for the start screen, including howToPlay.jsx, `multiplayer.jsx`, `singleplayer.jsx`, and `startscreen.jsx`.

### `components/gameinfo`

Contains components for displaying game information, including fps.jsx, scoreboard.jsx, and timer.jsx.

### `components/pausescreen`

Contains the `pausescreen.jsx` component for displaying the pause screen.

### `components/collectables`

Contains the collectable.jsx component for rendering collectables in the game.

### `public`

Contains the main game logic and WebSocket handling scripts, including app.js, game.js, and websocket.js.