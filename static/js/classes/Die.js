class Die {
// Class for the die rolled during the game

    constructor(elementId) {
    // Attaches JavaScript class to the die on the screen
        this.element = document.getElementById(elementId);
        console.log("Die initialized");
    }

    roll() {
    // Function to simulate rolling dice visually
        return new Promise((resolve) => {
            console.log("Rolling die");
            this.displayValue("Rolling...");

            setTimeout(() => {
                const dieValue = Math.floor(Math.random() * 6) + 1; // Roll die from 1 to 6
                this.displayValue(dieValue);
                resolve(dieValue); // Resolve the promise with the rolled value
            }, 1000); // Simulate die roll delay for 1 second
        });
    }

    displayValue(value) {
    /// Displays the given value
        this.element.textContent = value;
    }
}
