let currentHour = new Date().getHours();

// Check if the current time is between 19 (7 PM) and 22 (10 PM)
if (currentHour >= 1 && currentHour <= 4) {
    // Allow the website to work
    document.body.innerHTML = `
        <h1>Welcome to the Website!</h1>`;

} else {
    // Display an error message or redirect
    document.body.innerHTML = `
        <h1>Error 404</h1>
        <p>Sorry, this website is accessible only between 7 PM and 10 PM.</p>`;
    document.body.style.backgroundColor = "black"; // Optional: Add a darker background
    document.body.style.color = "white"; // Optional: Set text color for error message
}
