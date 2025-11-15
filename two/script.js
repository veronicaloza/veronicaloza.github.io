const container = document.querySelector('.horizontal-scroll-container');

// Make mouse scroll down → horizontal slide
container.addEventListener(
    'wheel',
    (e) => {
        e.preventDefault(); // stop vertical page scroll
        container.scrollLeft += e.deltaY; // apply the 'vertical' value horizontally
    },
    { passive: false }
);