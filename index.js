// modify navigation button style

/*
document.getElementById("navbar").classList.toggle("menu");
console.log(document.getElementById("navbar").className);

var navbar = document.getElementById("navbar");
navbar.style.alignItems = "center";
navbar.style.justifyContent = "center";

var navButtons = document.getElementsByClassName("navButton");
//iterate through the array of navButtons and change the style for each one
for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].style.color = "lavender";
}

// console.log(Object.keys(navButtons[0].style));*/

// Event Listeners

// When the user clicks on the input box
// var inputBox = document.getElementById("guest-input");
// inputBox.addEventListener("click", function () {
//     this.value = "";
//     this.style.color = "black";
//     console.log("thank you for your input!")
// });

// // When the user clicks the submit button
// var submitBtn = document.getElementById("submit-button");
// submitBtn.addEventListener("click", function () {
//     //clear the text box and bring up a text saying thank you <guest name>
//     var guestName = document.getElementById("guest-input").value;
//     document.getElementById("guest-input").value = "";
//     document.getElementById("thankyou").textContent = "Thank you " + guestName + "!";
// });

// Produce a message when the user enters a valid email
let submitForm = document.getElementById("suscribe-form");
submitForm.addEventListener("submit", event => {
    // prevent default behavior
    event.preventDefault();

    // get user's email from the form
    let formData = new FormData(event.target);
    let userEmail = formData.get("email-address");
    console.log("Got email address: " + userEmail);

    let updatedContent = `<p>Congratulations, ${userEmail} has been added! Keep an eye out for email updates!</p>`;
    submitForm.innerHTML = updatedContent;
});
