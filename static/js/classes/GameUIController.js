class GameUIController {

    constructor() {
    // Create new GameUIController object
        this.moveHandler = new MoveHandler(this);
        this.initializeGameScreen();
        this.setUpEventListeners();
    }

    // Initialization functions

    setUpEventListeners() {
    // How to handle button clicks
        document.getElementById("rollDieButton").addEventListener('click', () => this.moveHandler.handleDieRoll());
    }

    async initializeGameScreen() {
    // Set up the game screen
        console.log("Fetching player information from GSM");
        await this.fetchPlayers();
        console.log("Displaying player names in score window");
        this.displayPlayerNames();
        console.log("Adding category buttons to screen");
        this.createCategoryButtons();
        console.log("Showing current player name on screen");
        this.players.forEach(player => {this.moveHandler.initializeToken(player)});
        console.log("Tokens placed on start");
        this.startPlayerTurn(true);
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

    async createCategoryButtons() {
    // Create the labels for the four categories that will also become buttons
        const categories = await this.fetchCategoryColors();
        categories.forEach(category => {
            document.getElementById(`${category[0]}-category`).innerText = category[1];
        });
    }

    // Data retrieval functions

    async fetchPlayers() {
    // Get players' information from GSM
        const response = await fetch('/get_players');
        const data = await response.json();
        this.players = data;
        console.log("Successfully fetched player information from GSM");
    }

    async fetchCategories() {
    // Get categories from GSM
        const response = await fetch('/get_categories');
        const data = await response.json();
        console.log("Successfully fetched categories from GSM");
        return data;
    }

    async fetchQuestion(color) {
    // Get trivia question from GSM
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
            console.log("Successfully fetched question from GSM");
            this.displayTriviaQuestion(data, color);
        } else {
            console.error("Failed to fetch question from server");
        }
    }

    async fetchValidDestinations(dieValue) {
    // Get set of valid coordinates for player's next move
        const response = await fetch('/get_valid_destinations', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location: this.currentPlayer.location,
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

    async fetchCategoryColors() {
    // Get category colors from GSM
        const response = await fetch('/get_category_colors');
        const data = await response.json();
        console.log("Successfully fetched category colors from GSM");
        return data;
    }

    // Update functions

    async updateCurrentPlayerLocation(newRow, newCol) {
    // Update variables tracking current player location on client/server side
        this.currentPlayer.location = [newRow, newCol];  // Update internally
        const response = await fetch('/update_current_player_location', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.currentPlayer.location)
        });

        if (response.ok) {
            const data = await response.json();
            this.executeNextAction(data.next_action, data.color);
        }
    }

    async updateCurrentPlayer() {
    // Go to next player on the server side
        const response = await fetch('/update_current_player', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        if (response.ok) {
            const data = await response.json();
            this.setCurrentPlayerInfo(data.current_player);
            console.log("Current player updated");
        }
    }

    async updatePlayerScore() {
    // Update player's score on the server side and update display
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
            this.currentPlayer.hasAllColors = data.all_colors;
            console.log(`Player can win: ${this.currentPlayer.hasAllColors}`);

            // Fill the square in the player's score window with the category color
            console.log(`${this.currentPlayer.color}-${newCategoryColor}-score-square`);
            const fillSquare = document.getElementById(`${this.currentPlayer.color}-${newCategoryColor}-score-square`);
            fillSquare.style.background = newCategoryColor;
        }
    }

    // Game action functions

    startPlayerTurn(showPrompt, prompt="roll-die-prompt") {
    // Start turn for current player
        fetch('/get_current_player')
            .then(response => response.json())
            .then(data => {
                // Update internal variables
                this.setCurrentPlayerInfo(data);
                console.log(`Current Player: ${data.name}`);

                // Update screen
                document.getElementById('current-player').innerText = data.name;
                this.moveHandler.setCurrentPlayerTokenId(data.token_color);
                if (showPrompt) {  // Prompt user to roll die
                    this.displayInGameMessage(prompt);
                }
                console.log("Successfully started new player's turn");
            })
            .catch(error => console.error('Error fetching players:', error));
    }

    setCurrentPlayerInfo(data) {
        this.currentPlayer = {
            "name": data.name,
            "location": data.token_location,
            "color": data.token_color,
            "hasAllColors": data.all_colors_earned
        }
    }

    executeNextAction(next_action, color) {
        console.log("Next action is: ", )
        switch(next_action) {
            case "roll again":
                console.log("Current player will roll again");
                this.startPlayerTurn(true, "roll-again-prompt");
                break;
            case "next player turn":
                console.log("Next player's turn");
                this.startPlayerTurn(true);
                break;
            case "ask question from category":
                console.log(`Player landed on ${color} Category HQ`);
                const question = this.fetchQuestion(color);
                sessionStorage.setItem('currentAnswer', question.answer);

                // Display question
                document.getElementById('question-text').innerText = question.question;
                document.getElementById('question-window').style.border = `4px solid ${color}`;
                break;
            case "ask question center":
                console.log("Player landed on center square")
                this.displayInGameMessage("choose-category-prompt");
                this.displayCategoryChoices();
                break;
            case "ask winning question":
                console.log("Asking the winning question...")
                this.displayInGameMessage("opponents-choose-category-prompt");
                this.displayCategoryChoices();
                break;
        }
    }

    displayInGameMessage(messageType) {
        // Display messages on the screen
        let msg = "";
        switch (messageType) {
            case "roll-die-prompt":
                msg = `${this.currentPlayer.name}, roll the die!`;
                break;
            case "roll-again-prompt":
                msg = `${this.currentPlayer.name}, roll the die again!`;
                break;
            case "select-dest-prompt":
                msg = `${this.currentPlayer.name}, where will you move your token? Click a highlighted square.`;
                break;
            case "correct-answer":
                let color = sessionStorage.getItem('currentColor');
                this.checkWin
                msg = `${this.currentPlayer.name} earned ${color}! Roll the die again.`;
                break;
            case "wrong-answer":
                console.log("Printing wrong answer message");
                msg = `Sorry, wrong answer! ${this.currentPlayer.name}, it is your turn. Roll the die!`;
                break;
            case "choose-category-prompt":
                msg = `${this.currentPlayer.name}, select a category.`;
                break;
            case "opponents-choose-category-prompt":
                msg = `Opponents of ${this.currentPlayer.name}, select a category.`;
                break;
            case "win-dialog":
                console.log("Printing win message");
                msg = `Game over! The winner is ${this.currentPlayer.name}`;
                break;
            case "":
                msg = "";
                break;
        }
        document.getElementById("player-prompt-text").innerHTML = msg;
    }

    /* TODO: For TARGET - Finish displayPopup */
    displayPopUp(message) {
    // For exiting the game early, or when player wins to play again
    }

    displayTriviaQuestion(data, color) {
    // Display a trivia question
        console.log("Showing question");

        // Save color and answer
        sessionStorage.setItem('currentAnswer', data.answer);
        sessionStorage.setItem('currentColor', color);

        // Print question text
        document.getElementById('question-text').innerText = data.question;

        // Remove any existing answer buttons
        const existingButton = document.getElementById('showAnswerButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Add Show Answer button
        const container = document.getElementById('question-window');
        const answerButton = document.createElement("div");
        answerButton.classList.add("button");
        answerButton.id = "showAnswerButton";
        answerButton.innerText = "Show Answer";
        answerButton.addEventListener('click', () => {this.displayTriviaAnswer()});
        container.appendChild(answerButton);
    }

    displayTriviaAnswer() {
        console.log("Showing answer");

        // Reveal answer and remove Show Answer button
        let correctAnswer = sessionStorage.getItem('currentAnswer');
        document.getElementById('question-text').innerText = correctAnswer;
        document.getElementById("showAnswerButton").remove()
        console.log("Show Answer button removed");

        const container = document.getElementById('answer-button-window');

        // Add Correct button
        const correctButton = document.createElement("div");
        correctButton.classList.add("button");
        correctButton.innerText = "Correct";
        correctButton.addEventListener('click', () => {
            console.log(`Player can win: ${this.currentPlayer.hasAllColors}`);
            if (this.currentPlayer.hasAllColors) {
                console.log("Player wins");
                this.displayInGameMessage("win-dialog");
            } else {
                this.displayInGameMessage("correct-answer");
                this.updatePlayerScore();
            }
            // Remove buttons and clear answer
            incorrectButton.remove();
            correctButton.remove();
            document.getElementById('question-text').innerText = "";
            document.getElementById('question-window').style.border  = "none";
        });
        container.appendChild(correctButton);

        // Add Incorrect button
        const incorrectButton = document.createElement("div");
        incorrectButton.classList.add("button");
        incorrectButton.innerText = "Not Correct";
        incorrectButton.addEventListener('click', async () => {
            // Start new player's turn
            await this.updateCurrentPlayer();
            this.displayInGameMessage("wrong-answer");
            this.startPlayerTurn(false);

            // Remove buttons and clear answer
            incorrectButton.remove();
            correctButton.remove();
            document.getElementById('question-text').innerText = "";
            document.getElementById('question-window').style.border  = "none";
        });
        container.appendChild(incorrectButton);
    }

    displayCategoryChoices() {
        const buttons = document.querySelectorAll('.category-button');

        buttons.forEach(button => {
            button.removeEventListener('click', this.handleCategoryButtonClick);
            button.style.pointerEvents = 'auto'; // Ensure buttons are clickable
            button.style.cursor = "pointer";
        });

        buttons.forEach(button => {
            button.addEventListener('click', this.handleCategoryButtonClick.bind(this));
        });
    }

    handleCategoryButtonClick(event) {
        const button = event.target;
        let buttonColor = button.id.split('-')[0];
        this.executeNextAction("ask question from category", buttonColor);
        button.style.pointerEvents = 'none'; // Disable the button after click
    }
}
