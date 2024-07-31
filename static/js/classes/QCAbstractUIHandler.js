class AbstractUIHandler {
// Simulating an abstract class

    constructor() {
        if (new.target === Shape) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }

    initializeScreen() {
        throw new Error("Method 'initializeScreen()' must be implemented.");
    }

    populateDropDown(dropdown, options) {
        // Communicate with DBManager class to get values for dropdown
        throw new Error("Method 'populateDropdown()' must be implemented.");
    }

    addBlankOption(selectElement) {
    // Add blank option to dropdowns as default

        const blankOption = document.createElement('option');
        blankOption.value = "";
        blankOption.textContent = "Select a category";
        blankOption.disabled = true;
        blankOption.selected = true;
        selectElement.appendChild(blankOption);
    }

    displayPopUp() {
        throw new Error("Method 'displayPopup()' must be implemented.");
    }

    validateInputs() {
        throw new Error("Method 'validateInputs()' must be implemented.");
    }

    collectInputs() {
        // Save inputs from table to do stuff with
        throw new Error("Method 'collectInputs()' must be implemented.");
    }

    sendToServer(endpoint, data) {
        throw new Error("Method 'sendToServer()' must be implemented.");
    }
}
