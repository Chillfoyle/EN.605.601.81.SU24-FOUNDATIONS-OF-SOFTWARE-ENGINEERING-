// Main code

document.addEventListener("DOMContentLoaded", () => {
    console.log("Starting");
    const setupUIHandler = new SetupUIHandler();
    setupUIHandler.initializeSetupScreen();

    function resizeGame() {  // Resizes the objects if screen size changes (not working with Lambda...)

        const gameWrapper = document.querySelector('.game-wrapper');

        // Calculate scale factor based on the viewport size
        const scaleFactor = Math.min(
            window.innerWidth / 1366, // Base width
            window.innerHeight / 600  // Base height
        );

        // Apply scaling to the game wrapper
        gameWrapper.style.transform = `scale(${scaleFactor})`;
        gameWrapper.style.width = `${1366}px`; // Base width
        gameWrapper.style.height = `${600}px`; // Base height

        // Adjust lambda dimensions based on scale factor
        lambda.style.width = "200px";
        lambda.style.height = "200px";
    }

    window.addEventListener('resize', resizeGame);
    window.addEventListener('load', resizeGame);
});






