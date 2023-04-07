class Config {
    constructor() {
        this.cellSize = 20;
        this.speed = 200;
    }
}

class Canvas {
    constructor() {
        this.element = document.querySelector("#gameBoard");
        this.context = this.element.getContext('2d');

        this.element.width = 400;
        this.element.height = 400;
    }
}

class Game {
    constructor() {
        this.gameRunning = false;
        this.canvas = new Canvas();
        this.snake = new Snake();
        this.food = new Food(this.canvas);
        this.score = new Score(0);
        this.restartBtn = document.querySelector('#restartBtn');
        this.gameStart();
        this.restartGame();
    }   

    gameStart() {
        this.gameRunning = true;
        this.score.drawScore();
        this.food.drawFood(this.canvas.context);
        this.gameLoop();
    }

    gameLoop() {
        if (this.gameRunning) {
            setTimeout(() => {
                this.canvas.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);
                this.food.drawFood(this.canvas.context);
                this.snake.drawSnake(this.canvas.context, this.food, this.score);
                this.checkGameOver();
                this.gameLoop();
            }, this.snake.config.speed);
        } else {
            this.displayGameOver();
        }
    }

    checkGameOver(){
        switch(true){
            case(this.snake.tails[0].x < 0):
                this.gameRunning = false;
                break;
            case(this.snake.tails[0].x >= this.canvas.element.width):
                this.gameRunning = false;
                break;
            case(this.snake.tails[0].y < 0):
                this.gameRunning = false;
                break;
            case(this.snake.tails[0].y >= this.canvas.element.height):
                this.gameRunning = false;
                break;
        }
        for(let i = 1; i < this.snake.tails.length; i += 1) {
            if (this.snake.tails[i].x == this.snake.tails[0].x && this.snake.tails[i].y == this.snake.tails[0].y){
                this.gameRunning = false;
            }
        }
    }

    displayGameOver(){
        this.canvas.context.font = '40px Verdana, cursive';
        this.canvas.context.textAlign = 'center';
        this.canvas.context.textSize = '500';
        this.canvas.context.fillStyle = 'azure';
        this.canvas.context.fillText('GAME OVER!', this.canvas.element.width / 2, this.canvas.element.height / 2);
        this.score.checkBestScore();

        if (!this.gameRunning) {
            this.restartBtn.classList.add('showRestartBtn');
        }
    }

    restartGame() {
        this.restartBtn.addEventListener('click', () => {
            this.snake.x = 180;
            this.snake.y = 180;
            this.snake.tails = [];
            this.snake.maxTails = 2;
            this.snake.dx = this.snake.config.cellSize;
            this.snake.dy = 0;
            this.snake.config.speed = 200;

            this.restartBtn.classList.remove('showRestartBtn');
        
            this.food.randomPositionFood(this.snake.tails);
            this.score.setToZero();
            this.gameStart();
        });

    }
}

class Snake {
    constructor() {
        this.config = new Config();
        this.x = 180;
        this.y = 180;
        this.dx = this.config.cellSize;
        this.dy = 0;
        this.tails = [];
        this.maxTails = 2;

        this.snakeHeadImage = new Image();
        this.snakeHeadImage.src = '../img/SnakeHead.svg';
        this.snakeTailImage = new Image();
        this.snakeTailImage.src = '../img/SnakeTail.svg';

        this.changeDirection();
    }

    drawSnake(context, food, score) {
        this.x += this.dx;
        this.y += this.dy;

        this.tails.unshift( { x: this.x, y: this.y } );
    
        if ( this.tails.length > this.maxTails ) {
            this.tails.pop();
        }
        this.tails.forEach((part, index) => {
            if (index == 0) {
                context.drawImage(this.snakeHeadImage, part.x, part.y);
            } else {
                context.drawImage(this.snakeTailImage, part.x, part.y);
            }

            if (part.x === food.x && part.y === food.y) {
                this.maxTails++;
                score.incScore();
                food.randomPositionFood(this.tails);
                this.config.speed -= 3;
            }
        });
    }

    changeDirection(){

        document.addEventListener("keydown", (event) => {
            const goLeft = (this.dx == -this.config.cellSize);
            const goUp = (this.dy == -this.config.cellSize);
            const goRight = (this.dx == this.config.cellSize);
            const goDown = (this.dy == this.config.cellSize);
    
            switch (true){
                case (event.code == "KeyA" && !goRight):
                    this.dx = -this.config.cellSize;
                    this.dy = 0;
                    break;
                case (event.code == "KeyW" && !goDown):
                    this.dx = 0;
                    this.dy = -this.config.cellSize;
                    break;
                case (event.code == "KeyD" && !goLeft):
                    this.dx = this.config.cellSize;
                    this.dy = 0;
                    break;
                case (event.code == "KeyS" && !goUp):
                    this.dx = 0;
                    this.dy = this.config.cellSize;
                    break;
            }
        });
        
    }
}

class Food {
    constructor(canvas) {
        this.x = 260;
	    this.y = 260;
        this.canvas = canvas;
        this.config = new Config();
        this.foodImage = new Image();
        this.foodImage.src = '../img/Food.svg';
    }

    getRandomInt(min, max) {
        return Math.round((Math.random() * (max - min) + min) / this.config.cellSize) * this.config.cellSize;
    
    }

    randomPositionFood(tails) {
        this.x = this.getRandomInt(0, this.canvas.element.width - this.config.cellSize);
        this.y = this.getRandomInt(0, this.canvas.element.height - this.config.cellSize);
    
        for (let i = 0; i < tails.length; i++) {
            if (tails[i].x == this.x && tails[i].y == this.y) {
                this.randomPositionFood(tails);
            }
        }
    }

    drawFood(context) {
        context.drawImage(this.foodImage, this.x, this.y);
    }
}

class Score {
    constructor(score) {
        this.score = score;
        this.currentScore = document.querySelector('#currentScore');
        this.bestScore = document.querySelector('#bestScore');
        this.scoreFromStorage = localStorage.getItem('bestscore');
    }

    incScore() {
        this.score++;
        this.drawScore();
    }

    setToZero() {
        this.score = 0;
        this.drawScore();
    }

    drawScore() {
        this.currentScore.innerHTML = this.score;
    }

    checkBestScore() {
        if (this.scoreFromStorage) {
            this.bestScore.innerHTML = this.scoreFromStorage;
        } else {
            this.bestScore.innerHTML = 0;
        }
    
        if (this.score > this.scoreFromStorage) {
            this.bestScore.innerHTML = this.score;
            localStorage.setItem('bestscore', this.score);
        }
    }
}

let game = new Game();


