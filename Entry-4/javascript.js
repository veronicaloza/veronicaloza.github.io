// Get the hover text and fullscreen image elements
const hoverText = document.querySelector('.hover-text');
const fullscreenImage = document.querySelector('.fullscreen-image');

// Add an event listener for the hover action
hoverText.addEventListener('mouseenter', function() {
    // Add the 'visible' class to the fullscreen image when hover occurs
    fullscreenImage.classList.add('visible');
});

