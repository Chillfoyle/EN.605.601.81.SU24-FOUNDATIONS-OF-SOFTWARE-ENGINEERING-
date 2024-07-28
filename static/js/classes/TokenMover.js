class TokenMover {

    constructor() {
    // Creates TokenMover class. Stores all grid square and token objects
        this.squares = document.querySelectorAll(".game-board .square, .square-empty");
        this.tokens = Array.from(document.querySelectorAll(".token"));
    }

    getSquare(row, col) {
    // Derive the index of grid square in list given row and column
        const index = (row * 9) + col;
        return this.squares[index];
    }

    placeTokenOnSquare(token, squareRow, squareCol) {
    // Puts the token on a grid square
        const destSquare = this.getSquare(squareRow, squareCol);
        destSquare.appendChild(token);
    }

}