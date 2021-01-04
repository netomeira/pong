const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

const fps = 60;
const compLevel = 0.1;
const speedIncrease = 0.5;
const targetScore = 2;
let active = true;

const user = {
    x: 0,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}

const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 50,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}

const net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    radius: 10,
    color: "white"
}

setInterval(game, 1000/fps);

function game(){
    if (active){
        update();
        render();
    }
    
    if (user.score == targetScore){
        drawText("You Win!", canvas.width/4, canvas.height/2, user.color);
        active = false;
    }
    if (com.score == targetScore){
        drawText("You Lose!", canvas.width/4, canvas.height/2, user.color);
        active = false;
    }
}

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.velocityX = - ball.velocityX;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;

    if (collision(ball, player)){
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        ball.speed += speedIncrease;
    }

    if (ball.x - ball.radius < 0){
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
    moveCom();
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function render(){
    drawRect(0, 0, 600, 400, "black");
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawNet();
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawText(user.score, canvas.width/4, canvas.height/5, user.color);
    drawText(com.score, canvas.width - canvas.width/4, canvas.height/5, com.color);
}

function collision(b, p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color){
    context.fillStyle = color;
    context.font = "60px fantasy";
    context.fillText(text, x, y);
}

function drawNet(){
    for (let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    let posY = evt.clientY - rect.top - user.height/2;

    if (posY > 0 && posY < canvas.height - user.height){
        user.y = posY;
    }
}

function moveCom(){
    com.y += (ball.y - (com.y + com.height/2)) * compLevel;
}