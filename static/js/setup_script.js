// Main code

document.addEventListener("DOMContentLoaded", () => {
    console.log("Starting");
    const setupUIHandler = new SetupUIHandler();
    setupUIHandler.initializeSetupScreen();

    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    } else {
        console.error('Elements not found');
    }

    const lambdaContainer = document.getElementById('lambda-container');
    const speechBubble = document.getElementById('speech-bubble');

});






