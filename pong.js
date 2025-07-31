const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 12;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;

// Paddle and ball objects
let player = {
    x: playerX,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#61dafb"
};

let ai = {
    x: aiX,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#ff4081"
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#fff"
};

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#444';
    for (let i = 0; i < canvas.height; i += 25) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 15);
        ctx.stroke();
    }
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#282c34");

    // Net
    drawNet();

    // Paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Paddle collision detection
function collision(b, p) {
    return b.x - b.radius < p.x + p.width &&
           b.x + b.radius > p.x &&
           b.y + b.radius > p.y &&
           b.y - b.radius < p.y + p.height;
}

// Move AI paddle
function moveAI() {
    let center = ai.y + ai.height / 2;
    if (ball.y < center - 15) {
        ai.y -= 5;
    } else if (ball.y > center + 15) {
        ai.y += 5;
    }
    // Clamp AI paddle within canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Update positions and handle collisions
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Player paddle collision
    if (collision(ball, player)) {
        ball.x = player.x + player.width + ball.radius; // Avoid stuck ball
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angle = collidePoint * Math.PI / 4; // Max bounce angle = 45deg
        let direction = 1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.3;
    }

    // AI paddle collision
    if (collision(ball, ai)) {
        ball.x = ai.x - ball.radius; // Avoid stuck ball
        let collidePoint = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = -1;
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        ball.speed += 0.3;
    }

    // Left or right wall (reset ball)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }

    moveAI();
}

// Reset ball to center with random direction
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    let angle = Math.random() * Math.PI / 2 - Math.PI / 4;
    let dir = Math.random() > 0.5 ? 1 : -1;
    ball.velocityX = dir * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle within canvas
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Main game loop
function game() {
    update();
    draw();
    requestAnimationFrame(game);
}

// Start game
game();
