class GameUIController {

    constructor() {
        // Get players from GSM
        this.die = new Die("die");
    }

    initializeGameScreen() {
        // Tokens
        // Scores
        // Category list
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

    }

    displayPopUp(message) {

    }

    updateTurnIndicator() {

    }

    rollDie() {  // Some of this code belongs somewhere else...
        this.die.roll().then(() => {
            // send number to server side?
            // get back and display valid move set
            this.displayInGameMessage("select-dest-prompt");
        });
        // player selects square, send location to server
        // server updates location, triggers UIcontroller to move token
    }

    highlightAvailableDestinations() {

    }

    movePlayerToken() {

    }

    displayTriviaQuestion() {

    }

    displayTriviaAnswer() {

    }

    displayPlayerNames() {  // Display player names in list and in score windows

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

        // Want to eventually hide any score windows with colors that are
        // not being used

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
        console.log("Successfully fetched player information from GSM");
    }

    updateCurrentPlayer() {
        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-player').innerText = data.name;
                this.currentPlayerName = data.name;
                this.displayInGameMessage("roll-die-prompt");
                console.log("Successfully updated current player name");
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    updatePlayerScore(playerColor, newCategoryColor) {

    }

}
