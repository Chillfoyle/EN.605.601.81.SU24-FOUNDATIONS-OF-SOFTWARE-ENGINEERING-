class Die {
// Class for the die rolled during the game

    constructor() {
    // Attaches JavaScript class to the die on the screen
        this.element = document.getElementById("die");
        console.log("Die initialized");
    }

    roll() {
    // Function to simulate rolling dice visually
        return new Promise((resolve) => {  // "Promise" so function waits for it to finish
            console.log("Rolling die");

            // Generate random values to rotate the die
            const randomFace = Math.floor(Math.random() * 6) + 1; // Random number from 1 to 6

            // Calculate the rotation angles needed to display the selected face
            const rotations = {
                1: { x: 0, y: 0 },
                6: { x: 180, y: 0, z: 180 },
                3: { x: -90, y: 0 },
                2: { x: 90, y: 0 },
                5: { x: 0, y: 90 },
                4: { x: 0, y: -90 }
            };

            // Apply the spin animation
            this.element.classList.add('spin');

            // Wait for the animation to complete before setting the final rotation
            setTimeout(() => {
                const { x, y, z } = rotations[randomFace] || { x: 0, y: 0, z: 0 };
                this.element.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

                // Optional: Display the rolled value
                console.log(`Rolled: ${randomFace}`);

                // Remove the spin class after animation ends
                setTimeout(() => this.element.classList.remove('spin'), 600);

                resolve(randomFace); // Resolve the promise with the rolled value
            }, 600); // Match animation duration
        });
    }
}
