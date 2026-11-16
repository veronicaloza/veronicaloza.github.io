const explorationPieces = [
    {
        src: 'archive-projects/Labud_VL_05.mp4',
        kind: 'video',
        title: 'Labuds 8 year Anniversary Video',
        line: 'Motion Graphics',
        href: 'https://www.instagram.com/reel/DfDG0MuJiGB/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=='
    },
    {
        src: 'archive-projects/The Attention Garden.mp4',
        kind: 'video',
        title: 'The Attention Garden',
        line: 'Cookies Coding Exercise'
    },
    {
        src: 'archive-projects/cd-dt-mixer.gif',
        kind: 'image',
        title: 'CD x DT Mixer',
        line: 'DD@P Event Poster at Parsons'
    },
    {
        src: 'archive-projects/insta.mov',
        kind: 'video',
        title: 'Interactive Flower',
        line: 'Projection Mapping & Blender'
    },
    {
        src: 'archive-projects/Veronica_Loza_Excersize_2.mp4',
        kind: 'video',
        title: 'Motion Exercise',
        line: 'Motion Graphics'
    }
];

let explorationMedia = [];
let cards = [];
let pressX = 0;
let pressY = 0;
let globeReady = false;
let shownSpin = 0;
let shownPitch = 0;
let shownLift = 0;
let shownDist = 900;
let globeDist = 900;
let focusCard = null;

function stageSize() {
    const holder = document.getElementById('explorations-globe');
    return {
        w: Math.max(holder.clientWidth || window.innerWidth, 320),
        h: Math.max(holder.clientHeight || window.innerHeight, 320)
    };
}

function setup() {
    const holder = document.getElementById('explorations-globe');
    if (!holder) return;
    if (window.lenis && typeof window.lenis.destroy === 'function') {
        window.lenis.destroy();
        window.lenis = null;
    }
    const stage = stageSize();
    const canvas = createCanvas(stage.w, stage.h, WEBGL);
    canvas.parent(holder);
    noStroke();

    let loaded = 0;
    const finish = () => {
        loaded += 1;
        if (loaded < explorationPieces.length) return;
        explorationMedia = explorationMedia.filter(Boolean);
        globeDist = globeRadius() * 3.6;
        shownDist = globeDist;
        layoutCards();
        globeReady = true;
    };

    explorationPieces.forEach((piece, index) => {
        if (piece.kind === 'video') {
            const video = createVideo(piece.src, () => {
                video.elt.muted = true;
                video.volume(0);
                video.loop();
                video.hide();
                explorationMedia[index] = { media: video, piece };
                finish();
            });
            video.elt.muted = true;
            video.hide();
            video.elt.addEventListener('error', finish, { once: true });
            return;
        }
        loadImage(piece.src, (img) => {
            explorationMedia[index] = { media: img, piece };
            finish();
        }, finish);
    });
}

function globeRadius() {
    return Math.min(width, height) * 0.26;
}

function layoutCards() {
    const radius = globeRadius();
    let scale = 1;
    let best = null;
    let bestScore = Infinity;

    for (let attempt = 0; attempt < 5; attempt++) {
        const result = placeCards(radius, scale);
        if (result.score < bestScore) {
            bestScore = result.score;
            best = result.placed;
        }
        if (result.score === 0) break;
        scale *= 0.88;
    }

    cards = best || [];
}

function mediaSize(media) {
    const w = media.width || (media.elt && media.elt.videoWidth) || 1;
    const h = media.height || (media.elt && media.elt.videoHeight) || 1;
    return { w, h };
}

function placeCards(radius, scale) {
    const specs = explorationMedia.map((item) => {
        const size = mediaSize(item.media);
        const aspect = size.w / size.h || 1;
        let h = radius * random(0.78, 1.02) * scale;
        let w = h * aspect;
        const maxSide = radius * 1.2 * scale;
        const fit = maxSide / Math.max(w, h);
        if (fit < 1) {
            w *= fit;
            h *= fit;
        }
        return { ...item, w, h };
    });

    let best = null;
    let bestScore = Infinity;
    for (let attempt = 0; attempt < 24; attempt++) {
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
    const pitches = [0];
    let score = 0;
    pitches.forEach((pitch) => {
        for (let step = 0; step < 12; step++) {
            const spin = (step / 12) * TWO_PI;
            for (let i = 0; i < placed.length; i++) {
                for (let j = i + 1; j < placed.length; j++) {
                    if (!onNearSide(placed[i], radius, spin, pitch) || !onNearSide(placed[j], radius, spin, pitch)) continue;
                    const a = cardCorners(placed[i], radius, spin, pitch);
                    const b = cardCorners(placed[j], radius, spin, pitch);
                    const inflatedA = inflateQuad(a, 2);
                    const inflatedB = inflateQuad(b, 2);
                    if (inflatedA && inflatedB && quadsOverlap(inflatedA, inflatedB)) score += 1;
                }
            }
        }
    });
    return score;
}

function onNearSide(card, radius, spin) {
    const center = cardCenter(card, radius, spin);
    const eye = { x: 0, y: 0, z: 800 };
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

function focusDistance(card) {
    const radius = globeRadius();
    const tanHalf = Math.tan(Math.PI / 6);
    const aspect = width / height;
    const distH = card.h / (2 * tanHalf * 0.62);
    const distW = card.w / (2 * tanHalf * aspect * 0.72);
    return radius + 2 + Math.max(distH, distW);
}

function minDistance() {
    return globeRadius() + 36;
}

function maxDistance() {
    return globeRadius() * 9;
}

function draw() {
    background(255);
    if (!globeReady) return;

    if (focusCard) {
        shownSpin = lerpAngle(shownSpin, -focusCard.theta, 0.08);
        shownPitch = lerp(shownPitch, focusCard.phi, 0.08);
    } else if (!mouseIsPressed) {
        shownSpin += 0.004;
        shownPitch = lerp(shownPitch, 0, 0.06);
    }
    const targetDist = focusCard ? focusDistance(focusCard) : globeDist;
    const targetLift = focusCard ? -Math.min(height * 0.055, 44) : 0;
    shownDist = lerp(shownDist, targetDist, 0.08);
    shownLift = lerp(shownLift, targetLift, 0.08);

    perspective(Math.PI / 3, width / height, 1, 30000);
    camera(0, 0, shownDist, 0, 0, 0, 0, 1, 0);
    translate(0, shownLift, 0);
    rotateX(shownPitch);
    rotateY(shownSpin);

    const radius = globeRadius();
    cards.forEach((card) => {
        push();
        rotateY(card.theta);
        rotateX(-card.phi);
        translate(0, 0, radius + 2);
        texture(card.media);
        plane(card.w, card.h);
        pop();
    });
}

function mousePressed() {
    pressX = mouseX;
    pressY = mouseY;
}

function mouseDragged() {
    if (!globeReady || focusCard) return;
    shownSpin += (mouseX - pmouseX) * 0.005;
    shownPitch = constrain(shownPitch + (mouseY - pmouseY) * 0.003, -1, 1);
}

function mouseReleased() {
    if (!globeReady) return;
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    if (dist(mouseX, mouseY, pressX, pressY) > 6) return;
    const hit = cardUnderMouse();
    if (hit) {
        focusCard = hit;
        showExplorationCaption(hit.piece);
        return;
    }
    if (focusCard) clearFocus();
}

function mouseWheel(event) {
    if (!globeReady) return false;
    const delta = Number.isFinite(event.delta) ? event.delta : (event.deltaY || 0);
    if (focusCard) {
        if (delta > 0) clearFocus();
        return false;
    }
    globeDist = constrain(globeDist + delta * 0.55, minDistance(), maxDistance());
    return false;
}

function clearFocus() {
    focusCard = null;
    const caption = document.getElementById('explorations-caption');
    if (caption) {
        caption.hidden = true;
        caption.replaceChildren();
    }
}

function showExplorationCaption(piece) {
    const caption = document.getElementById('explorations-caption');
    if (!caption) return;
    caption.hidden = false;
    caption.replaceChildren();
    const title = document.createElement(piece.href ? 'a' : 'span');
    title.className = 'explorations-caption-title';
    title.textContent = piece.title;
    if (piece.href) {
        title.href = piece.href;
        title.target = '_blank';
        title.rel = 'noopener';
    }
    const line = document.createElement('span');
    line.className = 'explorations-caption-line';
    line.textContent = piece.line;
    caption.append(title, line);
}

function cardUnderMouse() {
    const radius = globeRadius();
    const eye = cameraEye();
    const ray = pointerRay(eye);
    let closest = null;
    let closestT = Infinity;

    cards.forEach((card) => {
        const center = viewPoint({ x: 0, y: 0, z: radius + 2 }, card);
        const normal = vNorm(center);
        const denom = vDot(ray.dir, normal);
        if (denom > -0.0001) return;
        const t = vDot(vSub(center, eye), normal) / denom;
        if (t <= 0 || t >= closestT) return;
        const hit = vAdd(eye, vScale(ray.dir, t));
        const offset = vSub(hit, center);
        const right = viewPoint({ x: 1, y: 0, z: 0 }, card);
        const up = viewPoint({ x: 0, y: 1, z: 0 }, card);
        if (Math.abs(vDot(offset, right)) <= card.w / 2 && Math.abs(vDot(offset, up)) <= card.h / 2) {
            closest = card;
            closestT = t;
        }
    });

    return closest;
}

function globeProbe() {
    const radius = globeRadius();
    const eye = cameraEye();
    return cards.map((card) => {
        const center = viewPoint({ x: 0, y: 0, z: radius + 2 }, card);
        const screen = projectPoint(center, eye, cameraTanHalf());
        return {
            title: card.piece.title,
            z: Math.round(center.z),
            sx: screen && Math.round(screen.x),
            sy: screen && Math.round(screen.y)
        };
    });
}

function viewPoint(point, card) {
    let p = rotX(point, -card.phi);
    p = rotY(p, card.theta + shownSpin);
    p = rotX(p, shownPitch);
    return vAdd(p, { x: 0, y: shownLift, z: 0 });
}

function lerpAngle(current, target, amount) {
    let change = (target - current) % TWO_PI;
    if (change > Math.PI) change -= TWO_PI;
    if (change < -Math.PI) change += TWO_PI;
    return current + change * amount;
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
    return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
}

function rotY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
}

function cameraEye() {
    const cam = typeof _renderer !== 'undefined' && _renderer._curCamera;
    if (cam && Number.isFinite(cam.eyeX)) return { x: cam.eyeX, y: cam.eyeY, z: cam.eyeZ };
    return { x: 0, y: 0, z: 800 };
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

function windowResized() {
    const holder = document.getElementById('explorations-globe');
    if (!holder || !globeReady) return;
    const stage = stageSize();
    resizeCanvas(stage.w, stage.h);
    globeDist = constrain(globeDist, minDistance(), maxDistance());
    layoutCards();
}
