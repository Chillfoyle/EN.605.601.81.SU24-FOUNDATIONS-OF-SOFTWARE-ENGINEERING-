// Main code

document.addEventListener("DOMContentLoaded", () => {
    const setupUIHandler = new SetupUIHandler();

    setupUIHandler.initializeSetupScreen();

    document.getElementById("playButton").addEventListener("click", () => {
        setupUIHandler.submitInputs();
    });
});






