setInterval(animateRandomness, 1500);

function animateRandomness() {

    let images = ['ocean-waves.jpg', 'fish.jpeg', 'ripple.jpeg', 'Michael Kukla.jpeg', 'bread.jpeg'];

    console.log(images);

    let rectangle = document.getElementById('rectangle');

    let wave = document.getElementById('wavy-line');

    let sea = document.getElementById('sea');

    let secondrectangle = document.getElementById('rectangletwo')

    rectangle.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;

    wave.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;
    rectangletwo.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;

    let palette = ['#163655', '#401E01', '#D9C3B0', '#F2F2F2'];

    sea.style.color = palette[Math.floor(Math.random() * palette.length)];

    // alert("Refresh Page for More Visual Texture"); // 

}

// Get the current hour
let currentHour = new Date().getHours();

// Get references to the maintenance and content elements
let maintenanceDiv = document.getElementById("maintenance");
let contentDiv = document.getElementById("content");

// Show maintenance message during specified hours
if (currentHour >= 17 && currentHour <= 22) {
    maintenanceDiv.style.display = "flex"; // Show maintenance
    contentDiv.style.display = "none"; // Hide website content
} else {
    maintenanceDiv.style.display = "none"; // Hide maintenance
    contentDiv.style.display = "block"; // Show website content
}









