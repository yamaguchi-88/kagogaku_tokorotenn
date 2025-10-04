const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const result = document.getElementById("result");

let bgX = 0;
const playerX = 100;
let playerY = window.innerHeight / 2 - 50;
let enemyY = 100;
let enemySpeed = 2;
let bullets = [];
let isHit = false;

// 敵の上下移動
function moveEnemy() {
  enemyY += enemySpeed;
  if (enemyY <= 0 || enemyY >= window.innerHeight - 100) {
    enemySpeed *= -1;
  }
  enemy.style.top = enemyY + "px";
}

// 弾発射
function shootBullet() {
  const bullet = document.createElement("img");
  bullet.src = "../image/しばる.png";
  bullet.className = "bullet";
  gameArea.appendChild(bullet);
  bullets.push({ element: bullet, x: enemy.offsetLeft, y: enemyY, speed: -5 });
}

// 弾の更新
function updateBullets() {
  bullets.forEach((b, index) => {
    b.x += b.speed;
    b.element.style.left = (b.x + bgX) + "px";
    b.element.style.top = b.y + "px";

    if (b.x + bgX < -50) {
      b.element.remove();
      bullets.splice(index, 1);
    }

    if (!isHit) {
      const rectBullet = b.element.getBoundingClientRect();
      const rectPlayer = player.getBoundingClientRect();
      if (
        rectBullet.left < rectPlayer.right &&
        rectBullet.right > rectPlayer.left &&
        rectBullet.top < rectPlayer.bottom &&
        rectBullet.bottom > rectPlayer.top
      ) {
        handleHit();
        b.element.remove();
        bullets.splice(index, 1);
      }
    }
  });
}

// プレイヤーが弾に当たったとき
function handleHit() {
  isHit = true;
  result.style.left = player.offsetLeft + "px";
  result.style.top = player.offsetTop + "px";
  result.style.width = player.offsetWidth + "px";
  result.style.height = player.offsetHeight + "px";

  result.classList.add("shake");
  result.style.display = "block";
  player.style.display = "none";

  setTimeout(() => {
    result.style.display = "none";
    result.classList.remove("shake");
    player.style.display = "block";
    isHit = false;
  }, 1000);
}

// キーボード操作
document.addEventListener("keydown", (e) => {
  if (e.key === "Shift") shootBullet();
  if (isHit) return;

  if (e.key === "ArrowUp") playerY -= 10;
  if (e.key === "ArrowDown") playerY += 10;
  if (e.key === "ArrowLeft") bgX += 10;
  if (e.key === "ArrowRight") bgX -= 10;

  playerY = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, playerY));

  player.style.top = playerY + "px";
  gameArea.style.backgroundPosition = bgX + "px 0px";
});

// メインループ
setInterval(() => {
  moveEnemy();
  updateBullets();
}, 20);


// タイマー
let timeLeft = 10;
const timerElement = document.createElement("div");
timerElement.style.position = "absolute";
timerElement.style.top = "20px";
timerElement.style.left = "20px";
timerElement.style.color = "white";
timerElement.style.fontSize = "32px";
timerElement.style.fontFamily = "monospace";
timerElement.style.zIndex = "9999";
timerElement.textContent = `残り時間: ${timeLeft}`;
gameArea.appendChild(timerElement);

// ゴール画像
const goal = document.createElement("img");
goal.src = "../image/ゴール.png"; // ← 画像名を合わせてください
goal.className = "sprite";
goal.style.display = "none";
goal.style.left = "50%";
goal.style.top = "50%";
goal.style.transform = "translate(-50%, -50%)";
goal.style.zIndex = "9999";
gameArea.appendChild(goal);

// タイマー処理
const timerInterval = setInterval(() => {
  if (isHit) return; // 被弾中はストップ
  timeLeft--;
  timerElement.textContent = `残り時間: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    goal.style.display = "block";
  }
}, 1000);
