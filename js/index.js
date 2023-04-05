let score = 0;
let gameRunning = false;

const config = {
	step: 0,
	maxStep: 6,
	cellSize: 20,
    speed: 120   /*   опционально   */
}

const snake = {
	x: 180,
	y: 180,
	dx: config.cellSize,
	dy: 0,
	tails: [/*{x: this.x + this.dx, y: this.y + this.dy}*/],
	maxTails: 18
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
    drawFood();
    gameLoop();
}

function gameLoop() {
    if (gameRunning === true) {
        setTimeout(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawFood();
            drawSnake();
        }, config.speed);
    } else {
        displayGameOver();
    }
}

function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;

	collisionBorder();

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

		if (part.x === food.x && part.y === food.y) {
			snake.maxTails++;
			incScore();
			randomPositionFood();
		}

		for (let i = index + 1; i < snake.tails.length; i++) {

			if (part.x == snake.tails[i].x && part.y == snake.tails[i].y) {
                /*-------- ВОТ ЗДЕСЬ-------*/
				gameRunning = false;
                displayGameOver();
                // restartGame();
                console.log(gameRunning);
			}

		}

	} );
}

function drawFood() {
    context.drawImage(foodImage, food.x, food.y);
}

function collisionBorder() {
	if (snake.x < 0) {
		snake.x = canvas.width - config.cellSize;
	} else if (snake.x >= canvas.width) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.cellSize;
	} else if (snake.y >= canvas.height) {
		snake.y = 0;
	}
}

function restartGame() {
	score = 0;
	snake.x = 180;
	snake.y = 180;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.cellSize;
	snake.dy = 0;

	drawScore();
	randomPositionFood();
}

function getRandomInt(min, max) {
	return Math.round((Math.random() * (max - min) + min) / config.cellSize) * config.cellSize;

}

function randomPositionFood() {
	food.x = getRandomInt(0, canvas.width - config.cellSize);
	food.y = getRandomInt(0, canvas.height - config.cellSize);
}

function incScore() {
	score++;
	drawScore();
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

    const goUp = (snake.dy == -config.cellSize);
    const goDown = (snake.dy == config.cellSize);
    const goLeft = (snake.dx == -config.cellSize);
    const goRight = (snake.dx == config.cellSize);

    switch (true){
        case (keyPressed == LEFT && !goRight):
            snake.dx = -config.cellSize;
            snake.dy = 0;
            break;
        case (keyPressed == RIGHT && !goLeft):
            snake.dx = config.cellSize;
            snake.dy = 0;
            break;
        case (keyPressed == UP && !goDown):
            snake.dx = 0;
            snake.dy = -config.cellSize;
            break;
        case (keyPressed == DOWN && !goUp):
            snake.dx = 0;
            snake.dy = config.cellSize;
            break;
    }
}

function displayGameOver(){
    ctx.font = '50px Comfortaa, cursive';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textSize = '500';
    ctx.fillText('ИГРА ОКОНЧЕНА!', canvas.width / 2, canvas.height / 2);
    running = false;
};