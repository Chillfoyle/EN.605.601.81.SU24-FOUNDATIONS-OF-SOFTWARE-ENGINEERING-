class TriviaManager {

    constructor(gameUIController) {
    // Create TriviaManager class
        this.gameUIController = gameUIController;
        this.decorativeCard = document.getElementById('decorative-card');
        this.contentCard = document.getElementById('content-card');
        this.questionContent = document.getElementById("content-question");
        this.answerContent = document.getElementById("content-answer");

        this.toggleButtonEnabled("show-answer-button", false);
        this.toggleButtonEnabled("correct-button", false);
        this.toggleButtonEnabled("incorrect-button", false);

        this.setButtonEventListeners()
    }

    setButtonEventListeners() {
        // Answer button event listener
        const answerButton = document.getElementById("show-answer-button");
        answerButton.addEventListener('click', () => {
            this.displayTriviaAnswer();
            this.toggleButtonEnabled("show-answer-button", false);
            this.toggleButtonEnabled("correct-button", true);
            this.toggleButtonEnabled("incorrect-button", true);
            this.gameUIController.displayInGameMessage("verify-answer-prompt");
        });

        // Correct button event listener
        const correctButton = document.getElementById("correct-button");
        correctButton.addEventListener('click', () => {
            console.log(this.gameUIController.currentPlayer.canWin);
            if (this.gameUIController.currentPlayer.canWin) {
                console.log("Player wins");
                this.gameUIController.displayInGameMessage("win-dialog");
            } else {
                this.gameUIController.displayInGameMessage("correct-answer");
                this.gameUIController.updatePlayerScore();
            }

            // Remove buttons and clear answer
            this.hideContent();
            this.clearCardContent();
            this.toggleButtonEnabled("correct-button", false);
            this.toggleButtonEnabled("incorrect-button", false);
        });

        // Incorrect button event listener
        const incorrectButton = document.getElementById("incorrect-button");
        incorrectButton.addEventListener('click', async () => {
            console.log("clicked incorrect button");
            // Start new player's turn
            await this.gameUIController.updateCurrentPlayer();
            this.gameUIController.displayInGameMessage("wrong-answer");
            this.gameUIController.startPlayerTurn(false);

            // Remove buttons and clear answer
            this.hideContent();
            this.clearCardContent();
            this.toggleButtonEnabled("correct-button", false);
            this.toggleButtonEnabled("incorrect-button", false);
        });

    }

    toggleButtonEnabled(buttonId, enabled) {
    // Enable or disable a button
        document.getElementById(buttonId).disabled = (!enabled);
    }

    revealContent() {
    // Slide up the decorative card and reveal the content card
        this.decorativeCard.classList.remove('slide-down');
        this.decorativeCard.classList.add('slide-up');
    }

    hideContent() {
    // Slide decorative card over content card
        this.flipCard();
        this.decorativeCard.classList.remove('slide-up');
        this.decorativeCard.classList.add('slide-down');
    }

    flipCard() {
    // Flip the content card
        this.contentCard.classList.toggle('flipped');
    }

    displayTriviaQuestion(data, color) {
        // Display a trivia question
        console.log("Showing question", data);

        // Save color and answer
        sessionStorage.setItem('currentAnswer', data.answer);
        sessionStorage.setItem('currentColor', color);

        // Set question text
        this.questionContent.innerText = data.question;
        document.getElementById('question-border').style.border = `4px solid ${color}`;
        document.getElementById('answer-border').style.border = `4px solid ${color}`;

        // Reveal the content and enable the answer button
        this.revealContent();
        this.toggleButtonEnabled("show-answer-button", true);
    }

    displayTriviaAnswer() {
    // Display answer on trivia card
        const answer = sessionStorage.getItem('currentAnswer');
        this.answerContent.innerText = answer;
        this.flipCard();
    }

    clearCardContent() {
    // Clear text from both sides of trivia card
        this.questionContent.innerText = '';
        this.answerContent.innerText = '';
    }

    displayCategoryChoices() {
    // Enable category selection buttons
        const buttons = document.querySelectorAll('.category-button');

        buttons.forEach(button => {
            button.removeEventListener('click', this.handleCategoryButtonClick);
            button.style.pointerEvents = 'auto';
            button.style.cursor = "pointer";
            button.disabled = false;
        });

        buttons.forEach(button => {
            button.addEventListener('click', this.handleCategoryButtonClick.bind(this));
        });
    }

    handleCategoryButtonClick(event) {
    // Handle selection of category when landing on center square
        const button = event.target;
        let buttonColor = button.id.split('-')[0];
        this.gameUIController.executeNextAction("ask question from category", buttonColor, true);
        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(button => {button.disabled = true;});
    }
}