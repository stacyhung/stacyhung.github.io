// variables to elements in the jokes interface
let newJokeBtn = document.getElementById('new-joke-btn');
let punchlineBtn = document.getElementById('punchline-btn');
let jokeSetupDiv = document.getElementById('joke-setup');
let jokePunchlineDiv = document.getElementById('joke-punchline');
let jokePunchline = "";

// Event listener for new joke button
newJokeBtn.addEventListener('click', getJoke);

// Event listener for joke punchline button
punchlineBtn.addEventListener('click', getPunchline);

/*
This function performs the following tasks:
    1. gets a new random joke from the random joke API (https://official-joke-api.appspot.com/jokes/programming/random)
    2. displays the text of the new joke on the page
    3. stores the punchline in a variable for when the user wants to get the punchline
    4. updates the punchline by clearing the text (if any), and corresponding bubble
    5. toggle buttons (i.e. hide get new joke button and show get punchline button)
*/
async function getJoke() {
    // read in the random joke
    let response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
    let joke = await response.json();
    console.log(joke);

    // extract the different parts of the joke
    let jokeSetup = joke[0].setup;
    jokePunchline = joke[0].punchline;

    // clear display of punchline for previous joke (if there was one)
    jokePunchlineDiv.innerHTML = "";

    // display the joke
    jokeSetupDiv.innerHTML = jokeSetup;

    // hide joke button (toggle .hidden style)

    // show punchline button (toggle .hidden style)
}

/*
This function performs the following tasks:
    1. Inserts the punchline into the punchlineDiv
    2. Adds the class bubble to the punchlineDiv
    3. Toggles the "hidden" class on both buttons.
*/
function getPunchline() {
    // Display the punchline text on the page
    jokePunchlineDiv.innerHTML = jokePunchline;

    // Show the bubble that goes around the text

    // toggle (hide) the button to get the punchline

    // toggle (show) the button to get a new joke
}