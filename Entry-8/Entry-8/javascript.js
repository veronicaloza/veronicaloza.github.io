let images = ['ocean-waves.jpg', 'fish.jpeg', 'ripple.jpeg'];

console.log(images);

let rectangle = document.getElementById('rectangle');

let wave = document.getElementById('wavy-line');

rectangle.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;

wave.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;




let pallete = ['#163655', '#401E01', '#D9C3B0', '#F2F2F2']
