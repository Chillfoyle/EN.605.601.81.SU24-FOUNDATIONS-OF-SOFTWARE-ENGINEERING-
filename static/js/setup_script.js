// Main code

document.addEventListener("DOMContentLoaded", () => {
    console.log("Starting");
    const setupUIHandler = new SetupUIHandler();
    setupUIHandler.initializeSetupScreen();

    document.getElementById("playButton").addEventListener("click", () => {
        console.log("Submitting");
        setupUIHandler.submitInputs();
    });

});






