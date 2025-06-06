import ws from "./websocket.js";

export default class Game {
    constructor() {
        this.ws = ws; // Connect to WebSocket server
        this.playerId = null;
        this.players = {};
        this.platforms = [];
        this.collectables = [];
        this.diamonds = [];
        this.activeKeys = {}; // Track active keys
        this.inputInterval = null; // Timer for sending inputs
        this.powerUps = [];
        this.powerSpeed = [];

        this.gameContainer = document.getElementById("game-container");
        if (!this.gameContainer) return;
        this.gameContainer.style.width = "1280px";
        this.gameContainer.style.height = "570px";

        this.gameArea = document.createElement("div");
        this.gameArea.id = "game-area";
        this.gameArea.style.top = "0px";
        this.gameArea.style.left = "0px";
        this.gameArea.style.width = "100%";
        this.gameArea.style.maxHeight = "570px";
        this.gameContainer.appendChild(this.gameArea);

        this.lastRenderTime = 0;
        this.fpsInterval = 1000 / 60; // 60 FPS

        this.boundKeyDown = (event) => this.handleKeyChange(event, true);
        this.boundKeyUp = (event) => this.handleKeyChange(event, false);
        document.addEventListener("keydown", this.boundKeyDown);
        document.addEventListener("keyup", this.boundKeyUp);

        this.ws.addEventListener("message", (event) => this.handleServerMessage(event));


        // Play background audio when the game starts

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    handleKeyChange(event, isPressed) {
        const key = event.key === " " ? "Spacebar" : event.key;
        this.activeKeys[key] = isPressed;

        // Start sending inputs at a fixed interval if not already running
        if (!this.inputInterval) {
            this.inputInterval = setInterval(() => this.sendInputs(), 50);
        }
    }

    sendInputs() {
        if (!this.playerId) return;

        const input = {
            moveLeft: this.activeKeys["ArrowLeft"] || false,
            moveRight: this.activeKeys["ArrowRight"] || false,
            jump: this.activeKeys["ArrowUp"] || false,
            push: this.activeKeys["Spacebar"] || false, // Added push mechanic
        };

        this.ws.send(JSON.stringify({ type: "input", input }));

        if (!input.moveLeft && !input.moveRight && !input.jump && this.players[this.playerId]?.isGrounded) {
            clearInterval(this.inputInterval);
            this.inputInterval = null;
        }
    }

    handleServerMessage(event) {
        const data = JSON.parse(event.data);

        if (data.type === "init" || data.type === "initRestart") {
            this.playerId = data.playerId;
            this.platforms = data.state.platforms;
            this.platformImage = data.state.platformImage;
            this.collectables = data.state.collectables;
            this.collectablesImage = data.state.collectablesImage;
            this.powerUps = data.state.powerUps;
            this.powerUpImage = data.state.powerUpImage;
            this.powerSpeed = data.state.powerSpeed;
            this.powerSpeedImage = data.state.powerSpeedImage;
            this.diamonds = data.state.diamonds;
            this.diamondsImage = data.state.diamondsImage;
            
            for (let playerId in data.state.players) {
                let player = data.state.players[playerId];
                this.players[playerId] = {
                    ...player,
                    playerImage: player.playerImage
                };
            }
        } else if (data.type === "update") {
            for (const [id, playerData] of Object.entries(data.state.players)) {
                if (!this.players[id]) {
                    this.players[id] = { 
                        x: playerData.x, 
                        y: playerData.y, 
                        lastX: playerData.x, 
                        lastY: playerData.y, 
                        points: playerData.points,
                        hasPowerUp: playerData.hasPowerUp, // Ensure hasPowerUp is updated
                        powerUpCollectedAt: playerData.hasPowerUp ? Date.now() : null // Set powerUpCollectedAt if hasPowerUp is true
                    };
                } else {
                    this.players[id].lastX = this.players[id].x;
                    this.players[id].lastY = this.players[id].y;
                    this.players[id].x = playerData.x;
                    this.players[id].y = playerData.y;
                    this.players[id].points = playerData.points;
                    this.players[id].hasPowerUp = playerData.hasPowerUp;
                    this.players[id].hasPowerSpeed = playerData.hasPowerSpeed;
                    if (playerData.hasPowerUp && !this.players[id].hasPowerUp) {
                        this.players[id].hasPowerUp = true;
                        this.players[id].powerUpCollectedAt = Date.now(); // Only set once
                    }
                    
                    this.players[id].timestamp = Date.now();
                }
            }
            this.collectables = data.state.collectables;
            this.powerUps = data.state.powerUps;
            this.powerSpeed = data.state.powerSpeed;
            this.diamonds = data.state.diamonds;
        } else if (data.type === "delete") {
            const idToDelete = data.playerId;
            delete this.players[idToDelete];
            document.querySelectorAll(`.player-${idToDelete}`).forEach(el => el.remove());
        }
    }

    destroy() {
        if (this.inputInterval) {
            clearInterval(this.inputInterval);
            this.inputInterval = null;
        }

        document.removeEventListener("keydown", this.boundKeyDown);
        document.removeEventListener("keyup", this.boundKeyUp);

        this.ws.removeEventListener("message", this.handleServerMessage);

        if (this.gameArea) {
            this.gameArea.remove();
            this.gameArea = null;
        }

        this.players = {};
    }

    gameLoop(timestamp) {
        const elapsed = timestamp - this.lastRenderTime;

        if (elapsed > this.fpsInterval) {
            this.lastRenderTime = timestamp - (elapsed % this.fpsInterval);
            this.render();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    render() {
        const gameArea = document.getElementById("game-area");
        if (!gameArea) {
            this.destroy();
            return;
        }

        // Clear all players, platforms, and collectables
        document.querySelectorAll('.player').forEach(el => el.remove());
        document.querySelectorAll(".platform").forEach(el => el.remove());
        document.querySelectorAll(".collectable").forEach(el => el.remove());
        document.querySelectorAll(".power-up").forEach(el => el.remove());
        document.querySelectorAll(".powerspeed").forEach(el => el.remove());
        document.querySelectorAll(".diamonds").forEach(el => el.remove());

        // Fallbacks for images
        const platformImage = this.platformImage || "/images/platform.jpg";
        const collectablesImage = this.collectablesImage || "/images/gem.png";
        const diamondsImage = this.diamondsImage || "/images/diamond.png";
        const powerUpImage = this.powerUpImage || "/images/powerjump.png";
        const powerSpeedImage = this.powerSpeedImage || "/images/powerspeed.png";

        // Render platforms
        if (this.platforms) {
            this.platforms.forEach(platform => {
                let platformEl = document.createElement("div");
                platformEl.classList.add("platform");
                platformEl.style.position = "absolute";
                platformEl.style.left = `${platform.left}px`;
                platformEl.style.top = `${platform.top}px`;
                platformEl.style.width = `${platform.width}px`;
                platformEl.style.height = `${platform.height}px`;
                platformEl.style.backgroundImage = `url(${platformImage})`;
                platformEl.style.backgroundSize = "cover";
                gameArea.appendChild(platformEl);
            });
        }

        // Render collectables
        if (this.collectables) {
            this.collectables.forEach(collectable => {
                if (!collectable.collected) {
                    let collectableEl = document.createElement("div");
                    collectableEl.classList.add("collectable");
                    collectableEl.style.position = "absolute";
                    collectableEl.style.left = `${collectable.x}px`;
                    collectableEl.style.top = `${collectable.y}px`;
                    collectableEl.style.width = `${collectable.width}px`;
                    collectableEl.style.height = `${collectable.height}px`;
                    collectableEl.style.backgroundImage = `url(${collectablesImage})`;
                    collectableEl.style.backgroundSize = "contain";
                    collectableEl.style.backgroundPosition = "center";
                    collectableEl.style.backgroundRepeat = "no-repeat";
                    gameArea.appendChild(collectableEl);
                }
            });
        }

        // Render diamonds
        if (this.diamonds) {
            this.diamonds.forEach(diamond => {
                if (!diamond.collected) {
                    let diamondEl = document.createElement("div");
                    diamondEl.classList.add("diamonds");
                    diamondEl.style.position = "absolute";
                    diamondEl.style.left = `${diamond.x}px`;
                    diamondEl.style.top = `${diamond.y}px`;
                    diamondEl.style.width = `${diamond.width}px`;
                    diamondEl.style.height = `${diamond.height}px`;
                    diamondEl.style.backgroundImage = `url(${diamondsImage})`;
                    diamondEl.style.backgroundSize = "contain";
                    diamondEl.style.backgroundPosition = "center";
                    diamondEl.style.backgroundRepeat = "no-repeat";
                    gameArea.appendChild(diamondEl);
                }
            });
        }

        // Render powerups
        if (this.powerUps) {
            this.powerUps.forEach(powerUp => {
                if (!powerUp.collected) {
                    let powerUpEl = document.createElement("div");
                    powerUpEl.classList.add("power-up");
                    powerUpEl.style.position = "absolute";
                    powerUpEl.style.left = `${powerUp.x}px`;
                    powerUpEl.style.top = `${powerUp.y}px`;
                    powerUpEl.style.width = `${powerUp.width}px`;
                    powerUpEl.style.height = `${powerUp.height}px`;
                    powerUpEl.style.backgroundImage = `url(${powerUpImage})`;
                    powerUpEl.style.backgroundSize = "contain";
                    powerUpEl.style.backgroundPosition = "center";
                    powerUpEl.style.backgroundRepeat = "no-repeat";
                    gameArea.appendChild(powerUpEl);
                }
            });
        }

        // Render power speed
        if (this.powerSpeed) {
            this.powerSpeed.forEach(powerS => {
                if (!powerS.collected) {
                    let powerSpeedEl = document.createElement("div");
                    powerSpeedEl.classList.add("powerspeed");
                    powerSpeedEl.style.position = "absolute";
                    powerSpeedEl.style.left = `${powerS.x}px`;
                    powerSpeedEl.style.top = `${powerS.y}px`;
                    powerSpeedEl.style.width = `${powerS.width}px`;
                    powerSpeedEl.style.height = `${powerS.height}px`;
                    powerSpeedEl.style.backgroundImage = `url(${powerSpeedImage})`;
                    powerSpeedEl.style.backgroundSize = "contain";
                    powerSpeedEl.style.backgroundPosition = "center";
                    powerSpeedEl.style.backgroundRepeat = "no-repeat";
                    gameArea.appendChild(powerSpeedEl);
                }
            });
        }

        const now = Date.now();
        // Render each player
        for (const [id, player] of Object.entries(this.players)) {
            let playerEl = document.createElement("div");
            playerEl.classList.add("player", `player-${id}`);
            playerEl.style.position = "absolute";
            playerEl.style.width = "35px";
            playerEl.style.height = "35px";
            playerEl.style.backgroundImage = `url(${player.playerImage || "/images/1.png"})`; // fallback
            playerEl.style.backgroundSize = "contain";
            playerEl.style.backgroundPosition = "center";
            playerEl.style.backgroundRepeat = "no-repeat";
            playerEl.style.zIndex = "2";

            let t = Math.min((now - player.timestamp) / 50, 1);
            let interpolatedX = player.lastX + (player.x - player.lastX) * t;
            let interpolatedY = player.lastY + (player.y - player.lastY) * t;

            playerEl.style.left = `${interpolatedX}px`;
            playerEl.style.top = `${interpolatedY}px`;

            gameArea.appendChild(playerEl);
        }
    }
}