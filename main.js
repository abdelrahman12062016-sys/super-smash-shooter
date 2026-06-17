// game.js - De stabiele versie

function update() {
    if (!gameActive) return;

    // --- VEILIGHEIDS-CHECK ---
    // Dit voorkomt dat de bot 'verdwijnt' en de game stopt
    if (isNaN(enemy.x) || enemy.x > 2000 || enemy.x < -2000) {
        enemy.x = 450; enemy.y = 200; enemy.speedX = 0; enemy.speedY = 0;
    }

    // --- SPELER LOGICA ---
    player.speedY += gravity;
    player.y += player.speedY;
    checkPlatformCollision(player, player.y - player.speedY);

    // --- BOT LOGICA ---
    enemy.speedY += gravity;
    enemy.y += enemy.speedY;
    
    // Voorkom 'oneindige' snelheid bij bot
    enemy.speedX = Math.max(Math.min(enemy.speedX, 20), -20);
    enemy.x += enemy.speedX;
    enemy.speedX *= 0.95; // Natuurlijke wrijving

    checkPlatformCollision(enemy, enemy.y - enemy.speedY);

    // --- RENDERING ---
    draw();
    requestAnimationFrame(update);
}
