// filepath: /home/student/web-game/backend/server.js
import express from 'express';
import { WebSocketServer } from 'ws';
import { PORT } from './config.js';
import GameState from './gameState.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const wss = new WebSocketServer({ noServer: true });
const gameState = new GameState(wss);
let gameInterval = null;
let gameEnded = false;
let rematchActive = false;
let onePlayerLeft = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend's public directory
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

const server = app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws) => {
    let playerId = null;

    console.log(`Player connected`);

    playerId = Math.random().toString(36).substring(2, 11);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === "checkName") {
            if (gameState.gameStarted || rematchActive || onePlayerLeft) {
                ws.send(JSON.stringify({ type: 'error', message: 'Game already started' }));
                return;
            }
            ws.send(JSON.stringify({ type: 'nameOkay', name: data.name }));
        }
        if (data.type === 'requestPlayers') {
            if (playerId === null) return;
            const state = JSON.stringify({ type: 'lobbyUpdate', state: gameState.getGameState(), playerId });
            wss.clients.forEach(client => client.send(state));
        }
        if (data.type === 'joinLobby') {

            if (gameState.gameStarted || rematchActive || onePlayerLeft) {
                ws.send(JSON.stringify({ type: 'error', message: 'Game in progress' }));
                return;
            }


            const existingPlayer = Object.values(gameState.players).find(player => player.name === data.playerName.trim());
            if (existingPlayer) {
                ws.send(JSON.stringify({ type: 'error', message: 'Player name already exists' }));
                return;
            }

            if (playerId === null) {
                gameState.removePlayer(playerId);
                playerId = Math.random().toString(36).substring(2, 11);
            }
            const playerName = gameState.getPlayerName(playerId)
            if (playerName === "") {
                gameState.addPlayer(playerId);
                console.log(`${data.playerName} joined the game!`)
            }
            gameState.updatePlayerName(playerId, data.playerName);
            if (Object.keys(gameState.players).length === 1) {
                gameState.players[playerId].isLeader = true;
            }
            const state = JSON.stringify({ type: 'lobbyUpdate', state: gameState.getGameState(), playerId });
            wss.clients.forEach(client => client.send(state));
        }
        if (data.type === 'ready') {
            if (gameState.players[playerId]) {
                gameState.players[playerId].isReady = data.isReady;
                const updateMessage = JSON.stringify({
                    type: 'lobbyUpdate',
                    state: gameState.getGameState(),
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(updateMessage);
                    }
                });
            }
        }
        if (data.type === 'characterSelect') {
            const player = gameState.players[playerId];
            if (player) {
                gameState.updatePlayerCharacter(playerId, data.characterId);
            }
        }
        if (data.type === "restartRequest") {
            const player = gameState.getPlayerName(playerId);
            Object.values(gameState.players).forEach(player => {
                player.isReady = false;
            })
            rematchActive = true;
            const restartPlayer = data.player;
            const restartMessage = JSON.stringify({ type: "restart", state: gameState.getGameState(), player: player, restartPlayer: restartPlayer });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(restartMessage);
                }
            });
        }
        if (data.type === "accept") {
            if (playerId === null || !gameState.players[playerId]) return;
            const player = gameState.getPlayerName(playerId);
            console.log("player ready:", player);
            gameState.players[playerId].isReady = data.isReady;

            const readyMessage = JSON.stringify({ type: "rematchUpdate", player: player, state: gameState.getGameState() })

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(readyMessage);
                }
            });
        }
        if (data.type === "waitForStart") {
            gameState.pauseGame();
            stopGameLoop();
        }
        if (data.type === "restartGame") {
            if (playerId === null || !gameState.players[playerId]) return;
            if (gameState.players[playerId].isLeader && Object.values(gameState.players).every(player => player.isReady)) {
                gameEnded = false;

                let playerIds = Object.keys(gameState.players);
                playerIds.forEach((id, index) => {
                    gameState.initializePlayerPos(id, index);
                    gameState.resetPlayerPoints(id);
                    gameState.resetPlayerPowerups(id);
                });

                gameState.resetPowerUp();

                const initMessage = JSON.stringify({ type: 'initRestart', state: gameState.getGameState(), playerId });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(initMessage);
                    }
                });
            }
        }
        if (data.type === "updateGameMode") {
            gameState.gameMode = data.mode;
            const updateModeMessage = JSON.stringify({ type: "gameMode", mode: gameState.gameMode })
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(updateModeMessage);
                }
            });
        }
        if (data.type === "startGame") {
            if (playerId === null || !gameState.players[playerId]) return;
            if (gameState.players[playerId].isLeader && Object.values(gameState.players).every(player => player.isReady)) {
                gameEnded = false;
                gameState.startGame();
                gameState.startCollectableTimer();
                if (gameState.gameMode === "Gather") {
                    gameState.resetCollectables();
                }

                gameState.resetPowerUp();
                let playerIds = Object.keys(gameState.players);
                playerIds.forEach((id, index) => {
                    gameState.initializePlayerPos(id, index);
                });

                const initMessage = JSON.stringify({ type: 'init', state: gameState.getGameState(), playerId });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(initMessage);
                    }
                });
                gameState.unpauseGame();
                startGameLoop();
            }
        }
        if (data.type === "endRound") {
            const topPlayers = gameState.endGame();
            if (topPlayers === null) {
                const noPlayersMessage = JSON.stringify({
                    type: 'gameOver',
                    message: 'No players left in the game.',
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(noPlayersMessage);
                    }
                });
            } else if (Array.isArray(topPlayers)) {
                const drawMessage = JSON.stringify({
                    type: 'draw',
                    players: topPlayers.map(player => player.name)
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(drawMessage);
                    }
                });
            } else {
                const winnerMessage = JSON.stringify({
                    type: 'gameOver',
                    winner: topPlayers.name,
                    points: topPlayers.points,
                });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(winnerMessage);
                    }
                });
            }
            gameEnded = true;
            stopGameLoop();
        };
        if (data.type === "input") {
            gameState.updatePlayer(playerId, data.input);
        }
        if (data.type === "pause" && !gameEnded) {
            let playerName = gameState.getPlayerName(playerId);
            gameState.pauseGame();
            stopGameLoop();
            const pauseMessage = JSON.stringify({ type: 'pauseGame', pausedPlayer: playerName });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(pauseMessage);
                }
            });
        }
        if (data.type === "unPause" && !gameEnded) {
            gameState.unpauseGame();
            startGameLoop();
            const unPauseMessage = JSON.stringify({ type: 'unPauseGame', pausedPlayer: "" });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(unPauseMessage);
                }
            });
        }
        if (data.type === "quitGame" || data.type === "leaveLobby") {
            let playerName = gameState.getPlayerName(playerId);
            gameState.removePlayer(playerId);
            console.log(`Player ${playerName} disconnected`);
            const deleteMessage = JSON.stringify({
                type: 'delete',
                state: gameState.getGameState(),
                playerId,
                playerName,
            });
            const lobbyUpdateMessage = JSON.stringify({
                type: 'lobbyUpdate',
                state: gameState.getGameState(),
            });
            const rematchUpdate = JSON.stringify({
                type: 'rematchUpdate',
                state: gameState.getGameState(),
            })
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(deleteMessage);
                    client.send(lobbyUpdateMessage);
                    client.send(rematchUpdate);
                }
            });

            // End game if there's only one player are left
            if (Object.keys(gameState.players).length === 1) {
                if (gameState.gameStarted) {
                    onePlayerLeft = true;
                }
                gameState.endGame();
                gameEnded = true;
                rematchActive = false;
                stopGameLoop();
                const endMessage = JSON.stringify({ type: 'endGame' });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(endMessage);
                    }
                });
            }
            if (Object.keys(gameState.players).length === 0) {
                onePlayerLeft = false;
            }
            playerId = null;
        }
    });

    ws.on('close', () => {
        if (playerId) {
            let playerName = gameState.getPlayerName(playerId);
            gameState.removePlayer(playerId);
            console.log(`Player ${playerId} disconnected`);

            // Assign a new leader if the current leader leaves
            const remainingPlayerIds = Object.keys(gameState.players);
            if (remainingPlayerIds.length > 0) {
                const newLeaderId = remainingPlayerIds[0]; // First remaining player becomes leader
                gameState.players[newLeaderId].isLeader = true;
            }

            const lobbyUpdateMessage = JSON.stringify({
                type: 'lobbyUpdate',
                state: gameState.getGameState(),
            });

            const deleteMessage = JSON.stringify({
                type: 'delete',
                state: gameState.getGameState(),
                playerId,
                playerName,
            })

            const rematchUpdate = JSON.stringify({
                type: 'rematchUpdate',
                state: gameState.getGameState(),
            })

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(lobbyUpdateMessage);
                    client.send(deleteMessage);
                    client.send(rematchUpdate);
                }
            });

            // End game if there's only one player are left
            if (Object.keys(gameState.players).length === 1) {
                if (gameState.gameStarted) {
                    onePlayerLeft = true;
                }
                gameState.endGame();
                onePlayerLeft = true;
                gameEnded = true;
                rematchActive = false;
                stopGameLoop();
                const endMessage = JSON.stringify({ type: 'endGame' });
                wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(endMessage);
                    }
                });
            }
            if (Object.keys(gameState.players).length === 0) {
                onePlayerLeft = false;
            }
            playerId = null;
        }
    });

});

function startGameLoop() {
    if (!gameInterval) {
        gameInterval = setInterval(() => {
            const state = JSON.stringify({ type: 'update', state: gameState.getGameState() });
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(state);
                }
            });
        }, 50);
    }
}

function stopGameLoop() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

console.log(`WebSocket server running on port ${PORT}`);