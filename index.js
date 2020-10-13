// Event Listeners

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