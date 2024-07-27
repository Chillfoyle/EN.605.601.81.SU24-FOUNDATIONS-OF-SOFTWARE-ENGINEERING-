class SetupUIHandler {

    constructor() {
        this.playerList = []
        this.categoryList = []
    }

    initializeSetupScreen() {
        fetch("/get_categories")  // Get categories from the database for dropdowns
            .then(response => response.json())
            .then(data => this.populateDropdown(data))
            .catch(error => {console.error("Error fetching categories:", error)});
    }

    populateDropdown(options) {
    // Put categories from the database in each dropdown

        const dropdowns = document.querySelectorAll(".dropdown");

        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = "";
            this.addBlankOption(dropdown);  // Add blank
            options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option.id;
                opt.textContent = option.name;
                dropdown.appendChild(opt);
            });
        });
    }

    addBlankOption(selectElement) {
        const blankOption = document.createElement('option');
        blankOption.value = "";
        blankOption.textContent = "Select a category";
        blankOption.disabled = true;
        blankOption.selected = true;
        selectElement.appendChild(blankOption);
    }

    submitInputs() {
        this.savePlayerInputs();
        this.saveCategoryInputs();

        fetch("/start_game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({players: this.playerList, categories: this.categoryList}),
        })
        .then(response => response.json())
        .then(data => {
             console.log("Inputs Submitted:", data);
             window.location.href = "/game";
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    savePlayerInputs() {
    // Stores player inputs

        try {  // Use player names and tokens to initialize Player objects
            const playerInputs = document.querySelectorAll("#playerTable tbody tr");

            playerInputs.forEach(row => {
                const name = row.querySelector("input[name='player_name[]']").value;
                const tokenColor = row.querySelector("select[name='token_color[]']").value;

                if (name && tokenColor) {  // Initialize Player object
                    this.playerList.push({name, tokenColor});
                }
            });
        } catch (error) {
            console.error("Error occurred with player inputs:", error);
        };
    }

    saveCategoryInputs() {
        // Use four categories to initialize GameCategory objects
        const categoryInputs = document.querySelectorAll("#categoryTable tbody tr");
        const selectedCategories = document.querySelectorAll("select[name='category[]'");

        try {
            selectedCategories.forEach(category => {
                const catId = category.value;
                const catName = category.options[category.selectedIndex].text;

                if (catId) {  // Initialize GameCategory objects
                    this.categoryList.push({catId, catName});
                }
            });
        } catch (error) {
            console.error("Error occurred with category inputs:", error);
        }
    }
}
