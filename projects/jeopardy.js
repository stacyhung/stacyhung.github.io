// const getAnswerBtn = document.getElementById('get-answer-btn');
// const getQuestionBtn = document.getElementById('get-question-btn');
// const answerBox = document.getElementById('answer');
// const questionBox = document.getElementById('question');
// const valueBox = document.getElementById('value');
// let answer = "";
// let value = "";

const board = document.getElementById('board');
const questionBoard = document.getElementById('question');
const answerBoard = document.getElementById('guess-container');
const submitButton = document.querySelector('.submit-btn');
const giveUpButton = document.querySelector('.give-up-btn');
const scoreBoard = document.querySelector('.score-board');
const userGuess = document.getElementById('guess-box');
const correctAnswerContainer = document.getElementById('correct-answer-container');
const correctAnswer = document.querySelector('.correct-answer');
const correctAnswerTitle = document.querySelector('.answer-title');

let numCategories = 6;  // number of categories to retrieve
let offset = Math.floor(Math.random() * 18350); // starting point to start retrieving categories (maximum of 18400)
// let offset = 16282; // Clue for "Ride with a license" category for $600 is undefined 
let currQuestion = "";
let currAnswer = "";
let score = 0;
let currValue = 0;
let isRandomClue = false;

/**
 * Jeopardy (from Scrimba)
 * 
 * Board: 6 categories, 5 values --> 6x6 grid
 * 
 * Fetch data from https://jservice.io/api/categories
 * Parameters: count (number of categories), and offset (starting point of categories)
 */
async function getCategories() {
    console.log("offset: " + offset);
    let response = await fetch(`https://jservice.io/api/categories?count=${numCategories}&offset=${offset}`)
    let data = await response.json();
    return data;
}

function getCategoryHTML(category) {
    return `
        <div class="my-category-title">${category.title}</div>
        ${getClueHTML(200, category.id)}
        ${getClueHTML(400, category.id)}
        ${getClueHTML(600, category.id)}
        ${getClueHTML(800, category.id)}
        ${getClueHTML(1000, category.id)}
        `;
}

function getClueHTML(clueValue, categoryID) {
    // add category id and value as attributes -- e.g. "data-clue-value-200" and "data-category-id-11523"
    // return `<div class="my-category-clue" data-clue-value-${clueValue} data-category-id-${categoryID} >$${clueValue}</div>`;
    return `<div class="my-category-clue" id=${categoryID} >$${clueValue}</div>`;
}

async function getQuestion(id, value) {
    // get the category and value that was clicked
    // console.log(`Attempting to access: https://jservice.io/api/clues?value=${value}&category=${id}`);
    let response = await fetch(`https://jservice.io/api/clues?value=${value}&category=${id}`);
    let clue = await response.json();
    isRandomClue = false;

    // make sure the clue is valid
    if (clue[0] == null) {
        // replace with random clue
        response = await fetch(`https://jservice.io/api/random?count=1`);
        clue = await response.json();
        console.log("Current clue is undefined; replacing with random clue: " + clue[0].question + " / " + clue[0].answer);
        isRandomClue = true;
    }

    return clue;
}

function showValue(value) {
    board.style.display = "none";
    questionBoard.innerHTML = value;
    questionBoard.style.display = "flex";
    questionBoard.style.fontSize = "12rem";
}

function openAnswerBoard() {
    answerBoard.style.display = "flex";
}

function showQuestion() {
    questionBoard.style.fontSize = '3rem';
    if (isRandomClue) {
        questionBoard.innerHTML = "(*random clue*) " + currQuestion;
    } else {
        questionBoard.innerHTML = currQuestion;
    }
    openAnswerBoard();
}

// function when clue is clicked
const showValueAndQuestion = e => {
    // black out clue (can only click once)
    e.target.style.backgroundColor = "black";
    e.target.style.color = "black";
    e.target.style.cursor = "default"; // arrow instead of hand pointer

    // get the category ID and value of the clue that was clicked
    let clickedID = e.target.id;
    currValue = parseInt(e.target.innerHTML.split("$").join(''));

    // update board container to show value -- for 2 seconds, then show the question.
    showValue(e.target.innerHTML);

    // get the corresponding clue object
    getQuestion(clickedID, currValue).then(clue => {
        // console.log("Clue: " + JSON.stringify(clue));
        currAnswer = clue[0].answer;
        currQuestion = clue[0].question;
        console.log("Answer: " + currAnswer);
        console.log("Question: " + currQuestion);
        setTimeout(showQuestion, 2000);
    }).catch(e => {
        console.log("Error: " + e);
    });
}

getCategories().then(categories => {
    // console.log("Categories:" + JSON.stringify(categories));
    // Each category is an object with id and title
    board.innerHTML = categories.map(category => getCategoryHTML(category)).join(''); //board.innerHTML = categories.map(getCategoryHTML).join('')
    // add event listener to each grid element (class "my-category-clue")
    let clues = document.querySelectorAll(".my-category-clue");

    clues.forEach(clue => {
        clue.addEventListener("click", showValueAndQuestion, { once: true });
    })
});

// when the user clicks the "give up" button
function giveUp() {
    // show the answer and keep the question up at the same time for a few seconds
    answerBoard.style.display = "none";
    showAnswer();

    // subtract points from the score;
    score -= currValue;
    scoreBoard.innerHTML = `$${score}`;
    userGuess.value = "";
}

function hideQuestion() {
    correctAnswerContainer.style.display = "none";
    // after, close the question board
    questionBoard.style.display = "none";
    // open the clue grid up
    board.style.display = "grid";
}

function showAnswer() {
    correctAnswerContainer.style.display = "flex";
    correctAnswerTitle.innerHTML = "Sorry, the correct answer is: ";
    correctAnswer.innerHTML = currAnswer;
    setTimeout(hideQuestion, 4000);
}

function checkAnswer() {
    const userAnswer = userGuess.value;

    // check (not case dependent) user's input against answer
    if (userAnswer.toLowerCase() != currAnswer.toLowerCase()) {
        // same result as giving up
        giveUp();
    } else {
        // close the guess board and question board
        questionBoard.style.display = "none";
        answerBoard.style.display = "none";
        // open the clue grid up
        board.style.display = "grid";
        // subtract points from the score;
        score += currValue;
        scoreBoard.innerHTML = `$${score}`;
        userGuess.value = "";

        // let the user quickly know they got the answer right
        correctAnswerContainer.style.display = "flex";
        correctAnswerTitle.innerHTML = "Correct!";
        correctAnswer.innerHTML = "";
        setTimeout(hideQuestion, 1500);
    }
}

submitButton.addEventListener('click', checkAnswer);
giveUpButton.addEventListener('click', giveUp);

/*
async function getQuestion() {
    try {
        let response = await fetch('http://jservice.io/api/random');
        let data = await response.json();
        let question = data[0].question;
        answer = data[0].answer;
        value = data[0].value;
        if (!value) { value = 200; }

        console.log("Value:" + value);

        // display in clue box
        questionBox.innerHTML = question;

        // clear question box
        answerBox.innerHTML = "";

        // show value of question:
        valueBox.innerHTML = "For $" + value + "...";

    } catch (err) {
        console.error(err);
    }
}

getQuestionBtn.addEventListener('click', getQuestion);

function getAnswer() {
    try {
        console.log("Answer:" + answer);

        // display in answer box
        // answerBox.classList.toggle('visible');

        answerBox.innerHTML = answer;

    } catch (err) {
        console.error(err);
    }
}

getAnswerBtn.addEventListener('click', getAnswer);*/