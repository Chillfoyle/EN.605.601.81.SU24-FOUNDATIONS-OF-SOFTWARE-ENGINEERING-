// Main code

document.addEventListener("DOMContentLoaded", () => {
    const setupManager = new SetupManager();

    setupManager.initializeSetupScreen();

    document.getElementById("playButton").addEventListener("click", () => {
        setupManager.submitInputs();
    });
});






