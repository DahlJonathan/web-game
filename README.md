# web-game

## Description

Real-time multiplayer web game using React for menus and vanilla JavaScript for the game logic. The game does not use canvas.

## Stack

Node.js, Express, WebSocket, JavaScript, HTML, CSS.

## Project Structure

```
web-game
├── backend/   
│   ├── config.js         # Configuration (port, network settings)       
│   ├── gameState.js      # Rules, scoring, and updates
│   ├── README.md         # Backend documentation
│   └── server.js         # WebSocket server, game state management
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── app.js        # Initializes the game and handles WebSocket messages
│   │   ├── game.js       # Contains the game logic and rendering
│   │   └── websocket.js  # Handles WebSocket connections
│   ├── src/
│   │   ├── audio/
│   │   ├── components/
│   │   │   ├── collectables/
│   │   │   |   ├── collectable.jsx
│   │   │   │   ├── diamonds.jsx
│   │   │   │   └── powerup.jsx
│   │   │   ├── gameinfo/
│   │   │   │   ├── fps.jsx             # Displays FPS
│   │   │   │   ├── leaveGame.jsx       # Displays who left the game
│   │   │   │   ├── mute.jsx
│   │   │   │   ├── scoreboard.jsx      # Displays the scoreboard
│   │   │   │   └── timer.jsx           # Displays the game timer
│   │   │   ├── pausescreen/
│   │   │   │   ├── pauseScreen.jsx     # Displays the pause screen
│   │   │   │   └── restartScreen.jsx   # Displays the rematching screen
│   │   │   ├── startscreen/
│   │   │   │   ├── howToPlay.jsx       # Shows controls
│   │   │   │   ├── multiPlayer.jsx     # Handles multiplayer start screen
│   │   │   │   ├── singlePlayer.jsx    # Handles singleplayer start screen
│   │   │   │   └── startScreen.jsx     # Displays the start screen
│   ├── images/
│   │   ├── App.jsx                 # Main React component
│   │   ├── audio.js                # Sounds for the game
│   │   ├── GameWrapper.jsx         # Wraps the game area and loads the game script
│   │   ├── main.css                # Main CSS file
│   │   └── main.jsx                # Entry point for the React application
│   ├── .gitignore                  # Ignore node_modules
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML template
│   ├── package-lock.json           # Lock file for npm dependencies
│   ├── package.json                # Project metadata and dependencies
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── README.md                   # Frontend documentation
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── vite.config.js              # Vite configuration
│
├── node_modules/
├── .gitignore                       # Ignore node_modules
├── package-lock.json                # Lock file for npm dependencies
├── package.json                     # Project metadata and dependencies
└── README.md                        # Project documentation
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

3. Open your web browser and navigate to `http://localhost:5173/` to start the game.
    for local testing you can open many windows or in same network try it on different computers.

4. to play agaist other players on the web you have to download and install ngrok. https://ngrok.com/downloads/

when ngrok is set up, run this in cmd

```sh
ngrok http 8080
```

everyone that wants to play need to add ngrok link in websocket.js

example
```sh
window.__ws = new WebSocket('wss://2d78-87-95-197-167.ngrok-free.app');
```
after that everyone can start by navigating to web-game/frontend and start

```sh
npm run start
```

Open your web browser and navigate to `http://localhost:5173/` to play.



## Game Flow

1. **Opening Page**: Single mode, multi mode, How to Play instructions.
2. **Single Mode**: Added later.
3. **Multi Mode**: User joins a game room / server.
3. **How to Play**: Lists keys to move the player, how to pause the game, collectables and powerups.
4. **Game Room**: Lists all players in the game room, max 4 players. When all players have chosen their character and clicked ready button, leader can start the game.
5. **Game**: Timer goes from one minute to zero, scoreboard shows points.
6. **Pause menu**: When clicked `esc` pause menu appears with `contiue`, `quit` and `restart` buttons.
8. **Game Ends**: When time ends an endscreen appears with the `winner` name, `quit` and `restart` buttons.
9. **Leaving the Game**: User is redirected to opening page.

## Developers

Aki Heiskanen       
Jonathan Dahl       
Laura Levistö       

3/2025