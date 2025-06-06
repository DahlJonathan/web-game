export default class GameState {
    constructor(wss) {
        this.wss = wss; // Store the WebSocket server instance
        this.players = {};
        this.leaderId = null;
        this.collectables = [];
        this.powerUps = [];
        this.powerSpeed = [];
        this.hasPowerUp = false;
        this.diamonds = [];
        this.diamondsImage = '/images/diamond.png';
        this.powerSpeedImage = '/images/powerspeed.png';
        this.powerUpImage = '/images/powerjump.png';
        this.collectablesImage = '/images/gem.png';
        this.platformImage = '/images/platform.jpg';
        this.playerImage = '/images/1.png';
        this.gameStarted = false;
        this.gameMode = 'Gather'

        this.gravity = 2;
        this.jumpStrength = 25;
        this.frameRate = 60; // Frames per second
        this.platforms = [
            { left: 0, top: 50, width: 100, height: 10 }, //left upper corner
            { left: 1180, top: 50, width: 100, height: 10 },//right upper coorner
            { left: 150, top: 100, width: 100, height: 10 },// first left
            { left: 1030, top: 100, width: 100, height: 10 },//first right
            { left: 150, top: 470, width: 100, height: 10 },// second left
            { left: 1030, top: 470, width: 100, height: 10 },// second right
            { left: 500, top: 200, width: 100, height: 10 },//first bottom left
            { left: 680, top: 200, width: 100, height: 10 },//first bottom right
            { left: 500, top: 210, width: 10, height: 160 },//middle
            { left: 770, top: 210, width: 10, height: 160 },//middle
            { left: 500, top: 370, width: 100, height: 10 },//middle
            { left: 680, top: 370, width: 100, height: 10 },//middle
            { left: 590, top: 470, width: 100, height: 10 },//bottom middle
            { left: 590, top: 90, width: 100, height: 10 },//top middle
            { left: 600, top: 285, width: 80, height: 10 },//middle
            { left: 200, top: 285, width: 100, height: 10 },//left middle
            { left: 980, top: 285, width: 100, height: 10 },//right middle
            { left: 0, top: 185, width: 100, height: 10 },//left second from top
            { left: 1180, top: 185, width: 100, height: 10 },//right second from top
            { left: 0, top: 385, width: 100, height: 10 },//left third from top
            { left: 1180, top: 385, width: 100, height: 10 },//right third from top
        ];

        this.gameOver = false;
        this.gamePaused = false;
        this.lastUpdateTime = Date.now();


        if (this.gameStarted) {
            this.resetPowerUp();
            this.startCollectableTimer();
        }
    }

    generateCollectables() {
        return Array.from({ length: 40 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 25,
            height: 35,
            collected: false,
        }));
    }

    generateDiamonds() {
        return Array.from({ length: 3 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 40,
            height: 40,
            collected: false,
        }));
    }

    generatePowerJump() {
        return Array.from({ length: 1 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 40,
            height: 40,
            collected: false,
        }));
    }

    generatePowerSpeed() {
        return Array.from({ length: 1 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 500,
            width: 40,
            height: 40,
            collected: false,
        }));
    }

    resetCollectables() {
        this.collectables = this.generateCollectables();
        this.diamonds = this.generateDiamonds();
    }

    resetPowerUp() {
        this.powerUps = this.generatePowerJump();
        this.powerSpeed = this.generatePowerSpeed();
    }

    startCollectableTimer() {
        setInterval(() => {
            if (!this.gamePaused) {
                if (this.gameMode === "Gather") {
                    this.resetCollectables();
                }
                this.resetPowerUp();
            }
        }, 15000); // 15 seconds
    }

    addPlayer(playerId, name = "") {
        this.players[playerId] = {
            name,
            x: 0,
            y: 531, // Start on the ground
            velocityY: 0,
            pushVelocityX: 0,
            lastPushTime: 0,
            isJumping: false,
            points: 0,
            characterId: 1, // Default character ID
            playerImage: '/images/1.png', // Default image
            jumpStrength: this.jumpStrength, // Default jump strength
            powerUpDuration: 0, // Duration of the power-up effect
            hasPowerUp: false,
            hasPowerSpeed: false,
            speed: 10, // Default speed
            isReady: false,
            isLeader: false,
            isIT: false,
        };
        // Assign leader if there is no leader
        if (!this.leaderId) {
            this.leaderId = playerId;
            this.players[playerId].isLeader = true;
            this.players[playerId].isIT = true;
        }
    }

    initializePlayerPos(playerId, index) {
        let positions = []
        if (this.gameMode === "Gather") {
            positions = [
                { x: 0, y: 531 },
                { x: 1242, y: 531 },
                { x: 0, y: 15 },
                { x: 1242, y: 15 },
            ];
        } else if (this.gameMode === "Tag") {
            positions = [
                { x: 620, y: 250 },
                { x: 1242, y: 531 },
                { x: 0, y: 15 },
                { x: 1242, y: 15 },
            ];
        }

        if (this.players[playerId] && positions[index]) {
            this.players[playerId].x = positions[index].x;
            this.players[playerId].y = positions[index].y;
            this.players[playerId].isJumping = false;
        }
    }

    resetPlayerPoints(playerId) {
        this.players[playerId].points = 0;
    }

    resetPlayerPowerups(playerId) {
        this.players[playerId].powerUpDuration = 0;
        this.players[playerId].hasPowerSpeed = false;
        this.players[playerId].hasPowerUp = false;
        this.players[playerId].jumpStrength = 25;
        this.players[playerId].speed = 10;
    }

    updatePlayerCharacter(playerId, characterId) {
        if (this.players[playerId]) {
            this.players[playerId].characterId = characterId;
            this.players[playerId].playerImage = `/images/${characterId}.png`;
        }
    }

    updatePlayerName(playerId, name) {
        if (this.players[playerId]) {
            if (this.players[playerId].name !== name) {
                console.log(`Update ${this.players[playerId].name} to ${name}`);
                this.players[playerId].name = name;
            }
            this.players[playerId].points = 0;
            this.collectables = [];
        }
    }

    removePlayer(playerId) {
        delete this.players[playerId];

        if (playerId === this.leaderId || !this.leaderId) {
            this.assignNewLeader();
        }
    }

    assignNewLeader() {
        const playerIds = Object.keys(this.players);
        if (playerIds.length > 0) {
            this.leaderId = playerIds[0];
            this.players[this.leaderId].isLeader = true;
        } else {
            this.leaderId = null;
        }

    }

    getPlayerName(playerId) {
        return this.players[playerId] ? this.players[playerId].name : "";
    }

    getPlayerList() {
        return this.players;
    }

    updatePlayer(playerId, input) {
        if (this.gameOver) return;
        if (this.gamePaused) return;

        let player = this.players[playerId];
        if (!player) return;

        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.lastUpdateTime) / 1000; // Elapsed time in seconds
        this.lastUpdateTime = currentTime;

        // Decrease power-up duration if active
        if (player.powerUpDuration > 0) {
            player.powerUpDuration -= elapsedTime;
        } else {
            player.jumpStrength = this.jumpStrength; // Reset to default jump strength
            player.speed = 10; // Reset to default speed
        }

        // Store the old position for horizontal collision checking.
        const oldX = player.x;

        // Handle movement inputs.
        if (input.moveLeft) player.x -= player.speed;
        if (input.moveRight) player.x += player.speed;
        if (input.jump && !player.isJumping) {
            player.isJumping = true;
            // Send jump message to frontend
            const message = JSON.stringify({
                type: 'jump',
                playerId: playerId
            });
            this.wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(message);
                }
            });
            player.velocityY = -player.jumpStrength;
        }

        // Apply gravity
        player.velocityY += this.gravity;
        const newY = player.y + player.velocityY;
        let verticalResolved = false;

        // Process vertical collisions
        for (let platform of this.platforms) {
            const platformLeft = platform.left;
            const platformTop = platform.top;
            const platformRight = platform.left + platform.width;
            const platformBottom = platform.top + platform.height;

            // Check horizontal overlap before vertical resolution
            if (player.x + 35 > platformLeft && player.x < platformRight) {
                // Falling: land on platform if crossing its top boundary
                if (
                    player.velocityY > 0 &&
                    player.y + 35 <= platformTop &&
                    newY + 35 >= platformTop
                ) {
                    player.y = platformTop - 35; // Snap onto platform
                    player.velocityY = 0;
                    player.isJumping = false;
                    verticalResolved = true;
                    break; // No need to check other platforms
                }
                // Jumping: hit bottom of platform
                if (
                    player.velocityY < 0 &&
                    player.y > platformBottom &&
                    newY <= platformBottom
                ) {
                    player.y = platformBottom + 1; // Place player just below
                    player.velocityY = 0;
                    verticalResolved = true;
                    break;
                }
            }
        }

        // Update vertical position if no vertical collision was resolved
        if (!verticalResolved) {
            player.y = newY;
        }

        // Check for push input
        if (input.push) {
            // Add a cooldown to prevent spam
            const cooldownTime = 500;
            const now = Date.now();
            if (!player.lastPushTime || (now - player.lastPushTime >= cooldownTime)) {
                player.lastPushTime = now;
                const pushForce = 20;
                for (let otherId in this.players) {
                    // Ignore push on yourself
                    if (otherId === playerId) continue;
                    let otherPlayer = this.players[otherId];

                    // Apply push if within another player boundaries
                    if (
                        player.x < otherPlayer.x + 35 &&
                        player.x + 35 > otherPlayer.x &&
                        player.y < otherPlayer.y + 35 &&
                        player.y + 35 > otherPlayer.y
                    ) {
                        if (player.x < otherPlayer.x) {
                            otherPlayer.pushVelocityX += pushForce;
                        } else {
                            otherPlayer.pushVelocityX -= pushForce;
                        }
                        if (player.isIT) {
                            player.points += 10;
                            player.isIT = false;
                            otherPlayer.isIT = true;
                        }
                    }
                }
            }
        }

        if (player.pushVelocityX) {
            player.x += player.pushVelocityX;
            // Apply damping to smooth out the movement over time
            player.pushVelocityX *= 0.9;
            if (Math.abs(player.pushVelocityX) < 1) {
                player.pushVelocityX = 0;
            }
        }

        // Handle horizontal collisions
        // Only apply if the player is moving horizontally into a platform
        for (let platform of this.platforms) {
            const platformLeft = platform.left;
            const platformRight = platform.left + platform.width;
            const platformTop = platform.top;
            const platformBottom = platform.top + platform.height;

            // Check if player and platform vertically overlap
            if (player.y + 35 >= platformTop && player.y <= platformBottom) {
                // If moving right, check for collision with the platform's left side
                if (oldX + 35 <= platformLeft && player.x + 35 > platformLeft) {
                    player.x = platformLeft - 35;
                    player.pushVelocityX = 0;
                }
                // If moving left, check for collision with the platform's right side
                if (oldX >= platformRight && player.x < platformRight) {
                    player.x = platformRight;
                    player.pushVelocityX = 0;
                }
            }
        }

        // Check for collectable collisions
        this.collectables.forEach(collectable => {
            if (
                !collectable.collected &&
                player.x < collectable.x + collectable.width &&
                player.x + 35 > collectable.x &&
                player.y < collectable.y + collectable.height &&
                player.y + 35 > collectable.y
            ) {
                collectable.collected = true;
                const soundMessage = JSON.stringify({
                    type: 'collectableCollected',
                    playerId: playerId,
                });
                this.wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(soundMessage);
                    }
                });
                player.points += 1;
            }
        });

        // Check for diamond collisions
        this.diamonds.forEach(diamond => {
            if (
                !diamond.collected &&
                player.x < diamond.x + diamond.width &&
                player.x + 35 > diamond.x &&
                player.y < diamond.y + diamond.height &&
                player.y + 35 > diamond.y
            ) {
                diamond.collected = true;
                const soundMessage = JSON.stringify({
                    type: 'diamondCollected',
                    playerId: playerId,
                });
                this.wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(soundMessage);
                    }
                });
                player.points += 5;
            }
        });

        // Check for powerup collisions
        this.powerUps.forEach(powerUp => {
            if (
                !powerUp.collected &&
                player.x < powerUp.x + powerUp.width &&
                player.x + 35 > powerUp.x &&
                player.y < powerUp.y + powerUp.height &&
                player.y + 35 > powerUp.y
            ) {
                powerUp.collected = true;
                const soundMessage = JSON.stringify({
                    type: 'powerupCollected',
                    playerId: playerId,
                });
                this.wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(soundMessage);
                    }
                });
                player.jumpStrength = 40; // Increase jump strength
                player.powerUpDuration = 15; // Set power-up duration in seconds
                player.hasPowerUp = true;
            }
        });

        // Check for powerspeed collisions
        this.powerSpeed.forEach(powerSpeed => {
            if (
                !powerSpeed.collected &&
                player.x < powerSpeed.x + powerSpeed.width &&
                player.x + 35 > powerSpeed.x &&
                player.y < powerSpeed.y + powerSpeed.height &&
                player.y + 35 > powerSpeed.y
            ) {
                powerSpeed.collected = true;
                const soundMessage = JSON.stringify({
                    type: 'powerupCollected',
                    playerId: playerId,
                });
                this.wss.clients.forEach(client => {
                    if (client.readyState === client.OPEN) {
                        client.send(soundMessage);
                    }
                });
                player.speed = 20; // Increase speed
                player.powerUpDuration = 15; // Set power-up duration in seconds
                player.hasPowerSpeed = true;
            }
        });


        // Stay within game-area bounds.
        if (player.y >= 531) {
            player.y = 531;
            player.velocityY = 0;
            player.isJumping = false;
        }
        if (player.y < 0) {
            player.y = 0;
            player.velocityY = 0;
        }
        if (player.x < 0) {
            player.x = 0;
            player.pushVelocityX = 0;
        }
        if (player.x > 1242) {
            player.x = 1242;
            player.pushVelocityX = 0;
        }
    }

    pauseGame() {
        this.gamePaused = true;
    }

    unpauseGame() {
        this.gamePaused = false;
    }

    startGame() {
        this.gameOver = false;
        this.gameStarted = true;
    }

    endGame() {
        this.gameOver = true;
        this.gameStarted = false;
        this.leaderId = null;
        const playersArray = Object.values(this.players);
        const maxPoints = Math.max(...playersArray.map(player => player.points));
        const topPlayers = playersArray.filter(player => player.points === maxPoints);

        if (topPlayers.length === 0) {
            console.log("Game over! No players left.");
            return null;
        }

        if (topPlayers.length > 1) {
            return topPlayers;
        } else {
            return topPlayers[0];
        }
    }

    getGameState() {
        return {
            players: this.players,
            platforms: this.platforms,
            collectables: this.collectables,
            gameOver: this.gameOver,
            platformImage: this.platformImage,
            collectablesImage: this.collectablesImage,
            powerUps: this.powerUps,
            powerUpImage: this.powerUpImage,
            powerSpeed: this.powerSpeed,
            powerSpeedImage: this.powerSpeedImage,
            diamonds: this.diamonds,
            diamondsImage: this.diamondsImage,
            gameStarted: this.gameStarted,
            gameMode: this.gameMode,
        };
    }
}