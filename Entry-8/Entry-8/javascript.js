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



