const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextBtn = document.querySelector('.carousel__button--right');
const prevBtn = document.querySelector('.carousel__button--left');
const navDots = document.querySelector('.carousel__nav');
const dots = Array.from(navDots.children);
const slideWidth = slides[0].getBoundingClientRect().width;

// arrange the slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
}
slides.forEach(setSlidePosition); // declare function to be clear (want to avoid anonymous functions)

// const moveToSlide = (track, currentSlide, targetSlide) => {
//     track.style.transform = `translateX(-${targetSlide.style.left})`;
//     currentSlide.classList.remove('current-slide');
//     targetSlide.classList.add('current-slide');
// }

function moveToSlide(track, currentSlide, targetSlide) {
    track.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

// when I click left, move slides to the left
prevBtn.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;

    moveToSlide(track, currentSlide, prevSlide);
});

// when I click right, move slides to the right
nextBtn.addEventListener('click', e => {
    // get current and next slide
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;

    moveToSlide(track, currentSlide, nextSlide);
    // const amountToMove = nextSlide.style.left;
    // // move to the next slide
    // track.style.transform = `translateX(-${amountToMove})`;
    // currentSlide.classList.remove('current-slide');
    // nextSlide.classList.add('current-slide');
});

// when I click the nav indicators, move to the respective slide
