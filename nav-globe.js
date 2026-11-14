const navGlobeHolder = document.getElementById('nav-globe');

if (navGlobeHolder && typeof p5 !== 'undefined') {
    const navRoot = navGlobeHolder.dataset.root || '';
    const navPictureFiles = [
        'my-pictures/Veronica_Loza_Picture.jpg',
        'my-pictures/photo_2026-11-14_14-39-03.jpg',
        'my-pictures/photo_2026-11-14_14-39-06.jpg',
        'my-pictures/photo_2026-11-14_14-39-10.jpg',
        'my-pictures/photo_2026-11-14_15-22-04.jpg',
        'my-pictures/photo_2026-11-14_15-59-08.jpg',
        'my-pictures/photo_2026-11-14_15-59-10.jpg',
        'my-pictures/photo_2026-11-14_15-59-12.jpg'
    ].map((file) => navRoot + file);

    const navSlots = [
        { theta: 0.2, phi: 0.35 },
        { theta: 2.3, phi: -0.85 },
        { theta: 3.7, phi: 0.75 },
        { theta: 5.0, phi: -0.25 },
        { theta: 1.15, phi: -0.15 },
        { theta: 4.4, phi: 0.15 },
        { theta: 2.9, phi: 0.45 },
        { theta: 5.8, phi: 0.95 }
    ];

    const navSketch = (sketch) => {
        let photos = [];
        let cards = [];

        sketch.preload = () => {
            photos = navPictureFiles.map((file) => sketch.loadImage(file));
        };

        sketch.setup = () => {
            const size = navGlobeHolder.clientWidth || 56;
            sketch.createCanvas(size, size, sketch.WEBGL);
            sketch.noStroke();
            const radius = size * 0.34;
            cards = photos.map((img, index) => {
                const aspect = img.width / img.height || 1;
                let h = radius * 0.95;
                let w = h * aspect;
                const maxSide = radius * 1.15;
                const fit = maxSide / Math.max(w, h);
                if (fit < 1) {
                    w *= fit;
                    h *= fit;
                }
                return {
                    img,
                    w,
                    h,
                    theta: navSlots[index].theta,
                    phi: navSlots[index].phi
                };
            });
        };

        sketch.draw = () => {
            sketch.background(255);
            sketch.rotateY(sketch.frameCount * 0.01);
            const radius = sketch.width * 0.34;
            cards.forEach((card) => {
                sketch.push();
                sketch.rotateY(card.theta);
                sketch.rotateX(-card.phi);
                sketch.translate(0, 0, radius);
                sketch.texture(card.img);
                sketch.plane(card.w, card.h);
                sketch.pop();
            });
        };
    };

    new p5(navSketch, navGlobeHolder);

    navGlobeHolder.addEventListener('click', () => {
        const href = navGlobeHolder.getAttribute('href');
        if (href) window.location.assign(href);
    });
}
