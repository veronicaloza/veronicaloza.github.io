let symmetry = 6; // Number of reflective sections
let angle = 360 / symmetry; // Angle for each section

function preload() {
    // Load the background image
    bgImage = loadImage('Paper\ texture.jpeg'); // Replace with the correct path to your image
}

function setup() {
    // Create a canvas that matches the full viewport size
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES); // Use degrees for angle calculations

}

function draw() {

    // Move the origin to the center of the canvas
    translate(width / 2, height / 2);

    // Check if the mouse is within canvas bounds and pressed
    if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        // Adjust mouse coordinates relative to the center
        let lineStartX = mouseX - width / 2;
        let lineStartY = mouseY - height / 2;
        let lineEndX = pmouseX - width / 2;
        let lineEndY = pmouseY - height / 2;

        // Draw symmetrical lines
        for (let i = 0; i < symmetry; i++) {
            rotate(angle); // Rotate for each symmetry section
            stroke(999); // Set stroke color
            strokeWeight(2); // Set stroke weight
            line(lineStartX, lineStartY, lineEndX, lineEndY); // Draw the line

            // Reflect the line in each section
            push();
            scale(1, -1); // Flip vertically
            line(lineStartX, lineStartY, lineEndX, lineEndY);
            pop();
        }
    }
}

// Dynamically resize the canvas and reset the background when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(50); // Reset background after resize
}

// Optionally add a way to clear the canvas (press 'C' to clear)
function keyPressed() {
    if (key === 'C' || key === 'c') {
        background(50); // Clear the canvas
    }
}
