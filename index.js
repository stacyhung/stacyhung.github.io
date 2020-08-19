var header = document.getElementById("myHeader");
console.log("The header is " + header.innerHTML);

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
var inputBox = document.getElementById("guest-input");
inputBox.addEventListener("click", function () {
    this.value = "";
    this.style.color = "black";
});

// When the user clicks the submit button
var submitBtn = document.getElementById("submit-button");
submitBtn.addEventListener("click", function () {
    //clear the text box and bring up a text saying thank you <guest name>
    var guestName = document.getElementById("guest-input").value;
    document.getElementById("guest-input").value = "";
    document.getElementById("thankyou").textContent = "Thank you " + guestName + "!";
})