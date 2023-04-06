let score = 0;
let gameRunning = false;


const config = {
	step: 0,
	maxStep: 6,
	cellSize: 20,
    speed: 200   /*   опционально   */
}

const snake = {
	x: 180,
	y: 180,
	dx: config.cellSize,
	dy: 0,
	tails: [],
	maxTails: 2
}

let food = {
	x: 260,
	y: 260
} 

let canvas = document.querySelector("#gameBoard");
let context = canvas.getContext("2d");
let currentScore = document.querySelector("#currentScore");
let restartBtn = document.querySelector('#restartBtn');

let snakeHeadImage = new Image();
snakeHeadImage.src = '../img/SnakeHead.svg';
let snakeTailImage = new Image();
snakeTailImage.src = '../img/SnakeTail.svg';
let foodImage = new Image();
foodImage.src = '../img/Food.svg';

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener('click', restartGame);

gameStart();

function gameStart() {
    gameRunning = true;
    drawScore();
    checkBestScore();
    drawFood();
    gameLoop();
}

function gameLoop() {
    if (gameRunning) {
        setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawFood();
            drawSnake();
            checkGameOver();
            gameLoop();
        }, config.speed);
    } else {
        displayGameOver();
    }
}

function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;

	snake.tails.unshift( { x: snake.x, y: snake.y } );

	if ( snake.tails.length > snake.maxTails ) {
		snake.tails.pop();
	}

	snake.tails.forEach( function(part, index){
        if (index == 0) {
            context.drawImage(snakeHeadImage, part.x, part.y);
        } else {
            context.drawImage(snakeTailImage, part.x, part.y);
        }
        /*   змейка кушац банан   */
		if (part.x === food.x && part.y === food.y) {
			snake.maxTails++;
			incScore();
			randomPositionFood();
            config.speed -= 3;
		}
	} );
}

function drawFood() {
    context.drawImage(foodImage, food.x, food.y);
}

function getRandomInt(min, max) {
	return Math.round((Math.random() * (max - min) + min) / config.cellSize) * config.cellSize;

}

function randomPositionFood() {
    food.x = getRandomInt(0, canvas.width - config.cellSize);
	food.y = getRandomInt(0, canvas.height - config.cellSize);

    for (let i = 0; i < snake.tails.length; i++) {
        if (snake.tails[i].x == food.x && snake.tails[i].y == food.y) {
            randomPositionFood();
        }
    }
}

function incScore() {
	score++;
	drawScore();
}

class Food {
    constructor  
}

function drawScore() {
	currentScore.innerHTML = score;
}

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 65;
    const UP = 87;
    const RIGHT = 68;
    const DOWN = 83;

    const goLeft = (snake.dx == -config.cellSize);
    const goUp = (snake.dy == -config.cellSize);
    const goRight = (snake.dx == config.cellSize);
    const goDown = (snake.dy == config.cellSize);

    switch (true){
        case (keyPressed == LEFT && !goRight):
            snake.dx = -config.cellSize;
            snake.dy = 0;
            break;
        case (keyPressed == UP && !goDown):
            snake.dx = 0;
            snake.dy = -config.cellSize;
            break;
        case (keyPressed == RIGHT && !goLeft):
            snake.dx = config.cellSize;
            snake.dy = 0;
            break;
        case (keyPressed == DOWN && !goUp):
            snake.dx = 0;
            snake.dy = config.cellSize;
            break;
    }
}

function checkGameOver(){
    switch(true){
        case(snake.tails[0].x < 0):
            gameRunning = false;
            break;
        case(snake.tails[0].x >= canvas.width):
            gameRunning = false;
            break;
        case(snake.tails[0].y < 0):
            gameRunning = false;
            break;
        case(snake.tails[0].y >= canvas.height):
            gameRunning = false;
            break;
    }
    for(let i = 1; i < snake.tails.length; i += 1) {
        if (snake.tails[i].x == snake.tails[0].x && snake.tails[i].y == snake.tails[0].y){
            gameRunning = false;
        }
    }
};

function displayGameOver(){
    context.font = '40px Verdana, cursive';
    context.fillStyle = 'azure';
    context.textAlign = 'center';
    context.textSize = '500';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
    gameRunning = false;
    checkBestScore();
};

function restartGame() {
	score = 0;
	snake.x = 180;
	snake.y = 180;
	snake.tails = [];
	snake.maxTails = 2;
	snake.dx = config.cellSize;
	snake.dy = 0;
    config.speed = 200;

	randomPositionFood();
    gameStart();
}

function checkBestScore() {
    let scoreFromStorage = localStorage.getItem('bestscore');

    if (localStorage.getItem('bestscore')) {
        bestScore.innerHTML = scoreFromStorage;
    } else {
        bestScore.innerHTML = 0;
    }

    if (score > localStorage.getItem('bestscore')) {
        bestScore.innerHTML = score;
        localStorage.setItem('bestscore', score);
    }
}