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

function moveToSlide(currentSlide, targetSlide) {
    track.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

function updateDots(currentDot, targetDot) {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
}

function updateArrows(targetIndex) {
    // hide prev / next arrows if on first / last slides
    if (targetIndex === 0) {
        // hide previous button if we are on the first slide
        prevBtn.classList.add('is-hidden');
        nextBtn.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
        // hide next button if we are on the last last
        prevBtn.classList.remove('is-hidden');
        nextBtn.classList.add('is-hidden');
    } else {
        // we are on a middle slide, so make sure both arrows are shown
        prevBtn.classList.remove('is-hidden');
        nextBtn.classList.remove('is-hidden');
    }
}

// when I click left, move slides to the left
prevBtn.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = navDots.querySelector('.current-slide');
    const prevDot = currentDot.previousElementSibling;
    const prevIndex = dots.findIndex(dot => dot === prevDot);

    moveToSlide(currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    updateArrows(prevIndex);
});

// when I click right, move slides to the right
nextBtn.addEventListener('click', e => {
    // get current and next slide
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = navDots.querySelector('.current-slide');
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = dots.findIndex(dot => dot === nextDot);

    moveToSlide(currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    updateArrows(nextIndex);
});

// when I click the nav indicators, move to the respective slide
navDots.addEventListener('click', e => {
    // determine which indicator was clicked ("closest button")
    const targetDot = e.target.closest('button');

    // ignore any clicks that are not on the dots
    if (!targetDot) return;

    const currentSlide = track.querySelector('.current-slide');
    const currentDot = navDots.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    updateArrows(targetIndex);
});