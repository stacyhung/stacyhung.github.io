const snakeStartSpeed = 350; // ms
let score = 0;
let scoreDisplay = document.getElementById("snakegame-score");
let startBtn = document.getElementById("snakegame-start-btn");
let grid = document.getElementById("snakegame-grid");
let width = 20; // each square should be 25 x 25px
let direction = 1; // 1: right; -1: left; width: up; -width: down
let squares = [];
let currentSnake = [2, 1, 0]; // head is based on grid number moving right
let timerId = 0;
let interval = snakeStartSpeed; // 1000ms or 1s
let speed = 0.9 // increment ratio by which to decrease speed by
let appleIndex = 0;
// let apple = document.createElement("img");
let apple = document.createElement("div");
apple.classList.add('apple');
// apple.src = "../images/apple5.png";
// apple.alt = "cartoon apple";
// apple.classList.add('apple-img');

// create grid
function createGrid() {
    for (let i = 0; i < width * width; i++) {
        // create a new div representing a square in the grid
        let square = document.createElement("div");
        // add styling to the square
        square.classList.add('snakegame-square');
        // add the square to the grid
        grid.appendChild(square);
        // add square to the squares array
        squares.push(square);
    }
}

createGrid();
currentSnake.forEach(index => squares[index].classList.add('snake'));

function startGame() {
    console.log("restarting game!");
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
    interval = snakeStartSpeed;

    // re-add the class of snake to the new currentSnake
    currentSnake = [2, 1, 0];
    direction = 1;
    generateApple();
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    timerId = setInterval(move, interval);
}


function move() {
    console.log("A move!");
    // if the snake is going to hit the wall, stop
    /*
        Snake will hit the top wall: index - width < 0 and moving up
        Snake will hit the right wall: index % width = width - 1 and moving left
        Snake will hit the bottom wall: index + width < width * width and moving down
        Snake will hit the left wall: index % width = 0 and moving right
    */
    if ((currentSnake[0] - width < 0 && direction === -width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] + width >= width * width && direction === width) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (squares[currentSnake[0] + direction].classList.contains('snake'))
    ) {
        console.log('Snake is going to hit a wall!');
        clearInterval(timerId);
    } else {
        // otherwise remove last element (and styling) from snake array
        let tail = currentSnake.pop();
        squares[tail].classList.remove('snake');

        // add square (and styling) in the direction we are heading
        currentSnake.unshift(currentSnake[0] + direction);

        // handle the case when the snake hits an apple
        console.log('Index of currentSnake[0]: ' + currentSnake[0]);

        if (squares[currentSnake[0]].classList.contains('apple')) {
            // remove class apple
            squares[currentSnake[0]].classList.remove('apple');
            squares[currentSnake[0]].removeChild(apple);
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
            clearInterval(timerId);
            // timerId = 0;
            //      2. decrease interval time
            interval = interval * speed;
            //      3. start new interval
            timerId = setInterval(move, interval);
        }
        squares[currentSnake[0]].classList.add('snake');
    }

}

function generateApple() {
    // find a suitable random location to place the apple - i.e. not where the snake is located
    do {
        appleIndex = Math.floor(Math.random() * width * width);
    } while (squares[appleIndex].classList.contains('snake'))
    // add styling
    squares[appleIndex].classList.add('apple');
    squares[appleIndex].appendChild(apple);

}

/*
Change direction of snake based on arrow key pressed
    37: left
    38: up
    39: right
    40: down
*/
function control(event) {
    // console.log("changing direction!");
    /*switch (event.keyCode) {
        case 37: direction = -1;
        case 38: direction = -width;
        case 39: direction = 1;
        case 40: direction = width;
    }*/
    if (event.keyCode === 37) { direction = -1; }
    else if (event.keyCode === 38) { direction = -width; }
    else if (event.keyCode === 39) { direction = 1; }
    else if (event.keyCode === 40) { direction = width; }
}
document.addEventListener("keyup", control);
startBtn.addEventListener("click", startGame);