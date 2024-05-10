
function showRecipes() {
    // Make a single API call
    fetch('/api/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log("recieved data: ",data);
            // Log the received data
            // Check if there are any recipes
            if (data) {

                console.log("recieved data: ", Object.values(data));
                Object.values(data).forEach(displayRecipes); // Call a function to display the recipes
            } else {
                console.log('No recipes found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error); // Log any errors that occur during the fetch operation
        });
}

function displayRecipes(recipe) {
    const list = document.getElementById('mealList');
    const row = document.createElement('tr');
    row.classList.add('recipe-row');

    // Set the background color based on the recipe type
    // if (recipe.type === 'beverage') {
    //     row.style.backgroundColor = '#99d9de'; // Blue for beverages
    // } else if (recipe.type === 'food') {
    //     row.style.backgroundColor = '#def6d8'; // Green for food
    // }

    // Add cells and data for the meal name, etc.
    addTableCell(row, recipe.name);
    addTableCell(row, recipe.totalNutrients.tEnergyKcal?.toFixed(2) || 'N/A');
    // addTableCell(row, recipe.date ? new Date(recipe.date).toLocaleDateString() : 'Unknown Date');
    addTableCell(row, recipe.ingredientCount);

    // Inspect, Edit, and Delete buttons with functionality
    // addInspectButton(row, recipe);
    // addEditButton(row, recipe);
    // addDeleteButton(row, recipe);


    // Create an Inspect button
    const inspectCell = document.createElement('td');
    const inspectButton = document.createElement('button');
    inspectButton.addEventListener('click', () => {
        console.log('inspecting', recipe);
        const modal = document.getElementsByClassName('inspect-list')[0];
        const isHidden = modal.classList.toggle('hide');

        modal.setAttribute('aria-hidden', isHidden);
        if (!isHidden) {
            modal.querySelector('button, input, select, textarea, a[href], area[href], iframe, object, embed, [tabindex="0"], [contenteditable]').focus();
        } else {
            inspectButton.focus();
        }


        const inspectionListTable = document.getElementById('mealInspectionListBody');

        // Add all the table rows for the ingredients
        recipe.ingredients.forEach(ingredient => {
            const ingredientRow = document.createElement('tr');

            // Meal name
            const nameCell = document.createElement('td');
            nameCell.textContent = ingredient.foodName || 'No name provided';  // Provide a default value
            ingredientRow.appendChild(nameCell);

            // Meal name
            const weightCell = document.createElement('td');
            weightCell.textContent = ingredient.quantity ? `${ingredient.quantity} g` : 'No data';
            ingredientRow.appendChild(weightCell);

            // Check if nutritionalValues exists and is an object before iterating over it
            if (ingredient && typeof ingredient.nutritionalValues === 'object' && ingredient.nutritionalValues !== null) {
                const nutrientsOfInterest = ['cDryMatter', 'cEnergyKcal', 'cEnergyKj', 'cFat', 'cFiber', 'cProtein', 'cWater'];
                nutrientsOfInterest.forEach(macroKey => {
                    const cell = document.createElement('td');
                    if (typeof ingredient.nutritionalValues[macroKey] === 'number') {
                        cell.textContent = ingredient.nutritionalValues[macroKey].toFixed(2);
                    } else {
                        cell.textContent = 'N/A';  // Handling missing or non-numeric data
                    }
                    ingredientRow.appendChild(cell);
                });
            } else {
                // If nutritionalValues is missing or invalid, fill in cells with 'N/A'
                const nutrientsOfInterest = ['cDryMatter', 'cEnergyKcal', 'cEnergyKj', 'cFat', 'cFiber', 'cProtein', 'cWater'];
                nutrientsOfInterest.forEach(() => {
                    const cell = document.createElement('td');
                    cell.textContent = 'N/A';
                    ingredientRow.appendChild(cell);
                });

            }

            // Append the completed row to the table body
            inspectionListTable.appendChild(ingredientRow);
        });

        // Sum row for total nutrients
        const sumRow = document.createElement('tr');
        sumRow.id = 'summaryRow';
        const totalNameCell = document.createElement('td');
        totalNameCell.innerHTML = '<b>Recipe Total</b>';  // Corrected closing tag
        sumRow.appendChild(totalNameCell);

        // Add the summed macros for the recipe
        const nutrientsOfInterest = ['aQuanity', 'aDryMatter', 'aEnergyKcal', 'aEnergyKj', 'aFat', 'aFiber', 'aProtein', 'aWater'];
        nutrientsOfInterest.forEach(macroKey => {
            const cell = document.createElement('td');
            if (recipe.totalNutrients && typeof recipe.aggregatedNutrients[macroKey] === 'number') {
                cell.innerHTML = `${recipe.aggregatedNutrients[macroKey].toFixed(2)}`;  // Corrected string formatting and closing tag
            } else {
                cell.innerHTML = '<b>N/A</b>';
            }
            sumRow.appendChild(cell);
        });

        inspectionListTable.appendChild(sumRow);


        const table = document.getElementById('summaryRow');
        // console.log(table);
        const lastRow = table.getElementsByTagName('td')[1];  // Gets the last <tr> in the table
        // console.log(lastRow);
        // const Quantity = parseFloat(recipe.aggregatedNutrientst.aQuanity) || 0;
        lastRow.innerHTML = `${recipe.aggregatedNutrients.aQuanity} g`



        const closeButton = document.querySelector('.modal-close-btn');
        closeButton.addEventListener('click', () => {
            const modal = document.getElementsByClassName('inspect-list')[0];
            modal.classList.add('hide');
            modal.setAttribute('aria-hidden', true);
            inspectButton.focus(); // Set focus back to the inspect button
            // Clear the content of the table within the modal
            clearModalTables();
        });
        function clearModalTables() {
            const tables = document.querySelectorAll('.inspect-list table tbody');
            tables.forEach(table => {
                table.innerHTML = '';  // Clear the contents of each table body
            });
        }
    });


    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');
    // Add future functionality here
    inspectCell.appendChild(inspectButton)
    row.appendChild(inspectCell);


    //  Create an edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', () => {
        // Set modalType to 'edit'
        modalType = 'edit';

        console.log(recipe);
        localStorage.setItem('ingredients', JSON.stringify(recipe.ingredients));
        // populate modal with recipe
        document.getElementById("nameInput").value = recipe.name;
        document.getElementById("typeSelect").value = recipe.mealType;
        document.getElementById("sourceInput").value = recipe.source;
        console.log('edit');
        //hide add button
        document.getElementById("addRecipe").classList.add('hide');
        document.getElementById("editRecipe").classList.remove('hide');

        recipe.ingredients.forEach((ingredient) => addItemToList(ingredient));
        document.getElementById('editRecipe').addEventListener('click', () => {
            let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            // Edit the recipe and set in local storage
            recipes.forEach(r => {
                if (r.name === recipe.name) {
                    r.name = document.getElementById("nameInput").value;
                    r.mealType = document.getElementById("typeSelect").value;
                    r.source = document.getElementById("sourceInput").value;
                }
            });

            localStorage.setItem('recipes', JSON.stringify(recipes));
        });

        document.getElementById('modal-wrapper').classList.toggle('hide');
    });

    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editCell.appendChild(editButton)
    row.appendChild(editCell);




    // Create a delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    // Add event listener for delete functionality
    deleteButton.addEventListener('click', function () {
        // Logic to handle recipe deletion

        deleteRecipe(recipe.mealID);
        row.remove();
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // Append the row to the list
    list.appendChild(row);
}

function addTableCell(row, text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
}

function deleteRecipe(mealID) {
    console.log("Deleting meal with ID:", mealID);

    const mealToDelete = JSON.stringify({ mealID });

    fetch('/api/deleteMeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: mealToDelete
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    // try {
    //     console.log("Deleting recipe:", mealID);
    //     let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    //     let recipeCounts = JSON.parse(localStorage.getItem('mealCounts')) || {};

    //     // Find index of the recipe to be deleted
    //     const recipeIndex = recipes.findIndex(recipe => recipe.name === recipeName);

    //     // If found, update the counter and remove the recipe
    //     if (recipeIndex > -1) {
    //         let identifier = getRecipeIdentifier(recipes[recipeIndex]);
    //         recipeCounts[identifier] = Math.max(0, (recipeCounts[identifier] || 0) - 1);

    //         // Remove the recipe from the array
    //         recipes.splice(recipeIndex, 1);


    //     }

    //     // Save the updated lists back to localStorage
    //     localStorage.setItem('recipes', JSON.stringify(recipes));
    //     localStorage.setItem('mealCounts', JSON.stringify(recipeCounts));

    //     console.log("Updated recipes after deletion:", recipes);
    //     refreshRecipeList();
    // } catch (error) {
    //     console.error("Error during recipe deletion:", error);
    // }
}