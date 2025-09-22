const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paletki
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 5;

// Piłka
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 1.5;
let dy = 1.5;
let ballRadius = 10;

// Punkty bieżące
let leftScore = 0;
let rightScore = 0;

// Najwyższe punkty w jednej rundzie
let leftHighScore = 0;
let rightHighScore = 0;

// Przy starcie gry odczytujemy zapisane wartości
leftHighScore = parseInt(localStorage.getItem('leftHighScore')) || 0;
rightHighScore = parseInt(localStorage.getItem('rightHighScore')) || 0;

// Flagi do mrugania przy nowym high score
let leftFlash = false;
let rightFlash = false;

// Sterowanie
const keys = {};
document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function drawPaddle(xPos, yPos) {
  ctx.fillStyle = "black";
  ctx.fillRect(xPos, yPos, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";

  // Lewa paletka
  if (leftFlash) ctx.fillStyle = "green";
  else ctx.fillStyle = "black";
  ctx.fillText(`Lewo: ${leftScore}  (Naj: ${leftHighScore})`, 20, 30);

  // Prawa paletka
  if (rightFlash) ctx.fillStyle = "green";
  else ctx.fillStyle = "black";
  ctx.fillText(`Prawo: ${rightScore}  (Naj: ${rightHighScore})`, canvas.width - 180, 30);
}

function movePaddles() {
  if (keys["w"] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (keys["s"] && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
  if (keys["ArrowUp"] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
  if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
}

function moveBall() {
  x += dx;
  y += dy;

  // Odbicie od góry/dolu
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }

  // Odbicie od paletek + punkty
  if (x - ballRadius < paddleWidth && y > leftPaddleY && y < leftPaddleY + paddleHeight) {
    dx = -dx;
    leftScore++;
    if (leftScore > leftHighScore) {
      leftHighScore = leftScore;
      flashLeftScore(); // mruganie przy nowym high score
    }
  }
  if (x + ballRadius > canvas.width - paddleWidth && y > rightPaddleY && y < rightPaddleY + paddleHeight) {
    dx = -dx;
    rightScore++;
    if (rightScore > rightHighScore) {
      rightHighScore = rightScore;
      flashRightScore(); // mruganie przy nowym high score
    }
  }

  // Punkt dla przeciwnika (reset piłki + reset bieżących punktów)
  if (x + ballRadius > canvas.width || x - ballRadius < 0) {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 1.5 * (Math.random() > 0.5 ? 1 : -1);
    dy = 1.5 * (Math.random() > 0.5 ? 1 : -1);

    leftScore = 0;
    rightScore = 0;
  }
}

// Funkcje mrugania przy nowym high score
function flashLeftScore() {
  leftFlash = true;
  setTimeout(() => { leftFlash = false; }, 300); // mruganie 0.3s
}

function flashRightScore() {
  rightFlash = true;
  setTimeout(() => { rightFlash = false; }, 300); // mruganie 0.3s
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();
  drawScore();
  movePaddles();
  moveBall();
}

setInterval(draw, 10);
