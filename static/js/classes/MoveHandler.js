class MoveHandler {
// This class holds all attributes and methods related to token placement
// and movement including die, tokens, board squares, etc.

    constructor(gameUIController) {
    // Create MoveHandler class
        this.gameUIController = gameUIController;
        this.die = new Die();
        this.toggleDieEnabled(false);
        this.squares = document.querySelectorAll(".game-board .square, .square-empty");
        this.tokens = [];
    }

    toggleDieEnabled(enabled) {
        document.getElementById("rollDieButton").disabled = (!enabled)
    }

    setCurrentPlayerTokenId(token_color) {
    // Identify current player's ID
        this.currentPlayerTokenId = `${token_color}-token`;
    }

    initializeToken(player) {
    // Put players' tokens on the starting square
        const token = document.createElement("div");
        token.classList.add("token", player.token_color, `${player.token_color}-corner`);
        token.id = `${player.token_color}-token`;
        this.placeOnSquare(token, 4, 4);
        this.tokens.push(token);
    }

    handleDieRoll(playerLoc) {
    // Get valid destinations when die is rolled
        this.die.roll().then(dieValue => {
            this.gameUIController.fetchValidDestinations(dieValue);
        });
    }

    highlightMoveOptions(validDestinations) {
    // Put stars on all places player can move to
        console.log(validDestinations);
        validDestinations.forEach(validLoc => {
            const star = document.createElement("div");
            star.classList.add("star");
            star.addEventListener('click', async () => {
                console.log("Adding event listener to star");
                const currentPlayerLocation = this.gameUIController.getCurrentPlayerLocation(false);
                console.log("Current player location is ", currentPlayerLocation);
                console.log("Updating player location to", validLoc);
                this.gameUIController.updateCurrentPlayerLocation(validLoc[0], validLoc[1]);
                const path = await this.getTokenPath(currentPlayerLocation, validLoc);
                console.log("Path to new location: ", path);
                await this.moveCurrentPlayerToken(path);
                this.gameUIController.displayInGameMessage("");  // Clear text
                console.log("Fetching next action based on ", validLoc)
                this.gameUIController.fetchNextAction([validLoc[0], validLoc[1]]);
                document.querySelectorAll('.star').forEach(star => star.remove());  // Clear stars
            });
            this.placeOnSquare(star, validLoc[0], validLoc[1]);
        });
    }

    async getTokenPath(currentPlayerLocation, validLoc) {
        console.log("Running getTokenPath");
        console.log("Current player location is ", currentPlayerLocation);
        console.log("Next location is ", validLoc);
        const path = await this.gameUIController.fetchTokenPath(currentPlayerLocation, [validLoc[0], validLoc[1]]);
        return path;
    }

    async moveCurrentPlayerToken(path) {
        for (let i = 1; i < path.length; i++) {
            const [row, col] = path[i];
            console.log(i);
            const token = document.getElementById(this.currentPlayerTokenId);
            token.classList.add('hopping');
            await new Promise(resolve => setTimeout(resolve, 500)); // Adjust delay as needed
            token.classList.remove('hopping');
            this.placeOnSquare(token, row, col);
        }
}

    getSquare(row, col) {
    // Derive the index of grid square in list given row and column
        const index = (row * 9) + col;
        return this.squares[(row * 9) + col];
    }

    placeOnSquare(obj, squareRow, squareCol) {
    // Puts the token on a grid square
        const destSquare = this.getSquare(squareRow, squareCol);
        console.log(squareRow, squareCol);
        destSquare.appendChild(obj);
    }

}