function triggerHit(damage, knockbackFactor, color) {
    enemy.percentage += damage;
    let dir = player.x < enemy.x ? 1 : -1;
    
    // VEILIGHEID: Zorg dat we altijd met getallen werken
    let speed = (4 + (enemy.percentage * knockbackFactor)) * 0.65;
    
    // FIX: Beperk de snelheid zodat hij niet 'NaN' wordt of buiten beeld vliegt
    enemy.speedX = dir * Math.max(Math.min(speed, 20), 0); 
    enemy.speedY = Math.min(-3.5 - (enemy.percentage * 0.02), -2);
    
    enemy.isFlying = true;
    enemy.isGrounded = false;

    hitEffects.push({ x: enemy.x + enemy.w/2, y: enemy.y + enemy.h/2, radius: 45, timer: 10, color: color });
    spawnParticle(enemy.x + enemy.w/2, enemy.y + enemy.h/2, color, 14, 5);
}

function update() {
    if (!gameActive) return;

    // CONTROLE: Als bot buiten beeld is of NaN, reset hem
    if (isNaN(enemy.x) || enemy.x < -100 || enemy.x > 1000) {
        enemy.x = 450;
        enemy.y = 200;
        enemy.speedX = 0;
        enemy.isFlying = false;
    }

    if (player.isAttacking > 0) player.isAttacking--;

    // --- SPELER ---
    let oldPlayerY = player.y;
    if (player.hitstunt > 0) player.hitstunt--;

    if (player.hitstunt <= 0) {
        if (keys["ArrowLeft"] || keys["KeyA"]) { player.x -= player.speed; player.facing = -1; }
        if (keys["ArrowRight"] || keys["KeyD"]) { player.x += player.speed; player.facing = 1; }
    }
    player.speedY += gravity; 
    player.y += player.speedY;
    player.isGrounded = false;
    checkPlatformCollision(player, oldPlayerY);

    // --- BOT ---
    let oldEnemyY = enemy.y;
    if (!enemy.isFlying) {
        if (enemy.x < player.x) enemy.x += enemy.speed;
        else if (enemy.x > player.x) enemy.x -= enemy.speed;
        
        // Bot AI: Springen
        if (player.y < enemy.y - 40 && enemy.isGrounded && Math.random() < 0.07) {
            enemy.speedY = -12; enemy.isGrounded = false;
        }

        // Bot aanval
        if (Math.abs(enemy.x - player.x) < 35 && Math.abs(enemy.y - player.y) < 35) {
            if (enemy.attackCooldown <= 0) {
                player.percentage += 20;
                player.hitstunt = 18;
                let dir = enemy.x < player.x ? 1 : -1;
                player.speedY = -7.5; 
                player.x += dir * Math.min((10 + player.percentage * 0.45), 40);
                enemy.attackCooldown = 15;
            }
        }
    } else {
        enemy.x += enemy.speedX;
        enemy.speedX *= 0.95; 
        if (Math.abs(enemy.speedX) < 0.5) enemy.isFlying = false;
    }
    
    if (enemy.attackCooldown > 0) enemy.attackCooldown--;
    enemy.speedY += gravity; 
    enemy.y += enemy.speedY;
    checkPlatformCollision(enemy, oldEnemyY);

    draw();
    requestAnimationFrame(update);
}
