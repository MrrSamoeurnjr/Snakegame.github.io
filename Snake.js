let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 400;

let blockSize = 10;
let widthInBlocks = canvas.width / blockSize;
let heightInBlocks = canvas.height / blockSize;
let score = 0;

let direction = "right";
let apple;
let snake;

function drawBorder() {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, canvas.width, blockSize);
    context.fillRect(0, canvas.height - blockSize, canvas.width, blockSize);
    context.fillRect(0, 0, blockSize, canvas.height);
    context.fillRect(canvas.width - blockSize, 0, blockSize, canvas.height);
}

function drawScore() {
    context.font = "20px Courier";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + score, blockSize, blockSize);
}

function gameOver() {
    clearInterval(intervalId);
    context.font = "60px Courier";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function circle(x, y, radius, fillCircle) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        context.fill();
    } else {
        context.stroke();
    }
}

function Block(col, row) {
    this.col = col;
    this.row = row;
}

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

function Snake() {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
}

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
};

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    if (direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

Snake.prototype.checkCollision = function (head) {
   for (let i = 0; i < this.segments.length; i++) {
       if (head.equal(this.segments[i])) {
           return true;
       }
   }

   return false;
};

function Apple() {
   this.position = new Block(10, 10);
}

Apple.prototype.draw = function () {
   this.position.drawCircle("LimeGreen");
};

Apple.prototype.move= function () {
   let randomCol= Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
   let randomRow= Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
   this.position= new Block(randomCol, randomRow);
};

let directions= {"ArrowLeft": "left", "ArrowUp": "up", "ArrowRight": "right", "ArrowDown": "down"};

document.addEventListener('keydown', function(event) { 
   let newDirection= directions[event.key];
   if(newDirection !== undefined){
       snake.setDirection(newDirection); 
   }
});

Snake.prototype.setDirection= function(newDirection){
   direction= newDirection;
};

window.onload= function(){
   snake= new Snake();
   apple= new Apple();

   intervalId= setInterval(function(){
       context.clearRect(0 ,0 ,canvas.width ,canvas.height);
       drawScore();
       snake.move();
       snake.draw();
       apple.draw();
       drawBorder();
   }, 100);
};
