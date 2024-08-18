class Lambda {

    constructor(lambdaId, speechBubbleId="") {
        this.lambda = document.getElementById(lambdaId);
        if (speechBubbleId !== "") {
            this.speechBubble = document.getElementById(speechBubbleId);
            console.log("Speech bubble set");
        }
    }

    changeMood(mood) {
        if (mood === "happy") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-happy.png')";
        } else if (mood === "neutral") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-neutral.png')";
        } else if (mood === "sad") {
            this.lambda.style.backgroundImage = "url('static/images/lambda-sad.png')";
        }
    }

    updateSpeechBubbleText(message) {
        this.speechBubble.innerText = message;
        this.speechBubble.style.padding = "20px";
    }

    slideIn() {
        this.lambda.style.animation = "slideIn 1.5s ease-out forwards";
    }

    slideOut() {
        this.lambda.style.animation = "slideOut 1.5s ease-in forwards";
    }

    reactToInvalidPlayerInputs() {
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please add at least one player to the Player Input Table.");
    }

    reactToInvalidCategoryInputs() {
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please select four categories in the Category Input Table.");
    }

    reactToAllInvalidInputs() {
        this.changeMood("neutral");
        this.updateSpeechBubbleText("Please add at least one player to the Player Input Table. And select four categories in the Category Input Table!");
    }

    reactToSuccess(callback) {
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
}