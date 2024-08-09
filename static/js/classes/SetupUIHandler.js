class SetupUIHandler {

    constructor() {
        this.playerList = []
        this.categoryList = []

        this.playerForm = document.getElementById("playerForm");
        this.categoryForm = document.getElementById("categoryForm");

        this.playButton = document.getElementById("playButton");
    }

    initializeSetupScreen() {

        const categorySelects = document.querySelectorAll(".category-dropdown");

        fetch("/get_categories")  // Get categories from the database for dropdowns
            .then(response => response.json())
            .then(data => {console.log(data); this.populateDropdown(data)})
            .catch(error => {console.error("Error fetching categories:", error)
        });

        categorySelects.forEach(select => {
            select.addEventListener('change', () => this.updateDropdownOptions(categorySelects));
        });

        this.playButton.addEventListener("click", function() {

            const playerNames = playerForm.querySelectorAll('.player-name');

            categorySelects.forEach(select => {
                if (select.value === "") {
                    allCategoryFieldsValid = false;
                    select.classList.add('invalid');
                    select.setCustomValidity("Please select a category.");
                } else {
                    select.setCustomValidity("");
                    select.classList.remove('invalid');
                }
            });

            if (allCategoryFieldsValid) {
                    event.preventDefault();
                    this.submitInputs();
                } else {
                    alert("Please complete all required fields.");
                }
            });
    }

    populateDropdown(options) {
    // Put categories from the database in each dropdown

        const dropdowns = document.querySelectorAll(".category-dropdown");

        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = "";
            this.addBlankOption(dropdown);  // Add blank
            options.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option;
                opt.textContent = option;
                dropdown.appendChild(opt);
            });
        });
    }

    addBlankOption(selectElement) {
        const blankOption = document.createElement('option');
        blankOption.value = "";
        blankOption.textContent = "";
        blankOption.disabled = true;
        blankOption.selected = true;
        selectElement.appendChild(blankOption);
    }

    updateDropdownOptions(selects) {

        console.log("updateDropdownOptions called for:", selects);

        const selectedValues = Array.from(selects)
            .map(select => select.value)
            .filter(val => val !== "");

        console.log("Selected values:", selectedValues);

        selects.forEach(select => {
            const currentSelection = select.value;
            const options = Array.from(select.options);

            options.forEach(option => {
                if (option.value === "" || option.value === currentSelection || !selectedValues.includes(option.value)) {
                    option.hidden = false;
                } else {
                    option.hidden = true;
                }
            });
        });
    }

    submitInputs() {
        // Saves player inputs and starts the game

        console.log("Saving player inputs");
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
            console.log("Got player inputs");
            console.log(playerInputs);
            playerInputs.forEach(row => {
                const name = row.querySelector("input[name='player_name[]']").value;
                const tokenColor = row.querySelector("select[name='token_color[]']").value;
                console.log(name);
                console.log(tokenColor);

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
                const catId = category.options[category.selectedIndex].text;
                const catName = category.options[category.selectedIndex].text;

                if (catId) {  // Initialize GameCategory objects
                    this.categoryList.push(catName);
                }
            });
        } catch (error) {
            console.error("Error occurred with category inputs:", error);
        }
    }
}
