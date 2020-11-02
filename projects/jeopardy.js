// const getAnswerBtn = document.getElementById('get-answer-btn');
// const getQuestionBtn = document.getElementById('get-question-btn');
// const answerBox = document.getElementById('answer');
// const questionBox = document.getElementById('question');
// const valueBox = document.getElementById('value');
// let answer = "";
// let value = "";

const board = document.getElementById('board');
const questionBoard = document.getElementById('question');
let numCategories = 6;  // number of categories to retrieve
let offset = 11;         // starting point to start retrieving categories
let currQuestion = "";
let currAnswer = "";

/**
 * Jeopardy (from Scrimba)
 * 
 * Board: 6 categories, 5 values --> 6x6 grid
 * 
 * Fetch data from https://jservice.io/api/categories
 * Parameters: count (number of categories), and offset (starting point of categories)
 */
async function getCategories() {
    let response = await fetch(`http://jservice.io/api/categories?count=${numCategories}&offset=${offset}`)
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
    let response = await fetch(`http://jservice.io/api/clues?value=${value}&category=${id}`);
    let clue = await response.json();
    return clue;
}

function showValue(value) {
    board.style.display = "none";
    questionBoard.innerHTML = value;
    questionBoard.style.display = "flex";
}

function showQuestion() {
    questionBoard.style.fontSize = '3rem';
    questionBoard.innerHTML = currQuestion;
}

// function when clue is clicked
const showValueAndQuestion = e => {
    // black out clue (can only click once)
    e.target.style.backgroundColor = "black";
    e.target.style.color = "black";
    e.target.style.cursor = "default"; // arrow instead of hand pointer

    // get the category ID and value of the clue that was clicked
    let clickedID = e.target.id;
    let clickedValue = e.target.innerHTML.split("$").join('');

    // update board container to show value -- for 2 seconds, then show the question.
    showValue(e.target.innerHTML);

    // get the corresponding clue object
    getQuestion(clickedID, clickedValue).then(clue => {
        // console.log("Clue: " + JSON.stringify(clue));
        currAnswer = clue[0].answer;
        currQuestion = clue[0].question;
        // console.log("Answer: " + currAnswer + " and question: " + currQuestion);
        setTimeout(showQuestion, 2000);
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

// board.addEventListener('click', getQuestion);

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