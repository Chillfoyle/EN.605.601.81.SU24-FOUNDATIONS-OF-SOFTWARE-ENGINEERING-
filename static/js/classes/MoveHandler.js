class MoveHandler {
// This class holds all attributes and methods related to token placement
// and movement including die, tokens, board squares, etc.

    constructor(gameUIController) {
    // Create MoveHandler class
        this.gameUIController = gameUIController;
        this.die = new Die();
        this.squares = document.querySelectorAll(".game-board .square, .square-empty");
        this.tokens = Array.from(document.querySelectorAll(".token"));
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
            this.placeOnSquare(star, validLoc[0], validLoc[1]);
        });
    }

    /* TODO: For MINIMAL - Finish movePlayerToken */
    movePlayerToken(token) {
        // player selects square
        // send location to server
        // server updates location, triggers UIcontroller to move token
        // this.MoveHandler.placeTokenOnSquare(token, squareRow, squareCol)
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