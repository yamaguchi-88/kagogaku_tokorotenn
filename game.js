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
    // 背景スクロールに合わせて弾も移動
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

// プレイヤーが弾に当たったときの処理
function handleHit() {
  isHit = true;
  result.style.left = player.offsetLeft + "px";
  result.style.top = player.offsetTop + "px";
  result.style.width = player.offsetWidth + "px";
  result.style.height = player.offsetHeight + "px";

  result.classList.add("shake");
  result.style.display = "block";
  player.style.display = "none";

  // 1秒後に元に戻す
  setTimeout(() => {
    result.style.display = "none";
    result.classList.remove("shake");
    player.style.display = "block";
    isHit = false;
  }, 1000);
}

// キーボード入力
document.addEventListener("keydown", (e) => {
  // 弾発射は常に可能
  if (e.key === "Shift") shootBullet();

  // プレイヤー操作禁止中は移動・背景スクロールを無効
  if (isHit) return;

  if (e.key === "ArrowUp") playerY -= 10;
  if (e.key === "ArrowDown") playerY += 10;
  if (e.key === "ArrowLeft") bgX += 10;
  if (e.key === "ArrowRight") bgX -= 10;

  // 上下移動制限
  playerY = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, playerY));

  player.style.top = playerY + "px";
  gameArea.style.backgroundPosition = bgX + "px 0px";
});

// マウスの動きに合わせてプレイヤーを移動
document.addEventListener("mousemove", (e) => {
  if (isHit) return; // 被弾中は操作不可

  // プレイヤーの位置をカーソルに合わせる
  playerY = e.clientY - player.offsetHeight / 2;
  
  // 画面内に制限
  playerY = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, playerY));
  
  player.style.top = playerY + "px";
});


// メインループ
setInterval(() => {
  moveEnemy();
  updateBullets();
}, 20);
