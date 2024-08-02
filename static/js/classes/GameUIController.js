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
    }

    async initializeGameScreen() {
    // Set up the game screen

        console.log("Fetching player information from GSM");
        await this.fetchPlayers();
        console.log("Displaying player names in score window");
        this.displayPlayerNames();
        console.log("Adding categories");
        this.createCategoryButtons();
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
            console.log(`Adding ${player.name}`)
            let listItem = document.createElement('li');
            listItem.innerText = `${playerNum}. ${player.name} (${player.token_color})`;
            playersList.appendChild(listItem);
            playerNum++;
//            document.createElement(`${player.token_color}-player`);
//            document.createElement(`${player.token_color}-player`).innerText = player.name;
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
            this.displayTriviaQuestion(data, color);
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

    startPlayerTurn(showPrompt, prompt="roll-die-prompt") {
    // Start turn for current player

        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                console.log("showPrompt:", showPrompt);
                console.log("prompt:", prompt);
                document.getElementById('current-player').innerText = data.name;
                this.currentPlayerName = data.name;
                this.currentPlayerLocation = data.token_location;
                this.currentPlayerColor = data.token_color;
                this.moveHandler.setCurrentPlayerTokenId(data.token_color);
                if (showPrompt) {
                    console.log("Printing message");
                    this.displayInGameMessage(prompt);
                }
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
                    this.startPlayerTurn(true, "roll-again-prompt");
                    break;
                case "next player turn":
                    console.log("Next player's turn");
                    this.startPlayerTurn(true);
                    break;
                case "ask question hq":
                    console.log(data.color);
                    const question = this.fetchQuestion(data.color);
                    console.log(question);
                    document.getElementById('question-text').innerText = question.question;
                    sessionStorage.setItem('currentAnswer', question.answer);
                    document.getElementById('question-container').style.border = "2px solid data.color";
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
    }}

     async updateCurrentPlayer() {
        const response = await fetch('/update_current_player', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            console.log(response);
        }
    }


    async fetchCategoryColors() {
        const response = await fetch('/get_category_colors');
        const data = await response.json();
        console.log("Successfully fetched category colors from GSM");
        console.log(Array.isArray(data));
        return data;
    }

    async createCategoryButtons() {
        const categories = await this.fetchCategoryColors();
        console.log(categories);
        categories.forEach(category => {
            document.getElementById(`${category[0]}-category`).innerText = category[1];
        });
    }

    /* TODO: For MINIMAL - Finish updatePlayerScore */
    async updatePlayerScore() {
        let newCategoryColor = sessionStorage.getItem('currentColor');
        const response = await fetch('/update_player_score', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({color: newCategoryColor})
        });
      if (response.ok) {
        const data = await response.json();
        if (response.player_won === true) {
            //this.showWinDialog();
        } else {
            console.log(`${this.currentPlayerColor}-${newCategoryColor}-score-square`);
            const fillSquare = document.getElementById(`${this.currentPlayerColor}-${newCategoryColor}-score-square`);
            fillSquare.style.background = newCategoryColor;
        }
      }
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
            const msg = `${this.currentPlayerName}, where will you move your token? Click a highlighted square.`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        if (messageType === "correct-answer"){
            let color = sessionStorage.getItem('currentColor');
            const msg = `${this.currentPlayerName} earned ${color}! Roll the die again.`
            document.getElementById("player-prompt-text").innerHTML = msg;
        }

        if (messageType === "wrong-answer"){
            let oldPlayer = sessionStorage.getItem('oldPlayerName');
            const msg = `Sorry, ${oldPlayer}! ${this.currentPlayerName}, it is your turn. Roll the die!`
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
    displayTriviaQuestion(data, color) {
        document.getElementById('question-text').innerText = data.question;
        sessionStorage.setItem('currentAnswer', data.answer);
        sessionStorage.setItem('currentColor', color);
        const container = document.getElementById('question-window');

        const answerButton = document.createElement("div");
        answerButton.classList.add("button");
        answerButton.id = "showAnswerButton";
        answerButton.innerText = "Show Answer";
        answerButton.addEventListener('click', () => this.displayTriviaAnswer());
        container.appendChild(answerButton);

    }

    /* TODO: For MINIMAL - Finish displayTriviaAnswer */
    displayTriviaAnswer() {
        console.log("Showing answer");
        let correctAnswer = sessionStorage.getItem('currentAnswer');
        document.getElementById('question-text').innerText = correctAnswer;
        document.getElementById("showAnswerButton").remove()
        const correctButton = document.createElement("div");
        correctButton.classList.add("button");
        correctButton.innerText = "Correct";
        const incorrectButton = document.createElement("div");
        incorrectButton.classList.add("button");
        incorrectButton.innerText = "Not Correct";
        const container = document.getElementById('answer-button-window');
        correctButton.addEventListener('click', () => {
            this.displayInGameMessage("correct-answer");
            this.updatePlayerScore();
            incorrectButton.remove();
            correctButton.remove();
            document.getElementById('question-text').innerText = "";
        });
        incorrectButton.addEventListener('click', () => {
            sessionStorage.setItem("oldPlayerName", this.currentPlayerName);
            this.displayInGameMessage("wrong-answer");
            this.updateCurrentPlayer();
            console.log("Going to next player after incorrect answer");
            this.startPlayerTurn(false);
            incorrectButton.remove();
            correctButton.remove();
            document.getElementById('question-text').innerText = "";
        });
        container.appendChild(correctButton);
        container.appendChild(incorrectButton);
    }
}
