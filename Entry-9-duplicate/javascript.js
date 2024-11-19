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

let currentHour = new Date().getHours();

let Q = document.getElementById("Q");

if (currentHour > 19 || currentHour <= 19) {
    Q.innerHTML = "Grab Some Coffee! It's time to Grind!";
} else {
    Q.innerHTML = "Why aren't you working on HW!"
}

let body = document.body;

if (currentHour > 6 && currentHour < 19) {

    body.style.backgroundColor = "#ffffff";

} else if (currentHour > 19 && currentHour < 22) {

    body.style.backgroundColor = "blue";
} else {

    body.style.backgroundColor = "black";

}







