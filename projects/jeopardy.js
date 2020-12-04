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
// let offset = 15580; // Clue for "'DRESS'ED" category for $200 has optional string and "a" at front of answer; $600 has <i>...</i> tags
// let offset = 4549; // Zombies for $400 (The Walking Dead), Das Bait for $200 (a lure), Text me for $200 (face-to-face), text me for $600 (ha ha, only kidding)
// let offset = 15834; // Have you been tested? for $200 - answer is "An ultrasound"
let currQuestion = "";
let currAnswer = "";
let score = 0;
let currValue = 0;
let isRandomClue = false;
let isPictureClue = false;
let pictureLink = "";
let pictureImg;

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
    return `<div class="my-category-clue" id=${categoryID} >$${clueValue}</div>`;
}

async function getQuestion(id, value) {
    // get the category and value that was clicked
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
    userGuess.focus();
}

function showQuestion() {
    questionBoard.style.fontSize = '3rem';
    if (isRandomClue) {
        questionBoard.innerHTML = "(*random clue*) " + currQuestion;
    } else {
        questionBoard.innerHTML = currQuestion;
        // if picture clue, add img as child element of questionBoard
        if (isPictureClue) {
            questionBoard.innerHTML += `<img src="${pictureLink}" class="img-picture-clue"
            alt="picture clue" />`
        }
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
        isPictureClue = false;

        // check if picture clue (link to picture is the answer)
        let linkRegex = /<a href="(.*)" target="_blank">(.*)<\/a>/;
        // e.g. <a href="http://www.bla.com/pic.jpg" target="_blank">Alfred E. Neuman</a>

        if (linkRegex.test(currAnswer)) {
            isPictureClue = true;
            // extract matching group
            let match = currAnswer.match(linkRegex)
            pictureLink = match[1];
            currAnswer = match[2];
            pictureImg = `<img src="${pictureLink}" class="img-picture-clue" alt="picture clue" />`;
            console.log("Picture link: " + pictureImg);
        }

        console.log("Answer: " + currAnswer);
        console.log("Question: " + currQuestion);
        setTimeout(showQuestion, 1500);
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
    setTimeout(hideQuestion, 3000);
}

function checkAnswer() {
    let userAnswer = userGuess.value;
    let prefixThe = /^THE .*/g;
    let prefixA = /^A(N)? .*/g;
    let currAnswerRE;
    // allow the user the chance to guess the right answer if it contains a dash
    let altAnswer1 = currAnswer.replace(/-/g, ""); // e.g. "Jell-O" (user likely to submit "Jello")
    let altAnswer2 = currAnswer.replace(/-/g, " "); // e.g. "Harley-Davidson" (user likely to submit "Harley Davidson")
    let altAnswer1RE;
    let altAnswer2RE;

    // use regex to remove: 
    //  (i)     italics tags (e.g. <i>Devil in a Blue Dress</i>)
    //  (ii)    the escape character for single quotes (e.g. answer: "Charlie\'s Angels")
    //  (iii)   parentheses for optional substrings (e.g. answer: "a (salad) dressing")
    //  (iv)    double quotes
    //  (v)     commas
    currAnswer = currAnswer.replace(/,|\"|<i>|<\/i>|\\|\(|\)/g, "");
    //make answers case-insensitive
    userAnswer = userAnswer.toUpperCase();
    currAnswer = currAnswer.toUpperCase();
    altAnswer1 = altAnswer1.toUpperCase();
    altAnswer2 = altAnswer2.toUpperCase();

    // if the correct answer contains "a" or "the" in the front
    if (prefixThe.test(currAnswer)) {
        currAnswer = currAnswer.replace(/^THE /g, "");
        currAnswerRE = new RegExp(`(THE\s)?${currAnswer}`);
        altAnswer1RE = new RegExp(`(THE\s)?${altAnswer1}`);
        altAnswer2RE = new RegExp(`(THE\s)?${altAnswer2}`);
    } else if (prefixA.test(currAnswer)) {
        currAnswer = currAnswer.replace(/^A(N)? /g, "");
        currAnswerRE = new RegExp(`(A(N)?\s)?${currAnswer}`);
        altAnswer1RE = new RegExp(`(A(N)?\s)?${altAnswer1}`);
        altAnswer2RE = new RegExp(`(A(N)?\s)?${altAnswer2}`);
    } else {
        currAnswerRE = new RegExp(currAnswer);
        altAnswer1RE = new RegExp(altAnswer1);
        altAnswer2RE = new RegExp(altAnswer2);
    }

    console.log("Updated answer: " + currAnswer + ".");
    console.log("Updated user answer: " + userAnswer + ".");

    // close answer board
    answerBoard.style.display = "none";

    // check if user's answer matches game answer
    if (!(currAnswerRE.test(userAnswer)) & !(altAnswer1RE.test(userAnswer)) & !(altAnswer2RE.test(userAnswer))) {
        // incorrect answer - same result as give up
        giveUp();
    } else {
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

// trigger button click when user presses enter / return to submit answer
userGuess.addEventListener('keyup', e => {
    // 13 is "Enter" or "Return" on the keyboard
    if (e.key === "Enter") {
        // cancel default action
        e.preventDefault();
        // trigger button element with click
        submitButton.click();
    }
});
submitButton.addEventListener('click', checkAnswer);
giveUpButton.addEventListener('click', giveUp);

