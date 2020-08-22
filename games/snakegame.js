let score = 0;
let scoreDisplay = document.getElementById("score");
let startBtn = document.getElementById("start-btn");
let grid = document.getElementById("grid");
let gridWidth = 20; // each square should be 25 x 25px
let direction = 1; // 1: right; -1: left; width: up; -width: down
let squares = [];
let currentSnake = [2, 1, 0]; // head is based on grid number moving right
let timerId = 0;
let interval = 1000; // 1000ms or 1s
let speed = 0.9 // increment ratio by which to decrease speed by
let appleIndex = 0;

// create grid
function createGrid() {
    for (let i = 0; i < gridWidth * gridWidth; i++) {
        // create a new div representing a square in the grid
        let gridSquare = document.createElement("div");
        // add styling to the square
        gridSquare.classList.add('square');
        // add the square to the grid
        grid.appendChild(gridSquare);
        // add square to the squares array
        squares.push(square);
    }
}

createGrid();
currentSnake.forEach(index => squares[index].classList.add('snake'));

function startGame() {
    // remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'));

    // remove the apple
    squares[appleIndex].classList.remove('apple');

    // reset score display
    score = 0;
    scoreDisplay.textContent = score;

    // reset the timer
    clearInterval(timerId);
    timerId = 0;
    interval = 1000;

    // re-add the class of snake to the new currentSnake
    currentSnake = [2, 1, 0];
    direction = 1;
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    setInterval(move, timerId);
    generateApple();
}


function move() {
    // if the snake is going to hit the wall, stop
    /*
        Snake will hit the top wall: index - width < 0 and moving up
        Snake will hit the right wall: index % width = width - 1 and moving left
        Snake will hit the bottom wall: index + width < width * width and moving down
        Snake will hit the left wall: index % width = 0 and moving right
    */
    if ((currentSnake[0] - width < 0 && direction === width) ||
        (currentSnake[0] % width === width - 1 && direction === -1) ||
        (currentSnake[0] + width >= width * width && direction === -width) ||
        (currentSnake[0] % width === 0 && direction === 1)) {
        clearInterval(timerId);
    }
    // otherwise remove last element (and styling) from snake array
    let tail = currentSnake.pop();
    squares[tail].classList.remove('snake');

    // add square (and styling) in the direction we are heading
    currentSnake.unshift(currentSnake[0] + direction);

    // handle the case when the snake hits an apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        // remove class apple
        squares[currentSnake[0]].classList.remove('apple');
        // grow snake by adding class of snake to it
        squares[tail].classList.add('snake');
        // grow the snake array
        currentSnake.push(tail);
        // create new apple
        generateApple();
        // add 1 to the score
        score += 1;
        scoreDisplay.textContent = score;
        // speed up the snake:
        //      1. reset timerId
        timerId = 0;
        //      2. decrease interval time
        interval = interval * speed;
        //      3. start new interval
        timerId = setInterval(move, interval);
    }
    squares[currentSnake[0]].classList.add('snake');
}

function generateApple() {
    // find a suitable random location to place the apple - i.e. not where the snake is located
    do {
        appleIndex = Math.floor(Math.random() * width * width);
    } while (squares[applexIndex].classList.contains('snake'))
    // add styling
    squares[appleIndex].classList.add('apple');
}

/*
Change direction of snake based on arrow key pressed
    37: left
    38: up
    39: right
    40: down
*/
function control(event) {
    switch (event) {
        case 37: direction = -1;
        case 38: direction = width;
        case 39: direction = 1;
        case 40: direction = -width;
    }
}

document.addEventListener("keyup", control);
startBtn.addEventListener("click", startGame);