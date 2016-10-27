var ballPosX = 10;
var ballPosY = 300;
var ballSpeedX = 8;
var ballSpeedY = 8;
var paddleWidth = 10;
var paddleHeight = 100;
var rightPlayerPaddleY = 250;
var leftPlayerPaddleY = 250;
var leftScore = 0;
var rightScore = 0;
var showingWinScreen = false;
var winningScore = 1;

function calcMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick() {
    if (showingWinScreen) {
        leftScore = 0;
        rightScore = 0;
        showingWinScreen = false;
    }
}


window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    var fps = 60;
    setInterval(function () {
        moveElements();
        drawElements();
    }, 1000 / fps);

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calcMousePos(evt);
        leftPlayerPaddleY = mousePos.y - paddleHeight / 2;
    })

    canvas.addEventListener('mousedown', handleMouseClick);
}

function makeRect(xStart, yStart, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(xStart, yStart, width, height);
}

function makeBall(xStart, yStart, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(xStart, yStart, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function computerMovement() {
    var rightPaddleCenter = rightPlayerPaddleY + (paddleHeight / 2);
    if (rightPaddleCenter <= ballPosY - 25) {
        rightPlayerPaddleY += 10;
    } else if (rightPaddleCenter >= ballPosY + 25) {
        rightPlayerPaddleY -= 10
    }
}

function ballReset() {
    if(leftScore >= winningScore || rightScore >= winningScore ){
        showingWinScreen = true;
    }
    ballSpeedX *= -1;
    ballSpeedY = 2;
    ballPosX = canvas.width/2;
    ballPosY = canvas.height/2;
}

function moveElements() {
    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;
    computerMovement();
    if (ballPosX >= (canvas.width - paddleWidth)) {
        if (ballPosY >= rightPlayerPaddleY  && ballPosY <= (rightPlayerPaddleY + paddleHeight)) {
            ballSpeedX *= -1;
            var deltaY = ballPosY-(rightPlayerPaddleY+paddleHeight/2);
            ballSpeedY = deltaY*.35;
        } else {
            leftScore ++;
            ballReset();
        }
    } 

     if (ballPosX <= paddleWidth) {
        if (ballPosY >= leftPlayerPaddleY && ballPosY <= leftPlayerPaddleY + paddleHeight){
        ballSpeedX *= -1;
        var deltaY = ballPosY-(leftPlayerPaddleY+paddleHeight/2);
        ballSpeedY = deltaY*.35;
        } else {
            rightScore ++;
            ballReset();
        }
    }

    if (ballPosY <= 0) {
        ballSpeedY *= -1
    } else if (ballPosY >= canvas.height) {
        ballSpeedY *= -1
    }


}

function net(){
    for(var i = 0; i < canvas.height; i += 50) {
        makeRect(canvas.width/2, i, 2, 25, "white");
    }
}


function drawElements() {
    // background
    makeRect(0, 0, canvas.width, canvas.height, "black");

    if(showingWinScreen) {
        canvasContext.fillStyle = "white";
        if(leftScore >= winningScore) {
            canvasContext.fillText("You Won!!", canvas.width/3, 300)
        } else if (rightScore >= winningScore) {
            canvasContext.fillText("YOU LOSE!!", canvas.width/3, 300);
        }
        canvasContext.fillText("Click to continue", canvas.width/3 -50, 450);
        return;
    }
    // net
    net();
    // left player paddle
    makeRect(0, leftPlayerPaddleY, paddleWidth, paddleHeight, "white");
    // right player paddle
    makeRect(canvas.width, rightPlayerPaddleY, -paddleWidth, paddleHeight, "white");
    // ball
    makeBall(ballPosX, ballPosY, 10, "red");

    canvasContext.fillStyle = "white";
    canvasContext.font = "50px Helvetica";
    // left score
    canvasContext.fillText(leftScore, 250, 100);
    // right score
    canvasContext.fillText(rightScore, canvas.width-250, 100)
}