class GameUIController {

    constructor() {
    // Create new GameUIController object
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
        console.log("Clearing score windows");
        const scoreSquares = document.querySelectorAll(".score-square");
        scoreSquares.forEach(square => {square.style.background = "white";});
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
            console.log(`Adding ${category[1]}`);
            const categoryCell = document.getElementById(`${category[0]}-row`);
            categoryCell.textContent = category[1];
        });
        const categoryButtons = document.querySelectorAll(".category-button");
        categoryButtons.forEach(category => {
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

    async fetchNextAction(nextLoc) {
    // Get the game logic that should execute based on player's destination
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
    // Get coordinates of each square from player's current location to destination
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
    // Get player's token location
        if (start) {
            return [4,4];
        } else {
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

                // Reset all rows in Turn Order table to white and highlight new current player
                const rows = document.querySelectorAll('#player-table tbody tr');
                rows.forEach(row => {
                    row.style.background = 'white';
                });
                document.getElementById(`${data.token_color}-player-row`).style.background = "#8fe1ff";

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
    // Save player's name, token location, token color, and whether or not they can win
        this.currentPlayer = {
            "name": data.name,
            "location": data.token_location,
            "color": data.token_color,
            "hasAllColors": data.all_colors_earned
        }
    }

    executeNextAction(next_action, color, isCenter = false) {
    // Execute the game logic based on the player's location
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
                if(!isCenter) {
                    this.currentPlayer.canWin = false;
                    console.log(`Player landed on ${color} Category HQ`);
                }
                const question = this.fetchQuestion(color);
                sessionStorage.setItem('currentAnswer', question.answer);

                // Display question
                document.getElementById('question-text').innerText = question.question;
                document.getElementById('question-window').style.border = `4px solid ${color}`;
                break;
            case "ask question center":
                console.log("Player landed on center square")
                this.displayInGameMessage("choose-category-prompt");
                if (this.currentPlayer.hasAllColors) {
                    this.currentPlayer.canWin = true;
                    console.log("current player can win");
                }
                this.triviaManager.displayCategoryChoices();
                break;
            case "ask winning question":
                if (this.currentPlayer.hasAllColors) {
                    this.currentPlayer.canWin = true;
                    console.log("current player can win");
                }
                console.log("Asking the winning question...")
                console.log(this.currentPlayer.canWin);
                this.displayInGameMessage("opponents-choose-category-prompt");
                this.displayCategoryChoices();
                break;
        }
    }

    displayInGameMessage(messageType) {
        // Display messages on the screen
        let msg = "";
        const playerColor = capitalizeFirstLetter(this.currentPlayer.color);
        switch (messageType) {
            case "first-turn":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name} (${playerColor}), you're first.\nClick the "Roll Die" button to roll the the die!`;
                break;
            case "roll-die-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name} (${playerColor}), roll the the die!`;
                break;
            case "roll-again-prompt":
                this.lambda.changeMood("happy");
                msg = `${this.currentPlayer.name} (${playerColor}), roll the die again!`;
                break;
            case "select-dest-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name} (${playerColor}), where will you move your token? Click a highlighted square.`;
                break;
            case "correct-answer":
                let color = sessionStorage.getItem('currentColor');
                this.checkWin
                msg = `${this.currentPlayer.name} (${playerColor}) earned ${color}! Roll the die again.`;
                break;
            case "wrong-answer":
                this.lambda.changeMood("sad");
                msg = `Sorry, wrong answer! ${this.currentPlayer.name} (${playerColor}), it's your turn now. Roll the die!`;
                break;
            case "choose-category-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name} (${playerColor}), select a category.`;
                break;
            case "opponents-choose-category-prompt":
                this.lambda.changeMood("neutral");
                msg = `${this.currentPlayer.name} (${playerColor}), answer correctly and you win. Opponents, select a category.`;
                break;
            case "win-dialog":
                this.lambda.changeMood("happy");
                msg = `Game over! The winner is ${this.currentPlayer.name} (${playerColor}). Click "Play Again" to restart or "Exit Game" at the top to leave.`;
                const okButton = document.getElementById('ok-button');
                okButton.style.display = "block";
                okButton.innerText = "Play Again";
                okButton.addEventListener('click', () => {
                    console.log("Player chose to reset game");
                    this.resetGame();
                });
                break;
            case "category-hq-prompt":
                this.lambda.changeMood("happy");
                msg = `${this.currentPlayer.name} (${playerColor}), here is your ${category} question!<br>Answer the question, then click the "Show Answer" button.`;
                break;
            case "verify-answer-prompt":
                this.lambda.changeMood("neutral");
                msg =  `Opponents, is ${this.currentPlayer.name} (${playerColor}) correct? Click the 'Correct' or 'Not Correct' button.`
                break;
            case "":
                msg = "";
                break;
        }

        document.getElementById("player-prompt-text").innerHTML = msg;

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    async resetGame() {
    // Resets players scores and token locations
         console.log("Resetting...");
         const response = await fetch('/reset_game', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            this.initializeGameScreen();
        }
    }
}
