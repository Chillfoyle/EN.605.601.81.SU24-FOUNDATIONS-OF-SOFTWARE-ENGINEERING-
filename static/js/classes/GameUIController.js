class GameUIController {

    constructor() {
    // Create new GameUIController object
        this.moveHandler = new MoveHandler(this);
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
        this.players.forEach(player => {this.moveHandler.initializeToken(player)});
        console.log("Tokens placed on start");
        this.startPlayerTurn();
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

    async fetchCategories() {
        const response = await fetch('/get_categories');
        const data = await response.json();
        console.log("Successfully fetched categories from GSM");
        return data;
    }

    async fetchQuestion(color) {
        console.log(color);
        const response = await fetch('/get_question', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                color: color
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log("Successfully fetched question from GSM");
            document.getElementById('question').innerText = data.question;
            sessionStorage.setItem('currentAnswer', data.answer);
        }
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
            console.log("Successfully fetched question from GSM");
            this.moveHandler.highlightMoveOptions(data);
            this.displayInGameMessage("select-dest-prompt");
        } else {
            console.error("Failed to fetch valid moves from server");
        }
    }

    startPlayerTurn(prompt="roll-die-prompt") {
    // Start turn for current player

        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-player').innerText = data.name;
                this.currentPlayerName = data.name;
                this.currentPlayerLocation = data.token_location;
                this.currentPlayerScore = data.colors_earned;
                this.moveHandler.setCurrentPlayerTokenId(data.token_color);
                this.displayInGameMessage(prompt);
                console.log("Successfully updated current player name");
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    async updateCurrentPlayerLocation(newRow, newCol) {
        this.currentPlayerLocation = [newRow, newCol];  // Update internally
        const response = await fetch('/update_current_player_location', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.currentPlayerLocation)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.next_action)
            switch(data.next_action) {
                case "roll again":
                    this.startPlayerTurn("roll-again-prompt");
                    break;
                case "next player turn":
                    this.startPlayerTurn();
                    break;
                case "ask question hq":
                    console.log(data.color);
                    const question = this.fetchQuestion(data.color);
                    console.log(question);
                    document.getElementById('question').innerText = question.question;
                    sessionStorage.setItem('currentAnswer', question.answer);
                    break;
                case "ask question center":
                    this.displayInGameMessage("choose-category-prompt");
                    this.displayCategoryChoices();
                    break;
                case "ask winning question":
                    this.displayInGameMessage("opponents-choose-category-prompt");
                    this.displayCategoryChoices();
                    break;
        }
    }
    }
    fetchCategoryColors() {
        fetch('/get_category_colors')
        .then(response => response.json())
        .then(data => createCategoryButtons(data))
        .catch(error => console.error('Error fetching categories:', error));
    }

    createCategoryButtons(categories) {
        const container = document.getElementById('category-select-container');
        const prompt = document.createElement('p');
        prompt.textContent = `${playerName}, choose a category.`;
        container.appendChild(prompt);

        Object.entries(categories).forEach(([color, name]) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.classList.add('category-button');
            button.style.backgroundColor = color;
            button.onclick = () => alert(`Category ${name} selected`);
            container.appendChild(button);
        });
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

        if (messageType === "roll-again-prompt") {
            const msg = `${this.currentPlayerName}, roll the die again!`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        if (messageType === "select-dest-prompt") {
            const msg = `${this.currentPlayerName}, where will you move your token?<br>Click a highlighted square.`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        if (messageType === "") {  // Clear
            document.getElementById("player-prompt-text").innerHTML = "";
        }

        /* TODO: For MINIMAL - Add messages for HQ, Trivial Compute squares, winning */

    }

    /* TODO: For TARGET - Finish displayPopup */
    displayPopUp(message) {
    // For exiting the game early, or when player wins to play again
    }

    /* TODO: For MINIMAL - Finish displayTriviaQuestion */
    displayTriviaQuestion() {

    }

    /* TODO: For MINIMAL - Finish displayTriviaAnswer */
    displayTriviaAnswer() {

    }
}
