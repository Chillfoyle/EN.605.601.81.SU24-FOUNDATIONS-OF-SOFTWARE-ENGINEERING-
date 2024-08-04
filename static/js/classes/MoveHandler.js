class MoveHandler {
// This class holds all attributes and methods related to token placement
// and movement including die, tokens, board squares, etc.

    constructor(gameUIController) {
    // Create MoveHandler class
        this.gameUIController = gameUIController;
        this.die = new Die();
        this.squares = document.querySelectorAll(".game-board .square, .square-empty");
        this.tokens = [];
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

        validDestinations.forEach(validLoc => {
            const star = document.createElement("div");
            star.classList.add("star");
            star.addEventListener('click', () => {
                this.moveCurrentPlayerToken(validLoc[0], validLoc[1]);
                this.gameUIController.displayInGameMessage("");  // Clear text
                document.querySelectorAll('.star').forEach(star => star.remove());  // Clear stars
            });
            this.placeOnSquare(star, validLoc[0], validLoc[1]);
        });
    }

    moveCurrentPlayerToken(row, col) {
    // Move token to specified location and update internal record
        const token = document.getElementById(this.currentPlayerTokenId);
        this.placeOnSquare(token, row, col);
        this.gameUIController.updateCurrentPlayerLocation(row, col);
    }

    getSquare(row, col) {
    // Derive the index of grid square in list given row and column
        const index = (row * 9) + col;
        return this.squares[(row * 9) + col];
    }

    placeOnSquare(obj, squareRow, squareCol) {
    // Puts the token on a grid square
        const destSquare = this.getSquare(squareRow, squareCol);
        destSquare.appendChild(obj);
    }

}