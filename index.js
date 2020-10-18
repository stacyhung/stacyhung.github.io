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

/* Event listeners for main recipe page */

/*
(function () {

    function init() {
        var speed = 250,
            easing = mina.easeinout;

        [].slice.call(document.querySelectorAll('#grid > a')).forEach(function (el) {
            var s = Snap(el.querySelector('svg')), path = s.select('path'),
                pathConfig = {
                    from: path.attr('d'),
                    to: el.getAttribute('data-path-hover')
                };

            el.addEventListener('mouseenter', function () {
                path.animate({ 'path': pathConfig.to }, speed, easing);
            });

            el.addEventListener('mouseleave', function () {
                path.animate({ 'path': pathConfig.from }, speed, easing);
            });
        });
    }

    init();

})();*/