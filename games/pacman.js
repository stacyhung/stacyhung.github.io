let score = 0;
const width = 28;
const grid = document.getElementById('pacman-grid');
const scoreDisplay = document.getElementById('pacman-score');
const squares = [];

/* First, create the layout, based on the following
 object mappings:

    0 - pacdots
    1 - wall
    2 - ghost lair
    3 - powerpellets
    4 - empty 

 */

const layout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];



/* Next, create the play board for the game, 
which is a 28x28 grid, where each grid square
is a 15px by 15px square. */
function createGrid() {
    //for each square
    for (let i = 0; i < layout.length; i++) {
        // create square
        const square = document.createElement('div');
        // add square to grid
        grid.appendChild(square);
        // add to squares array for future access
        squares.push(square);
        //add styling depending on the layout
        if (layout[i] === 0) {
            squares[i].classList.add('pac-dot')
        } else if (layout[i] === 1) {
            squares[i].classList.add('wall');
        } else if (layout[i] === 2) {
            squares[i].classList.add('ghost-lair');
        } else if (layout[i] === 3) {
            squares[i].classList.add('power-pellet');
        }
    }
}

createGrid();

// Establishing starting position of pacman
let pacmanCurrentIndex = 500;
squares[pacmanCurrentIndex].classList.add('pacman');

/* Attach key events to game control
 
Recall keycodes: 
    37 -> left
    38 -> up
    39 -> right
    40 -> down
 
For moving pacman (here width = 28):
    - move left, as long as index % width != 0
    - move right, as long as index % width != width - 1
    - move down (by adding width), as long as index + width < width*width
    - move up (by subtracting width), as long as index - width >= 0
 
*/
function control(e) {
    // temporarily remove pacman's index so it can be updated when it moves
    squares[pacmanCurrentIndex].classList.remove('pacman');

    switch (e.keyCode) {
        case 40:
            if (!(squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')) &&
                !(squares[pacmanCurrentIndex + width].classList.contains('wall')) &&
                (pacmanCurrentIndex + width < width * width)) {
                pacmanCurrentIndex += width;
            }
            break;
        case 39:
            if (!(squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')) &&
                !(squares[pacmanCurrentIndex + 1].classList.contains('wall')) &&
                (pacmanCurrentIndex % width != width - 1)) {
                pacmanCurrentIndex += 1;
                // handle short for pacman
                if (pacmanCurrentIndex === 391) {
                    pacmanCurrentIndex = 364;
                }
            }
            break;
        case 38:
            if (!(squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')) &&
                !(squares[pacmanCurrentIndex - width].classList.contains('wall')) &&
                (pacmanCurrentIndex - width >= 0)) {
                pacmanCurrentIndex -= width;
            }
            break;
        case 37:
            if (!(squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')) &&
                !(squares[pacmanCurrentIndex - 1].classList.contains('wall')) &&
                (pacmanCurrentIndex % width !== 0)) {
                pacmanCurrentIndex -= 1;
                // handle shortcut for pacman
                if (pacmanCurrentIndex === 364) {
                    pacmanCurrentIndex = 391;
                }
            }
            break;
    }
    // update pacman's index to where it will move
    squares[pacmanCurrentIndex].classList.add('pacman');
    eatPacDot();
}
document.addEventListener('keyup', control);

function eatPacDot() {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        score++;
        scoreDisplay.textContent = score;
        squares[pacmanCurrentIndex].classList.remove('pac-dot');
    }
}

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className;
        this.startIndex = startIndex;
        this.speed = speed;
    }

}

let ghosts = [
    new Ghost('blinky', 348, 250),
    new Ghost('pinky', 376, 400),
    new Ghost('inky', 351, 300),
    new Ghost('clyde', 379, 500)
];

//draw ghosts onto the grid
ghosts.forEach(ghost => {
    squares[ghost.startIndex].classList.add(ghost.className);
});