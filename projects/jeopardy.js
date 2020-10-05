const getAnswerBtn = document.getElementById('get-answer-btn');
const getQuestionBtn = document.getElementById('get-question-btn');
const answerBox = document.getElementById('answer');
const questionBox = document.getElementById('question');
const valueBox = document.getElementById('value');
let answer = "";
let value = "";

/* Practice using APIs (and Promises with async / await)

http://jservice.io/
*/

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

getAnswerBtn.addEventListener('click', getAnswer);