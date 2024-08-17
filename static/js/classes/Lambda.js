class Lambda {

    constructor(lambdaId, speechBubbleId="") {
    // Creates Lambda character
        this.lambda = document.getElementById(lambdaId);
        if (speechBubbleId !== "") {
            this.speechBubble = document.getElementById(speechBubbleId);
        }
    }

    changeMood(mood) {
    // Changes image of Lambda character
        if (mood === "happy") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-happy.png')";
        } else if (mood === "neutral") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-neutral.png')";
        } else if (mood === "sad") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-sad.png')";
        }
    }

    updateSpeechBubbleText(message) {
    // Updates speech bubble text (for setup screen)
        this.speechBubble.innerText = message;
        this.speechBubble.style.padding = "20px";
    }

    reactToInvalidPlayerInputs() {
    // Data validation for no players entered on setup screen
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please add at least one player to the Player Input Table.");
    }

    reactToInvalidCategoryInputs() {
    // Data validation for fewer than four categories selected on setup screen
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please select four categories in the Category Input Table.");
    }

    reactToAllInvalidInputs() {
    // Data validation for no players entered and fewer than four categories selected on setup screen
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please add at least one player to the Player Input Table. And select four categories in the Category Input Table!");
    }

    reactToSuccess(callback) {
    // Actions that occur when user inputs are valid on setup screeny
        this.changeMood("happy");
        this.updateSpeechBubbleText("You're ready to play! Let's go!")

        // Ensure Lambda slides out and fades before transitioning
        this.lambda.classList.add('slide-out');
        this.speechBubble.classList.add('fade-out');

        setTimeout(() => {
            this.slideOut(callback);
            this.speechBubble.style.display = "none";
        }, 2000);

        this.lambda.addEventListener('animationend', () => {
            // Ensure animation completes before calling callback
            callback();
        }, { once: true });
    }

    slideOut() {
        this.lambda.style.animation = "slideOut 1.5s ease-in forwards";
        this.speechBubble.style.animation = "slideOut 1.5s ease-in forwards";
    }
}