// grab all the carousel-items (will be an array)
const slides = document.getElementsByClassName('carousel-item');
let slideIndex = 0;
const totalSlides = slides.length;

// Add event listeners to next and previous buttons
document.getElementById('btn-prev').addEventListener('click', getPrevImage);
document.getElementById('btn-next').addEventListener('click', getNextImage);

function getPrevImage() {
    // remove carousel-item-visible class from currently visible carousel item
    slides[slideIndex].classList.remove('carousel-item-visible');
    // go to the previous slide
    slideIndex--;
    if (slideIndex === -1) {
        slideIndex = totalSlides - 1; // go back to the end
    }
    // make previous carousel item visible
    slides[slideIndex].classList.add('carousel-item-visible');
}

function getNextImage() {
    // remove carousel-item-visible class from currently visible carousel item
    slides[slideIndex].classList.remove('carousel-item-visible');
    // go to the next slide
    slideIndex++;
    if (slideIndex === totalSlides) {
        slideIndex = 0; // go back to the start
    }
    // make next carousel item visible
    slides[slideIndex].classList.add('carousel-item-visible');
}