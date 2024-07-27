class GameUIController {

    constructor() {
        // Get players from GSM
        this.playerList = this.fetchPlayers();
        this.displayPlayers();
    }

    initializeGameScreen() {
        // Tokens
        // Scores
        // Category list
    }

    displayInGameMessage(messageType) {
        // Display start message, prompt player to take turn,
        // provide any instructions or feedback
    }

    displayPopUp(message) {

    }

    updateTurnIndicator() {

    }

    rollDie() {

    }

    highlightAvailableDestinations() {

    }

    movePlayerToken() {

    }

    displayTriviaQuestion() {

    }

    displayTriviaAnswer() {

    }

    fetchPlayers() {
        fetch('/get_players')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    updateCurrentPlayer() {
        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-player').innerText = data
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    displayScores() {
        let playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        players.forEach(player => {
            let listItem = document.createElement('li');
            listItem.innerText = `${player.name}: ${player.score} ${player.current ? '(Current Player)' : ''}`;
            playersList.appendChild(listItem);
        });

        document.getElementById('current-player').innerText = playerName
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML = '';
        this.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `Name: ${player.name}, Token Color: ${player.token_color}`;
            playersDiv.appendChild(playerDiv);
        });
    }

}


// Initialize the GameUIController and fetch players
document.addEventListener("DOMContentLoaded", () => {
    const gameUIController = new GameUIController();
});