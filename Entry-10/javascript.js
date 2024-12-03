symmetry = 6;
let angle;

function setup() {
    // Set the canvas size to match the window size
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas-container"); // Attach canvas to the container
    drawBlueGradient();
}

function drawBlueGradient() {
    let c1 = color(6, 1, 20); // Top color: Blue
    let c2 = color(247, 209, 174); // Bottom color: Light Blue

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1); // Interpolation factor
        let c = lerpColor(c1, c2, inter); // Calculate the intermediate color
        stroke(c); // Set the stroke to the intermediate color
        line(0, y, width, y); // Draw a horizontal line
    }



    angle = 360 / symmetry;
}

function draw() {
    translate(width / 2, height / 2);
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let lineStartX = mouseX - width / 2;
        let lineStartY = mouseY - height / 2;
        let lineEndX = pmouseX - width / 2;
        let lineEndY = pmouseY - height / 2;

        if (mouseIsPressed) {
            for (let i = 0; i < symmetry; i++) {
                rotate(angle);
                stroke(255);
                strokeWeight(2);
                line(lineStartX, lineStartY, lineEndX, lineEndY);

                push();
                scale(1, -1);
                line(lineStartX, lineStartY, lineEndX, lineEndY);
                pop();
            }
        }
    }
}

// Dynamically resize the canvas when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(50); // Reset background on resize
}