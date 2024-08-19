class GameUIController {

    constructor() {
    // Create new GameUIController object
        console.log("UI initialized")
        this.moveHandler = new MoveHandler(this);
        this.triviaManager = new TriviaManager(this);
        this.lambda = new Lambda("lambda", "");

        const self = this;
        this.clickCount = 0;

        window.onload = function() {
            const promptText = document.getElementById('player-prompt-text');
            const okButton = document.getElementById('ok-button');

            // Wait for the slide-in animation to finish before showing the message
            this.lambda.addEventListener('animationend', function() {
                // Display Lambda's message
                console.log("starting");
                self.lambda.changeMood("happy");
                promptText.innerText = "Hi again! It's me, Lambda.\nLet's play Trivial Compute!";

                // Show the OK button after the message is shown
                okButton.style.display = 'block';

                // Add click event to the OK button
                okButton.addEventListener('click', function () {
                    if(self.clickCount === 0) {
                        self.lambda.changeMood("neutral");
                        promptText.innerText = "Click the 'Show/Hide Instructions' Button\nat the top of the screen to read the rules.";
                        self.clickCount = self.clickCount + 1;
                    } else if (self.clickCount === 1) {
                        self.lambda.changeMood("happy");
                        promptText.innerText = "Or, just keep your eyes on me. I'll tell you what to do! Press START to begin.";
                        okButton.innerText = "START";
                        self.clickCount = self.clickCount + 1;
                    } else {
                        self.initializeGameScreen();
                        self.setUpEventListeners();
                        okButton.style.display = "none";
                    }
                });
            });

        // Enable instructions toggle

        // Instructions toggle button event listener
        const instructionsContainer = document.querySelector('.instructions-container');
        const toggleButton = document.getElementById('toggle-instructions');
        toggleButton.addEventListener('click', () => {
            instructionsContainer.classList.toggle('instructions-visible');
        });

        // Event listener to load instructions text from instructions.html
        document.getElementById('toggle-instructions').addEventListener('click', function() {
            const instructionsDiv = document.getElementById('instructions');
            if (!instructionsDiv.classList.contains('active')) {
                fetch('/instructions')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    instructionsDiv.innerHTML = data;
                    instructionsDiv.classList.add('active');
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            } else {
                instructionsDiv.classList.remove('active');
            }
        });
    }

        // Enable exit game button
        const exitButton = document.getElementById("exit-button");
        const exitPopup = document.getElementById('exit-popup');
        const confirmExitButton = document.getElementById('confirm-exit');
        const cancelExitButton = document.getElementById('cancel-exit');

        // Show the popup when "Exit Game" is clicked
        exitButton.addEventListener('click', function() {
            exitPopup.style.display = 'flex';
        });

        // Handle the "Yes" button click (exit the game)
        confirmExitButton.addEventListener('click', function() {
            // Logic to exit the game
            window.location.href = '/'; // Redirect to an exit page or close the tab
        });

        // Handle the "No" button click (close the popup)
        cancelExitButton.addEventListener('click', function() {
            exitPopup.style.display = 'none';
        });
    }

    // Initialization functions

    setUpEventListeners() {
    // How to handle button clicks

        // Die roll event listener
        document.getElementById("rollDieButton").addEventListener('click', () => {
            this.moveHandler.toggleDieEnabled(false);
            this.moveHandler.handleDieRoll();
        });

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
        const tokens = document.querySelectorAll(".token");
        tokens.forEach(token => token.remove());
        this.players.forEach(player => {this.moveHandler.initializeToken(player)});
        console.log("Tokens placed on start. Starting the game");
        this.startPlayerTurn(true, prompt="first-turn");
    }

    displayPlayerNames() {
    // Display player names in list and in score windows
       const playerTable = document.querySelector('#player-table tbody');
       playerTable.innerHTML = '';
        this.players.forEach(player => {
            console.log(`Adding ${player.name}`);
            const row = document.createElement("tr");
            const playerNameCell = document.createElement("td");
            row.id = `${player.token_color}-player-row`;
            playerNameCell.textContent = `${player.name} (${player.token_color})`;
            row.appendChild(playerNameCell);
            playerTable.appendChild(row);
            document.getElementById(`${player.token_color}-player`).innerText = player.name;
        });
        console.log("Successfully displayed player names on screen");
    }

    async createCategoryButtons() {
    // Create the labels for the four categories that will also become buttons
        const categories = await this.fetchCategoryColors();
        categories.forEach(category => {
            console.log(`Adding ${category[1]}`);
            const categoryCell = document.getElementById(`${category[0]}-row`);
            categoryCell.textContent = category[1];
        });
        const categoryButtons = document.querySelectorAll(".category-button");
        console.log(categoryButtons);
        categoryButtons.forEach(category => {
            console.log("disabling button");
            category.disabled = true;
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
            const categories = await this.fetchCategoryColors();
            const categoryName = getCategoryNameByColor(categories, color);

            function getCategoryNameByColor(categories, color) {
                // Use the find method to search for the category name by its color
                const category = categories.find(item => item[0] === color);
                return category[1];
            }

            this.displayInGameMessage("category-hq-prompt", categoryName);
            this.triviaManager.displayTriviaQuestion(data, color);
        } else {
            console.error("Failed to fetch question from server");
        }
    }

    async fetchValidDestinations(dieValue) {
    // Get set of valid coordinates for player's next move
        console.log("Fetching valid destinations");
        console.log("Location: ", this.currentPlayer.location);
        console.log("Die Value: ", dieValue);

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
            console.log("Successfully fetched valid moves from GSM");
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

    async fetchNextAction(nextLoc) {
        const response = await fetch('/get_next_action', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nextLoc)
        });

        if (response.ok) {
            const data = await response.json();
            this.executeNextAction(data.next_action, data.color);
        } else {
            console.error("Failed to fetch next action from server");
        }
    }

    async fetchTokenPath(currLocation, destLocation) {
        console.log(`Fetching token path from ${currLocation} to ${destLocation}`);

        const response = await fetch('/get_token_path', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({startLoc: currLocation, destLoc: destLocation})
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token path: ", data);
            return data;
        } else {
            console.error("Failed to fetch path from server");
        }
    }

    getCurrentPlayerLocation(start) {
        console.log("Running getCurrentPlayerLocation. Start: ", start);
        if (start) {
            console.log("Returning starting location");
            return [4,4];
        } else {
            console.log("Returning stored location");
            return this.currentPlayer.location;
        }
    }

    // Update functions

    async updateCurrentPlayerLocation(newRow, newCol) {
    // Update variables tracking current player location on client/server side
        console.log("Updating current player's location");
        console.log(`Players current location is ${this.currentPlayer.location}`);
        console.log(`New location is [${newRow}, ${newCol}]`);

        const currRow = this.currentPlayer.location[0];
        const currCol = this.currentPlayer.location[1];
        console.log("Saved currRow and currCol: ", this.currentPlayer.location);

        this.currentPlayer.location = [newRow, newCol];  // Update internally
        console.log("Updated current player location: ", this.currentPlayer.location);

        const response = await fetch('/update_current_player_location', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nextLocation: [newRow, newCol]})
        });

        if (response.ok) {
            const data = await response.json();
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
            console.log("Data from updating current player: ", data);
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
                console.log(`Current player data is set: ${data.name}`);
                console.log("Current player's location on turn start: ", this.currentPlayer.location);

                // Reset all rows in Turn Order table to white and highlight new current player
                const rows = document.querySelectorAll('#player-table tbody tr');
                rows.forEach(row => {
                    row.style.background = 'white';
                });
                document.getElementById(`${data.token_color}-player-row`).style.background = "#8fe1ff";

                this.moveHandler.setCurrentPlayerTokenId(data.token_color);
                this.moveHandler.toggleDieEnabled(true);
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
        console.log("Next action is: ", next_action, color)
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
                this.currentPlayer.canWin = false;
                console.log(`Player landed on ${color} Category HQ`);
                const question = this.fetchQuestion(color);
                sessionStorage.setItem('currentAnswer', question.answer);
                this.triviaManager.displayTriviaQuestion(question, color);
                break;
            case "ask question center":
                console.log("Player landed on center square")
                this.displayInGameMessage("choose-category-prompt");
                if (this.currentPlayer.hasAllColors) {
                    this.currentPlayer.canWin = true;
                }
                this.triviaManager.displayCategoryChoices();
                break;
            case "ask winning question":
                console.log("Asking the winning question...")
                this.displayInGameMessage("opponents-choose-category-prompt");
                this.triviaManager.displayCategoryChoices();
                break;
        }
    }

    displayInGameMessage(messageType, category=null) {
        // Display messages on the screen
        let msg = "";
        switch (messageType) {
            case "first-turn":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name}, you're first.\nClick the "Roll Die" button to roll the the die!`;
                break;
            case "roll-die-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name}, roll the the die!`;
                break;
            case "roll-again-prompt":
                this.lambda.changeMood("happy");
                msg = `${this.currentPlayer.name}, roll the die again!`;
                break;
            case "select-dest-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name}, where will you move your token? Click a highlighted square.`;
                break;
            case "correct-answer":
                this.lambda.changeMood("happy");
                let color = sessionStorage.getItem('currentColor');
                msg = `${this.currentPlayer.name} earned ${color}! Roll the die again.`;
                break;
            case "wrong-answer":
                console.log("Printing wrong answer message");
                this.lambda.changeMood("sad");
                msg = `Sorry, wrong answer! ${this.currentPlayer.name}, it's your turn now. Roll the die!`;
                break;
            case "choose-category-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name}, select a category.`;
                break;
            case "opponents-choose-category-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name}, answer correctly and you win. Opponents, select a category.`;
                break;
            case "win-dialog":
                console.log("Printing win message");
                this.lambda.changeMood("happy");
                msg = `Game over! The winner is ${this.currentPlayer.name}. Click "Play Again" to restart or "Exit Game" at the top to leave.`;
                const okButton = document.getElementById('ok-button');
                okButton.style.display = "block";
                okButton.innerText = "Play Again";
                okButton.addEventListener('click', function () {
                    this.resetGame();
                });
                break;
            case "":
                msg = "";
                break;
            case "category-hq-prompt":
                this.lambda.changeMood("happy");
                msg = `${this.currentPlayer.name}, here is your ${category} question!<br>Answer the question, then click the "Show Answer" button.`;
                break;
            case "verify-answer-prompt":
                this.lambda.changeMood("neutral");
                msg =  `Opponents, is ${this.currentPlayer.name} correct? Click the 'Correct' or 'Not Correct' button.`
                break;
        }
        document.getElementById("player-prompt-text").innerHTML = msg;
    }

    async resetGame() {
         const response = await fetch('/reset_game', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            this.initializeGameScreen()
        }
    }
}
