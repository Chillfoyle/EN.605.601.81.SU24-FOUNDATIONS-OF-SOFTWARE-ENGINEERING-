class Die {
// Class for the die rolled during the game

    constructor() {
    // Attaches JavaScript class to the die on the screen
        this.element = document.getElementById("die");
        console.log("Die initialized");
    }

    roll() {
        return new Promise((resolve) => {
            console.log("Rolling die");

            // Generate random values to rotate the die
            const randomFace = Math.floor(Math.random() * 6) + 1; // Random number from 1 to 6

            // Define the rotation angles for each face
            const rotations = {
                1: { x: 0, y: 0, z: 0 },
                6: { x: 180, y: 0, z: 180 }, // Set z to 180 to prevent the 6 from flipping upside down
                3: { x: -90, y: 0, z: 0 },
                2: { x: 90, y: 0, z: 0 },
                5: { x: 0, y: 90, z: 0 },
                4: { x: 0, y: -90, z: 0 }
            };

            // Apply the initial spin (360 degrees on Z-axis)
            this.element.style.transform = `rotateZ(360deg)`;

            // Trigger the rotation to the correct face after a short delay
            setTimeout(() => {
                const { x, y, z } = rotations[randomFace];
                console.log(`Applying rotation: rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`);
                this.element.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
            }, 100);

            // Remove the spin class and resolve after the animation ends
            setTimeout(() => {
                resolve(randomFace); // Resolve the promise with the rolled value
            }, 600); // Match animation duration
        });
    }
}
