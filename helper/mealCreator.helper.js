
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
        document.getElementsByClassName('inspect-list')[0].classList.toggle('hide');

        const inspectionListTable = document.getElementById('mealInspectionListBody');

        // Add all the table rows for the ingredients
        recipe.ingredients.forEach(ingredient => {
            const ingredientRow = document.createElement('tr');

            // Meal name
            const nameCell = document.createElement('td');
            nameCell.textContent = ingredient.foodName;
            ingredientRow.appendChild(nameCell);

            // Check if calculatedMacro exists and then iterate over it
            if (ingredient && ingredient.calculatedMacro) {
                Object.keys(ingredient.calculatedMacro).forEach(macroKey => {
                    const cell = document.createElement('td');
                    cell.textContent = ingredient.calculatedMacro[macroKey].toPrecision(3);
                    ingredientRow.appendChild(cell);
                });
            }

            inspectionListTable.appendChild(ingredientRow);
        });

        const sumRow = document.createElement('tr');
        //total name
        const nameCell = document.createElement('td');
        nameCell.innerHTML = '<b>Recipe Total<b/>'
        sumRow.appendChild(nameCell);

        //add the summed macros for the 
        Object.keys(recipe.totalMacros).forEach(macroKey => {
            const cell = document.createElement('td');
            cell.innerHTML = '<b>' + recipe.totalMacros[macroKey].toPrecision(3) + '<b/>';
            sumRow.appendChild(cell);
        })

        inspectionListTable.appendChild(sumRow);

    });

    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');
    // Add future functionality here
    inspectCell.appendChild(inspectButton)
    row.appendChild(inspectCell);


    // Create an edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', () => {
        // Set modalType to 'edit'
        modalType = 'edit';

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

        deleteRecipe(recipe.name);
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