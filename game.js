const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameActive = false;
let currentType = "Gunner";

const player = { x: 250, y: 350, w: 30, h: 40, speed: 10, percentage: 0 };
const enemy = { x: 600, y: 350, w: 30, h: 40, color: "#FF3333", percentage: 0, isFlying: false, speedX: 0, speedY: 0 };

// --- BESTURING (Hier beweeg je mee) ---
window.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key === "ArrowLeft") player.x -= player.speed;
    if (e.key === "ArrowRight") player.x += player.speed;
    if (e.key === " ") triggerHit(10, 0.1, "#FFF"); // Spatiebalk om te slaan
});

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
    let force = (4 + (enemy.percentage * knockbackFactor)) * 0.65;
    enemy.speedX = dir * Math.min(force, 15);
    enemy.speedY = -8;
    enemy.isFlying = true;
}

function update() {
    if (!gameActive) return;
    if (enemy.isFlying) {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        enemy.speedY += 0.5; // Zwaartekracht
        enemy.speedX *= 0.95;
        if (enemy.y > 350) { enemy.y = 350; enemy.isFlying = false; }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Speler tekenen
    ctx.fillStyle = "#00f0ff";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    // Bot tekenen
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
}

function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
