import { Input, UP, RIGHT, DOWN, LEFT, inputTypes } from "/Input.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fps = 30; // 1 frame every 1000/20 = 50ms;
// Note: fpm dictate how many frames it takes for the snake to move, i.e. fpm = frames/move
// speed = how many times the snake moves in 1 second
// then speed = fps / fpm = (frames/second) / (frames/move) = moves/second
// fpm = fps/speed      => must require that speed is a factor of fps
// with fps = 30, speed = 1,2,3,5,6,10,15,30
// but there's no reason why fpm shouldn't be any number
// instead, let's approximate speed to a give fpm using speed = round(fps / fpm)
//
// or better yet, select speed, then fpm = round(fps/speed)
//
// 1speed = 30fpm, 2=15, 3=10, 4=8,
//
// fpm  |   speed
// 30->15       1->2
// 15->10       2->3
// 10->6        3->5
// 6->5         5->6
// 5->3         6->10
// 3->2         10->15
// 2->1         15->30

//^ SETTINGS
let boardSize = { x: 20, y: 20 };
let canvasSizePx = canvas.width;
// let scoreSizePx = Math.floor(canvasSizePx * 0.12) + ((canvasSizePx - Math.floor(canvasSizePx * 0.12)) % boardSize);
// let tileSize = (canvasSizePx - scoreSizePx) / 20;
let boardWidthPx = 500;
let boardHeightPx = 500;

let tileSizePx = Math.floor(Math.min(boardWidthPx / boardSize.x, boardHeightPx / boardSize.y)); // select a tile size that best fits in with given board size
boardWidthPx = tileSizePx * boardSize.x;
boardHeightPx = tileSizePx * boardSize.y;

// Position where the board starts to be drawn
let boardOffset = { x: Math.floor((canvasSizePx - boardWidthPx) / 2), y: Math.floor((canvasSizePx - boardHeightPx) / 5) };

//! To consider: make a Board Class to facilitate construction of boards,

let backgroundColor = "rgb(14, 102, 179)";
let gameBorderColor = "rgb(5, 5, 5)";

const GREEN = "rgb(42, 199, 78)",
    RED = "rgb(212, 40, 43)",
    PURPLE = "rgb(95, 44, 150)",
    SKY = "rgb(140, 174, 237)",
    YELLOW = "rgb(199, 201, 44)",
    ORANGE = "rgb(214, 147, 13)";

const rect = canvas.getBoundingClientRect();
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (evt) => {
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
});

class Position {
    constructor(tileX, tileY) {
        this.x = tileX;
        this.y = tileY;
    }

    equalTo(pos2) {
        return this.x == pos2.x && this.y == pos2.y;
    }

    // Get a new position relative to this position
    moveRelative(horizontalMove, verticalMove) {
        return new Position(this.x + horizontalMove, this.y + verticalMove);
    }

    moveAdjacent(direction) {
        switch (direction) {
            case UP:
                return this.moveRelative(0, -1);
            case DOWN:
                return this.moveRelative(0, 1);
            case LEFT:
                return this.moveRelative(-1, 0);
            case RIGHT:
                return this.moveRelative(1, 0);
        }
    }

    isInsideBoard() {
        return this.x >= 0 && this.x < boardSize.x && this.y >= 0 && this.y < boardSize.y;
    }

    drawTile(offset = boardOffset) {
        ctx.fillRect(this.x * tileSizePx + offset.x, this.y * tileSizePx + offset.y, tileSizePx, tileSizePx);
    }
}

class Snake {
    constructor(id, position, direction, color = GREEN, speed = 6, foodDigesting = 0, inputType = inputTypes.ALL) {
        this.id = id;
        this.position = position;
        this.direction = direction;
        this.newDirection = direction;
        this.color = color;
        this.speed = speed;
        this.fpm = Math.round(fps / speed);
        this.moveCooldown = 0;
        this.foodDigesting = foodDigesting;
        this.size = 1;
        this.controllers = inputType;

        this.alive = true;
        this.snakePositions = [position];

        this.Input = new Input(inputType);
    }

    // Will move snake forwards in the direction being pressed
    moveSnake() {
        // Given input DETERMINE DIRECTION
        if (!this.alive) return;

        if (this.size == 1 && this.Input.direction != undefined) {
            this.direction = this.Input.direction;
        } else {
            switch (this.Input.direction) {
                case UP:
                    if (this.direction != DOWN && this.direction != UP) this.newDirection = this.Input.direction;
                    break;
                case RIGHT:
                    if (this.direction != LEFT && this.direction != RIGHT) this.newDirection = this.Input.direction;
                    break;
                case DOWN:
                    if (this.direction != UP && this.direction != DOWN) this.newDirection = this.Input.direction;
                    break;
                case LEFT:
                    if (this.direction != RIGHT && this.direction != LEFT) this.newDirection = this.Input.direction;
                    break;
            }
        }

        console.log(this.Input.direction, this.newDirection, this.direction);

        if (++this.moveCooldown >= this.fpm) {
            this.moveCooldown = 0;
            this.direction = this.newDirection; // only officially change direction when visually permitted

            let head = this.snakePositions[this.size - 1];
            this.snakePositions.push(head.moveAdjacent(this.direction));

            if (this.foodDigesting > 0) {
                this.foodDigesting--;
                this.size++;
            } else if (this.foodDigesting == 0) {
                this.snakePositions.shift();
            } else {
                this.snakePositions.splice(0, 2); // if negative, reduce size
                this.foodDigesting++;
                this.size--;
            }
        }
    }

    drawSnake() {
        // console.log(this.snakePositions);
        for (let i = 0; i < this.size; i++) {
            ctx.fillStyle = this.color;
            this.snakePositions[i].drawTile();
        }

        this.moveSnake();
    }
}

const Player1 = new Snake(0, new Position(10, 8), RIGHT, GREEN, 12, 10, inputTypes.WASD);

const Player2 = new Snake(1, new Position(20, 20), UP, YELLOW, 8, 8, inputTypes.ARROWS);

function update() {
    // console.log(canvasSizePx, scoreSizePx, tileSize, mouseX, mouseY);

    ctx.fillStyle = gameBorderColor;
    ctx.fillRect(0, 0, canvasSizePx, canvasSizePx);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(40, 15, canvasSizePx - 80, canvasSizePx - 65);

    Player1.drawSnake();
    Player2.drawSnake();
}

setInterval(update, 1000 / fps);
