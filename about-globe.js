const pictureFiles = [
    'my-pictures/Veronica_Loza_Picture.jpg',
    'my-pictures/photo_2026-11-14_14-39-03.jpg',
    'my-pictures/photo_2026-11-14_14-39-06.jpg',
        'my-pictures/photo_2026-11-14_14-39-10.jpg',
        'my-pictures/photo_2026-11-14_15-22-04.jpg',
        'my-pictures/photo_2026-11-14_15-59-08.jpg',
        'my-pictures/photo_2026-11-14_15-59-10.jpg',
        'my-pictures/photo_2026-11-14_15-59-12.jpg'
];

let photos = [];
let cards = [];
let pressX = 0;
let pressY = 0;
let viewerIndex = 0;

function preload() {
    photos = pictureFiles.map((file) => loadImage(file));
}

function setup() {
    const holder = document.getElementById('about-globe');
    const size = holder.clientWidth || 256;
    const canvas = createCanvas(size, Math.round(size * 1.15), WEBGL);
    canvas.parent(holder);

    layoutCards();
    noStroke();
    setupPhotoViewer();
}

function layoutCards() {
    const radius = width * 0.4;
    let scale = 1;
    let best = null;
    let bestScore = Infinity;

    for (let attempt = 0; attempt < 8; attempt++) {
        const result = placeCards(radius, scale);
        if (result.score < bestScore) {
            bestScore = result.score;
            best = result.placed;
        }
        if (result.score === 0) break;
        scale *= 0.88;
    }

    cards = best;
}

function placeCards(radius, scale) {
    const specs = photos.map((img, index) => {
        const aspect = img.width / img.height || 1;
        let h = radius * random(0.78, 1.02) * scale;
        let w = h * aspect;
        const maxSide = radius * 1.2 * scale;
        const fit = maxSide / Math.max(w, h);
        if (fit < 1) {
            w *= fit;
            h *= fit;
        }
        return { img, index, src: pictureFiles[index], w, h };
    });

    let best = null;
    let bestScore = Infinity;
    for (let attempt = 0; attempt < 80; attempt++) {
        const placed = specs.map((spec) => ({
            ...spec,
            theta: random(TWO_PI),
            phi: random(-1.15, 1.15)
        }));
        const score = overlapScore(placed, radius);
        if (score < bestScore) {
            bestScore = score;
            best = placed;
        }
        if (score === 0) break;
    }

    return { placed: best, score: bestScore };
}

function overlapScore(placed, radius) {
    const dist = cameraDistance();
    const tanHalf = cameraTanHalf();
    const pitches = [-0.55, 0, 0.55];
    let score = 0;

    pitches.forEach((pitch) => {
        const eye = rotX({ x: 0, y: 0, z: dist }, pitch);
        for (let step = 0; step < 24; step++) {
            const spin = step * TWO_PI / 24;
            const quads = placed.map((card) => {
                if (!onNearSide(card, radius, spin, eye)) return null;
                return inflateQuad(
                    cardCorners(card, radius, spin).map((point) => projectPoint(point, eye, tanHalf)),
                    2
                );
            });
            for (let i = 0; i < quads.length; i++) {
                if (!quads[i]) continue;
                for (let j = i + 1; j < quads.length; j++) {
                    if (quads[j] && quadsOverlap(quads[i], quads[j])) score += 1;
                }
            }
        }
    });

    return score;
}

function onNearSide(card, radius, spin, eye) {
    const center = cardCenter(card, radius + 2, spin);
    return vDot(center, vNorm(eye)) > radius * 0.08;
}

function cardCorners(card, radius, spin) {
    const depth = radius + 2;
    const hw = card.w / 2;
    const hh = card.h / 2;
    return [
        { x: -hw, y: -hh, z: depth },
        { x: hw, y: -hh, z: depth },
        { x: hw, y: hh, z: depth },
        { x: -hw, y: hh, z: depth }
    ].map((point) => rotY(rotX(point, -card.phi), card.theta + spin));
}

function projectPoint(point, eye, tanHalf) {
    const zaxis = vNorm(eye);
    const xaxis = vNorm(vCross({ x: 0, y: 1, z: 0 }, zaxis));
    const yaxis = vScale(vCross(zaxis, xaxis), -1);
    const rel = vSub(point, eye);
    const depth = -vDot(rel, zaxis);
    if (depth < 1) return null;
    const aspect = width / height;
    const half = tanHalf || cameraTanHalf();
    const ndcX = (vDot(rel, xaxis) / depth) / (aspect * half);
    const ndcY = (vDot(rel, yaxis) / depth) / half;
    return {
        x: (ndcX + 1) * width / 2,
        y: (1 - ndcY) * height / 2
    };
}

function inflateQuad(quad, pad) {
    if (quad.some((point) => !point)) return null;
    const center = quad.reduce((sum, point) => ({
        x: sum.x + point.x / quad.length,
        y: sum.y + point.y / quad.length
    }), { x: 0, y: 0 });
    return quad.map((point) => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const len = Math.hypot(dx, dy) || 1;
        return { x: point.x + (dx / len) * pad, y: point.y + (dy / len) * pad };
    });
}

function quadsOverlap(a, b) {
    const axes = [];
    for (let i = 0; i < 4; i++) {
        axes.push(edgeNormal(a[i], a[(i + 1) % 4]));
        axes.push(edgeNormal(b[i], b[(i + 1) % 4]));
    }
    return axes.every((axis) => {
        const pa = projectRange(a, axis);
        const pb = projectRange(b, axis);
        return pa.max >= pb.min && pb.max >= pa.min;
    });
}

function edgeNormal(p, q) {
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: -dy / len, y: dx / len };
}

function projectRange(poly, axis) {
    let min = Infinity;
    let max = -Infinity;
    poly.forEach((point) => {
        const d = point.x * axis.x + point.y * axis.y;
        if (d < min) min = d;
        if (d > max) max = d;
    });
    return { min, max };
}

function draw() {
    background(255);
    orbitControl();
    rotateY(frameCount * 0.004);

    const radius = width * 0.4;

    cards.forEach((card) => {
        push();
        rotateY(card.theta);
        rotateX(-card.phi);
        translate(0, 0, radius + 2);
        texture(card.img);
        plane(card.w, card.h);
        pop();
    });
}

function mousePressed() {
    pressX = mouseX;
    pressY = mouseY;
}

function mouseReleased() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    if (dist(mouseX, mouseY, pressX, pressY) > 6) return;
    const hit = cardUnderMouse();
    if (hit) window.openPhotoViewer(hit.index);
}

function cardUnderMouse() {
    const radius = width * 0.4;
    const spin = frameCount * 0.004;
    const eye = cameraEye();
    const ray = pointerRay(eye);
    let closest = null;
    let closestT = Infinity;

    cards.forEach((card) => {
        const center = cardCenter(card, radius + 2, spin);
    const normal = vNorm(center);
        const denom = vDot(ray.dir, normal);
        if (denom > -0.0001) return;
        const t = vDot(vSub(center, eye), normal) / denom;
        if (t <= 0 || t >= closestT) return;
        const hit = vAdd(eye, vScale(ray.dir, t));
        const offset = vSub(hit, center);
        const right = cardRight(card, spin);
        const up = cardUp(card, spin);
        if (Math.abs(vDot(offset, right)) <= card.w / 2 && Math.abs(vDot(offset, up)) <= card.h / 2) {
            closest = card;
            closestT = t;
        }
    });

    return closest;
}

function cardCenter(card, radius, spin) {
    const point = { x: 0, y: 0, z: radius };
    return rotY(rotX(point, -card.phi), card.theta + spin);
}

function cardRight(card, spin) {
    const point = { x: 1, y: 0, z: 0 };
    return rotY(rotX(point, -card.phi), card.theta + spin);
}

function cardUp(card, spin) {
    const point = { x: 0, y: 1, z: 0 };
    return rotY(rotX(point, -card.phi), card.theta + spin);
}

function rotX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: v.x,
        y: v.y * c - v.z * s,
        z: v.y * s + v.z * c
    };
}

function rotY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: v.x * c + v.z * s,
        y: v.y,
        z: -v.x * s + v.z * c
    };
}

function cameraEye() {
    const cam = typeof _renderer !== 'undefined' && _renderer._curCamera;
    if (cam && Number.isFinite(cam.eyeX)) {
        return { x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ };
    }
    return { x: 0, y: 0, z: 800 };
}

function cameraDistance() {
    const eye = cameraEye();
    return Math.hypot(eye.x, eye.y, eye.z) || 800;
}

function cameraTanHalf() {
    const cam = typeof _renderer !== 'undefined' && _renderer._curCamera;
    const fov = cam && cam.cameraFOV;
    return Math.tan((fov || Math.PI / 3) / 2);
}

function pointerRay(eye) {
    const ndcX = (mouseX / width) * 2 - 1;
    const ndcY = 1 - (mouseY / height) * 2;
    const aspect = width / height;
    const tanHalf = cameraTanHalf();
    const zaxis = vNorm(eye);
    const xaxis = vNorm(vCross({ x: 0, y: 1, z: 0 }, zaxis));
    const yaxis = vScale(vCross(zaxis, xaxis), -1);
    const dir = vNorm(vAdd(
        vAdd(vScale(xaxis, ndcX * aspect * tanHalf), vScale(yaxis, ndcY * tanHalf)),
        vScale(zaxis, -1)
    ));
    return { dir };
}

function vAdd(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function vSub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function vScale(v, amount) {
    return { x: v.x * amount, y: v.y * amount, z: v.z * amount };
}

function vDot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function vCross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

function vNorm(v) {
    const length = Math.hypot(v.x, v.y, v.z) || 1;
    return vScale(v, 1 / length);
}

function setupPhotoViewer() {
    const viewer = document.getElementById('photo-viewer');
    const image = viewer.querySelector('.photo-viewer-image');

    function show(index) {
        viewerIndex = (index + pictureFiles.length) % pictureFiles.length;
        image.src = pictureFiles[viewerIndex];
        image.alt = 'Photo ' + (viewerIndex + 1);
        viewer.hidden = false;
    }

    viewer.querySelector('.photo-viewer-prev').addEventListener('click', (event) => {
        event.stopPropagation();
        show(viewerIndex - 1);
    });
    viewer.querySelector('.photo-viewer-next').addEventListener('click', (event) => {
        event.stopPropagation();
        show(viewerIndex + 1);
    });
    viewer.querySelector('.photo-viewer-close').addEventListener('click', (event) => {
        event.stopPropagation();
        viewer.hidden = true;
    });
    viewer.addEventListener('click', (event) => {
        if (event.target === viewer) viewer.hidden = true;
    });
    window.addEventListener('keydown', (event) => {
        if (viewer.hidden) return;
        if (event.key === 'ArrowLeft') show(viewerIndex - 1);
        if (event.key === 'ArrowRight') show(viewerIndex + 1);
        if (event.key === 'Escape') viewer.hidden = true;
    });

    window.openPhotoViewer = show;
}

function windowResized() {
    const holder = document.getElementById('about-globe');
    if (!holder) return;
    const size = holder.clientWidth || 256;
    resizeCanvas(size, Math.round(size * 1.15));
    layoutCards();
}
