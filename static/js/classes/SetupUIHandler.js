class SetupUIHandler {

    constructor() {
        this.playerList = []
        this.categoryList = []

        this.playerForm = document.getElementById("playerForm");
        this.categoryForm = document.getElementById("categoryForm");
        this.playButton = document.getElementById("playButton");
        this.lambda = new Lambda("lambda", "speech-bubble");
        console.log(this.lambda);
    }

    initializeSetupScreen() {
        console.log("initialize");
        const categorySelects = document.querySelectorAll(".category-dropdown");

        fetch("/get_categories")  // Get categories from the database for dropdowns
            .then(response => response.json())
            .then(data => {console.log(data); this.populateDropdown(data)})
            .catch(error => {console.error("Error fetching categories:", error)
        });

        categorySelects.forEach(select => {
            select.addEventListener('change', () => this.updateDropdownOptions(categorySelects));
        });

        const toggleButton = document.getElementById('toggle-sidebar');
        const sidebar = document.getElementById('sidebar');

        if (toggleButton && sidebar) {
            toggleButton.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        } else {
            console.error('Elements not found');
        }

        this.playButton.addEventListener("click", () => {

            let playerInputsAreValid = false;
            const playerNames = playerForm.querySelectorAll('.player-name');
            playerNames.forEach(name => {
                if (name.value.trim() !== "") {
                    playerInputsAreValid = true;
                }
            });

            playerNames.forEach(name => {
                if (!playerInputsAreValid) {
                    name.classList.add('invalid');
                    name.setCustomValidity("Please add at least one player.");
                } else {
                    name.setCustomValidity("");
                    name.classList.remove('invalid');
                }
            });

            let allCategoryFieldsValid = true;
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
            console.log(this.lambda);
            if (!playerInputsAreValid && !allCategoryFieldsValid) {
                this.lambda.reactToAllInvalidInputs.bind(this.lambda)();
            } else if (!playerInputsAreValid) {
                this.lambda.reactToInvalidPlayerInputs.bind(this.lambda)();
            } else if (!allCategoryFieldsValid) {
                this.lambda.reactToInvalidCategoryInputs.bind(this.lambda)();
            } else {
                event.preventDefault();
                this.lambda.reactToSuccess(() => {
                    this.submitInputs()
                });
            }
        });
    }

    populateDropdown(options) {
    // Put categories from the database in each dropdown
        console.log("displaying dropdown");
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
        console.log("Saving category inputs");
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
            console.log(playerInputs);
            playerInputs.forEach(row => {
                const name = row.querySelector("input[name='player_name[]']").value.trim();
                const colorCellText = row.querySelector(".color-cell").textContent.trim();
                console.log(colorCellText);
                const tokenColor = colorCellText.toLowerCase();
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
                console.log("categories");
                console.log(this.categoryList);
            });
        } catch (error) {
            console.error("Error occurred with category inputs:", error);
        }
    }
}
