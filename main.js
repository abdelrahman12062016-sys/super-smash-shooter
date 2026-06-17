const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameActive = false;
let currentType = "Gunner";

const charTypes = {
    Gunner: { damage: 8, knockback: 0.08, color: "#00FF00" },
    Swordfighter: { damage: 14, knockback: 0.12, color: "#00FFFF" },
    Brawler: { damage: 22, knockback: 0.18, color: "#FFA500" }
};

const player = { x: 250, y: 200, w: 30, h: 40, percentage: 0, score: 0 };
const enemy = { x: 580, y: 200, w: 30, h: 40, color: "#FF3333", percentage: 0, isFlying: false, speedX: 0, speedY: 0 };

function selectCharacter(type) {
    currentType = type;
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameUi").style.display = "block";
    gameActive = true;
    gameLoop();
}

function triggerHit(damage, knockbackFactor, color) {
    enemy.percentage += damage;
    let dir = player.x < enemy.x ? 1 : -1;
    
    // CRASH-BEVEILIGING: De bot blijft binnen de 15px per frame
    let force = (4 + (enemy.percentage * knockbackFactor)) * 0.65;
    enemy.speedX = dir * Math.min(force, 15);
    enemy.speedY = -5;
    enemy.isFlying = true;
}

function update() {
    if (!gameActive) return;
    
    if (enemy.isFlying) {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        enemy.speedX *= 0.95; 
        if (Math.abs(enemy.speedX) < 0.5) enemy.isFlying = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = charTypes[currentType].color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
}

function gameLoop() {
    update();
    draw();
    if (gameActive) requestAnimationFrame(gameLoop);
}
