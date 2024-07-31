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
        this.currentPlayerTokenId = `${token_color}-token`;
    }

    initializeToken(player) {
        const token = document.createElement("div");
        token.classList.add("token", player.token_color, `${player.token_color}-corner`);
        token.id = `${player.token_color}-token`;
        this.placeOnSquare(token, 4, 4);
        this.tokens.push(token);
    }

    handleDieRoll(playerLoc) {
        this.die.roll().then(dieValue => {
            this.gameUIController.fetchValidDestinations(dieValue);
        });
    }

    /* TODO: For MINIMAL - Finish highlightMoveOptions */
    highlightMoveOptions(validDestinations) {
        // Clear existing stars
        // For each destination, add a star to that square

        validDestinations.forEach(validLoc => {
        // Create each player's token and put it in the starting location
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

    /* TODO: For MINIMAL - Finish movePlayerToken */
    moveCurrentPlayerToken(row, col) {
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