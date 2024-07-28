class GameUIController {

    constructor() {
    // Create new GameUIController object
        this.moveHandler = new MoveHandler(this);
        this.boardSquares = document.querySelectorAll(".game-board .square, .square-empty");
        this.tokens = Array.from(document.querySelectorAll(".token"));
        this.initializeGameScreen();
        this.setUpEventListeners();
    }

    setUpEventListeners() {
    // How to handle all button clicks

        document.getElementById("rollDieButton").addEventListener('click', () => this.moveHandler.handleDieRoll());
        // Add as needed
    }

    async initializeGameScreen() {
    // Set up the game screen

        console.log("Fetching player information from GSM");
        await this.fetchPlayers();
        console.log("Displaying player names in score window");
        this.displayPlayerNames();
        console.log("Showing current player name on screen");
        this.startPlayerTurn();

        this.players.forEach(player => {
        // Create each player's token and put it in the starting location
            const token = document.createElement("div");
            token.classList.add("token", player.token_color, `${player.token_color}-corner`);
            this.moveHandler.placeOnSquare(token, 4, 4);
        });
    }

    displayPlayerNames() {
    // Display player names in list and in score windows

        let playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        let playerNum = 1;
        this.players.forEach(player => {
            let listItem = document.createElement('li');
            listItem.innerText = `${playerNum}. ${player.name}`;
            playersList.appendChild(listItem);
            playerNum++;
            document.getElementById(`${player.token_color}-player`).innerText = player.name;
        });
        console.log("Successfully displayed player names on screen");

        /* TODO: For TARGET - Hide score windows that are not used*/

        //let colorList = ["red", "yellow", "green", "blue"];
        //let playerColors = [];
        //this.players.forEach(player => {
        //    document.getElementById(`${player.token_color}-player`).innerText = player.name;
            //playerColors.push(player.token_color);
        //});
        //colorList = colorList.filter(item => !playerColors.includes(item));
        //colorList.forEach(color => {
        //    let hideWindow = document.getElementById("${color}-hide-window");
        //    hideWindow.style.display = "block";
        //});
    }

    async fetchPlayers() {
        const response = await fetch('/get_players');
        const data = await response.json();
        this.players = data;
        console.log(this.players);
        console.log("Successfully fetched player information from GSM");
    }

    async fetchValidDestinations(dieValue) {
    console.log(this.currentPlayerLocation);
        const response = await fetch('/get_valid_destinations', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location: this.currentPlayerLocation,
                dieVal: dieValue
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Successfully fetched valid moves from GSM");
            this.moveHandler.highlightMoveOptions(data);
            this.displayInGameMessage("select-dest-prompt");
        } else {
            console.error("Failed to fetch valid moves from server");
        }
    }

    startPlayerTurn() {
    // Start turn for current player

        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-player').innerText = data.name;
                this.currentPlayerName = data.name;
                this.currentPlayerLocation = data.token_location;
                this.displayInGameMessage("roll-die-prompt");
                console.log("Successfully updated current player name");
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    /* TODO: For MINIMAL - Finish updatePlayerScore */
    updatePlayerScore(playerColor, newCategoryColor) {

    }

    displayInGameMessage(messageType) {
        // Display start message, prompt player to take turn,
        // provide any instructions or feedback
        if (messageType === "roll-die-prompt") {
            const msg = `${this.currentPlayerName}, roll the die!`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        if (messageType === "select-dest-prompt") {
            const msg = `${this.currentPlayerName}, where will you move your token?<br>Click a highlighted square.`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        /* TODO: For MINIMAL - Add messages for Roll Again, HQ, Trivial Compute squares, winning */

    }

    /* TODO: For TARGET - Finish displayPopup */
    displayPopUp(message) {
    // For exiting the game early, or when player wins to play again
    }

    /* TODO: For MINIMAL - Finish updateTurnIndicator */
    updateTurnIndicator() {

    }

    /* TODO: For MINIMAL - Finish displayTriviaQuestion */
    displayTriviaQuestion() {

    }

    /* TODO: For MINIMAL - Finish displayTriviaAnswer */
    displayTriviaAnswer() {

    }
}
