const navGlobeHolder = document.getElementById('nav-globe');

if (navGlobeHolder && typeof p5 !== 'undefined') {
    const navRoot = navGlobeHolder.dataset.root || '';
    const navPictureFiles = [
        'my-pictures/Veronica_Loza_Picture.jpg',
        'my-pictures/photo_2026-11-14_14-39-03.jpg',
        'my-pictures/photo_2026-11-14_14-39-10.jpg',
        'my-pictures/photo_2026-11-14_15-59-08.jpg',
        'my-pictures/photo_2026-11-14_15-59-10.jpg',
        'my-pictures/photo_2026-11-14_15-59-12.jpg',
        'my-pictures/photo_2026-11-15_14-22-41.jpg',
        'my-pictures/photo_2026-11-15_14-22-44.jpg',
        'my-pictures/Frame 2460.png'
    ].map((file) => navRoot + file);

    const navSlots = [
        { theta: 0.2, phi: 0.35 },
        { theta: 2.3, phi: -0.85 },
        { theta: 3.7, phi: 0.75 },
        { theta: 5.0, phi: -0.25 },
        { theta: 1.15, phi: -0.15 },
        { theta: 4.4, phi: 0.15 },
        { theta: 2.9, phi: 0.45 },
        { theta: 5.8, phi: 0.95 },
        { theta: 3.2, phi: -0.45 }
    ];

    const navSketch = (sketch) => {
        let photos = [];
        let cards = [];
        let ready = false;

        sketch.setup = () => {
            const size = navGlobeHolder.clientWidth || 56;
            sketch.createCanvas(size, size, sketch.WEBGL);
            sketch.noStroke();
            let loaded = 0;
            photos = navPictureFiles.map((file, index) => sketch.loadImage(file, (img) => {
                photos[index] = img;
                loaded += 1;
                if (loaded < navPictureFiles.length) return;
                const radius = sketch.width * 0.34;
                cards = photos.map((image, slot) => {
                    const aspect = image.width / image.height || 1;
                    let h = radius * 0.95;
                    let w = h * aspect;
                    const maxSide = radius * 1.15;
                    const fit = maxSide / Math.max(w, h);
                    if (fit < 1) {
                        w *= fit;
                        h *= fit;
                    }
                    return {
                        img: image,
                        w,
                        h,
                        theta: navSlots[slot].theta,
                        phi: navSlots[slot].phi
                    };
                });
                ready = true;
            }));
        };

        sketch.draw = () => {
            sketch.background(255);
            if (!ready) return;
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
