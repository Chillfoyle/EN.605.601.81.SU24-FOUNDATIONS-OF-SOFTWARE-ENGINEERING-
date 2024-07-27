document.addEventListener("DOMContentLoaded", () => {

    const gameUIController = new GameUIController();
    console.log("Created new GameUIController");

    (async function() {
        console.log("Fetching player information from GSM");
        await gameUIController.fetchPlayers();
        console.log("Displaying player names in score window");
        gameUIController.displayPlayerNames();
        console.log("Showing current player name on screen");
        gameUIController.updateCurrentPlayer();
    })();

    const rollButton = document.getElementById('rollDieButton');
    if (rollButton) {
        rollButton.addEventListener('click', () => {
            gameUIController.rollDie();
        });
    }

});