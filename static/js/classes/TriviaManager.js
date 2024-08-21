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
            console.log("clicked answer button");
            this.displayTriviaAnswer();
            this.toggleButtonEnabled("show-answer-button", false);
            this.toggleButtonEnabled("correct-button", true);
            this.toggleButtonEnabled("incorrect-button", true);
            this.gameUIController.displayInGameMessage("verify-answer-prompt");
        });

        // Correct button event listener
        const correctButton = document.getElementById("correct-button");
        correctButton.addEventListener('click', () => {
            console.log("clicked correct button");
            console.log(`${this.gameUIController.currentPlayer.hasAllColors}`)
            console.log(`Player can win: ${this.gameUIController.currentPlayer.canWin}`);
            if (this.gameUIController.currentPlayer.canWin) {
                console.log("Player wins");
                this.gameUIController.displayInGameMessage("win-dialog");
            } else {
                this.gameUIController.displayInGameMessage("correct-answer");
                this.gameUIController.updatePlayerScore();
                this.gameUIController.startPlayerTurn(false);
            }
            // Remove buttons and clear answer

            this.hideContent();
            this.clearCardContent();
            this.toggleButtonEnabled("correct-button", false);
            this.toggleButtonEnabled("incorrect-button", false);
        });

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
        console.log(buttonId);
        console.log(document.getElementById(buttonId));
        document.getElementById(buttonId).disabled = (!enabled);
    }

     // Slide up the decorative card and reveal the content card
    revealContent() {
        this.decorativeCard.classList.remove('slide-down');
        this.decorativeCard.classList.add('slide-up');
    }

    hideContent() {
        this.flipCard();
        console.log("flipped back");
        this.decorativeCard.classList.remove('slide-up');
        this.decorativeCard.classList.add('slide-down');
    }

    // Flip the content card
    flipCard() {
        this.contentCard.classList.toggle('flipped');
    }

    displayTriviaQuestion(data, color) {
    // Clear previous content
    //this.clearCardContent();

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
    // Clear previous content
    //this.clearCardContent();

    // Set answer text
    const answer = sessionStorage.getItem('currentAnswer');
    this.answerContent.innerText = answer;
    console.log(this.answerContent.innerText);


    // Flip the card to show the answer
    this.flipCard();
}

clearCardContent() {
    // Clear text from both sides
    console.log("clearing");
    this.questionContent.innerText = '';
    this.answerContent.innerText = '';
}


    displayCategoryChoices() {

        const buttons = document.querySelectorAll('.category-button');


        buttons.forEach(button => {
            button.removeEventListener('click', this.handleCategoryButtonClick);
            button.style.pointerEvents = 'auto'; // Ensure buttons are clickable
            button.style.cursor = "pointer";
            button.disabled = false;
        });

        buttons.forEach(button => {
            button.addEventListener('click', this.handleCategoryButtonClick.bind(this));
        });
    }

    handleCategoryButtonClick(event) {
        const button = event.target;
        let buttonColor = button.id.split('-')[0];
        if (this.gameUIController.currentPlayer.canWin) {
            this.gameUIController.executeNextAction("ask winning question from category", buttonColor);
        } else {
            this.gameUIController.executeNextAction("ask question from category", buttonColor);
        }
        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(button => {button.disabled = true;});
    }

}