class Die {
// Class for the die rolled during the game

    constructor(elementId) {
    // Attaches JavaScript class to the die on the screen
        this.element = document.getElementById(elementId);
    }

    function roll() {
    // Function to simulate rolling dice visually

        this.display("Rolling...");

        setTimeout(() => {
            dieValue = Math.floor(Math.random() * 6) + 1; // Roll die from 1 to 6
            this.display(dieValue);
        }, 1000); // Simulate die roll delay for 1 second
    }

    function displayValue(value) {
    /// Displays the given value
        this.element.textContent = value;
    }
}
