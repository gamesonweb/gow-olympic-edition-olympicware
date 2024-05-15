 // Récupérer l'ancre URL
 const hash = window.location.hash;

var canvas = document.getElementById("tennis");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 200;
var paddleWidth = 100;
var paddleX = canvas.width / 2 - 50;
var rightPressed = false;
var leftPressed = false;
var tableImage = new Image();
var image2 = new Image();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    image2.src = "/Jeux/asset/pingpong2.svg";
    ctx.drawImage(image2,canvas.width / 2 - 50, 30, 100, 200);
    
    tableImage.src = "/Jeux/asset/pingpong.svg";
    ctx.drawImage(tableImage,paddleX,  canvas.height / 2 + 100, paddleWidth, paddleHeight);
    ctx.closePath();
}

function drawTable() {
    // Draw the table
    ctx.fillStyle = "brown";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the net
    ctx.fillStyle = "white";
    ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4);
}

function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    drawBall();
    drawPaddle();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            clearInterval(game);
            alert("GAME OVER");
            document.location.reload();
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 3;
    }
    else if(leftPressed && paddleX > 0) {
        tableImage.src = "/Jeux/asset/pingpong2.svg";
        ctx.drawImage(tableImage,paddleX,  canvas.height / 2 + 100, paddleWidth, paddleHeight);
        paddleX -= 3;
    }
    
    x += dx;
    y += dy;
}

 // Vérifier si l'ancre URL contient le mot 'tennis'
 if (hash.includes('tennis')) {
    // Afficher l'ancre URL dans la console
    console.log(hash);

    // Montrer le canvas
    canvas.style.display = "block";
    var game = setInterval(draw, 10);
}