// import { stringify } from "yamljs";

function showRecipes() {
    // Udfører et enkelt API-kald til serveren for at hente opskrifter
    fetch('/api/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log("recieved data: ",data);
            // Log det hentede data
            // Check hvis der er opskrifter
            if (data) {

                console.log("recieved data: ", Object.values(data));
                Object.values(data).forEach(displayRecipes); // Kalder funktionen displayRecipes for hver opskrift
            } else {
                console.log('No recipes found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error); // Logger eventuelle fejl, der opstår under fetch operation
        });
}

function displayRecipes(recipe) {
    const list = document.getElementById('mealList'); // Få adgang til elementet, hvor opskrifter skal vises
    const row = document.createElement('tr');
    row.classList.add('recipe-row');

    // Set the background color based on the recipe type
    if (recipe.mealCategory === 'beverage') {
        row.style.backgroundColor = '#99d9de'; // Blue for beverages
    } else if (recipe.mealCategory === 'food') {
        row.style.backgroundColor = '#def6d8'; // Green for food
    }

    // Tilføj celler og data for opskriftens navn, kalorier m.m.
    addTableCell(row, recipe.name);
    addTableCell(row, recipe.totalNutrients.tEnergyKcal?.toFixed(2) || 'N/A');
    // addTableCell(row, recipe.date ? new Date(recipe.date).toLocaleDateString() : 'Unknown Date');
    addTableCell(row, recipe.ingredientCount);

    // Inspect, Edit, and Delete buttons with functionality
    // addInspectButton(row, recipe);
    // addEditButton(row, recipe);
    // addDeleteButton(row, recipe);


    // Opret en inspect knap
    const inspectCell = document.createElement('td');
    const inspectButton = document.createElement('button');
    inspectButton.addEventListener('click', () => {
        console.log('inspecting', recipe);
        const modal = document.getElementsByClassName('inspect-list')[0];
        const isHidden = modal.classList.toggle('hide');

        // Styr tilgængelighed baseret på om modalen er skjult eller ej
        modal.setAttribute('aria-hidden', isHidden);
        if (!isHidden) {
            // Fokuser på det første tilgængelige element i modalen
            modal.querySelector('button, input, select, textarea, a[href], area[href], iframe, object, embed, [tabindex="0"], [contenteditable]').focus();
        } else {
            // Fokuser tilbage på inspect knap
            inspectButton.focus();
        }

        // Referencer til elementet, der indeholder opskriftens detaljer
        const inspectionListTable = document.getElementById('mealInspectionListBody');

        // Tilføj alle tabelrækker for ingredienserne
        recipe.ingredients.forEach(ingredient => {
            const ingredientRow = document.createElement('tr');

            // Meal name
            const nameCell = document.createElement('td');
            nameCell.textContent = ingredient.foodName || 'No name provided';  // Provide a default value if not available
            ingredientRow.appendChild(nameCell);

            // Weight
            const weightCell = document.createElement('td');
            weightCell.textContent = ingredient.quantity ? `${ingredient.quantity} g` : 'No data';
            ingredientRow.appendChild(weightCell);

            // List of nutrients to display
            const nutrientsOfInterest = ['cDryMatter', 'cEnergyKcal', 'cEnergyKj', 'cFat', 'cFiber', 'cProtein', 'cWater'];

            // Append cells for each nutrient
            nutrientsOfInterest.forEach(nutrient => {
                const cell = document.createElement('td');
                if (ingredient[nutrient] !== undefined && ingredient[nutrient] !== null) {
                    cell.textContent = Number(ingredient[nutrient]).toFixed(2); // Convert to Number to ensure .toFixed(2) works even if data is a string
                } else {
                    cell.textContent = 'N/A';  // Display 'N/A' if nutrient data is missing
                }
                ingredientRow.appendChild(cell);
            });

            // Append the completed row to the table body
            inspectionListTable.appendChild(ingredientRow);
        });

        //     // Tilføj den færdige række til tabellen
        //     inspectionListTable.appendChild(ingredientRow);
        // });

        // Række for total næringsindhold
        const sumRow = document.createElement('tr');
        sumRow.id = 'summaryRow';
        const totalNameCell = document.createElement('td');
        totalNameCell.innerHTML = '<b>Recipe Total</b>';  // Corrected closing tag
        sumRow.appendChild(totalNameCell);

        // Tilføj summen af makronæringsstoffer for opskriften
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

        // Tilføj sumrækken til tabellen
        inspectionListTable.appendChild(sumRow);


        const table = document.getElementById('summaryRow');
        // console.log(table);
        const lastRow = table.getElementsByTagName('td')[1];  // får den sidste  <tr> i table
        // console.log(lastRow);
        // const Quantity = parseFloat(recipe.aggregatedNutrientst.aQuanity) || 0;
        lastRow.innerHTML = `${recipe.aggregatedNutrients.aQuanity} g`


        // Lukkefunktion for modalvinduet
        const closeButton = document.querySelector('.modal-close-btn');
        closeButton.addEventListener('click', () => {
            const modal = document.getElementsByClassName('inspect-list')[0];
            modal.classList.add('hide');
            modal.setAttribute('aria-hidden', true);
            inspectButton.focus(); // Sæt fokus tilbage på inspect button
            // Ryd tabelindholdet i modalen
            clearModalTables();
        });
        // Funktion til at rydde tabellerne i modalen
        function clearModalTables() {
            const tables = document.querySelectorAll('.inspect-list table tbody');
            tables.forEach(table => {
                table.innerHTML = '';  //Ryd indholdet i hver table body
            });
        }
    });


    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');

    inspectCell.appendChild(inspectButton)
    row.appendChild(inspectCell);


    //  lav en edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', () => {
        // Sæt modalType to 'edit'
        modalType = 'edit';

        console.log(recipe);
        localStorage.setItem('ingredients', JSON.stringify(recipe.ingredients));
        localStorage.setItem('mealID', JSON.stringify(recipe.mealID));

        // populate modal med opskrift
        document.getElementById("nameInput").value = recipe.name;
        document.getElementById("typeSelect").value = recipe.mealType;
        document.getElementById("sourceInput").value = recipe.source;
        console.log('edit');
        //hide add button
        document.getElementById("addRecipe").classList.add('hide');
        document.getElementById("editRecipe").classList.remove('hide');

        // localStorage.setItem('ingredients',stringify(recipe.ingredients))

        recipe.ingredients.forEach((ingredient) => addItemToList(ingredient));
        document.getElementById('editRecipe').addEventListener('click', () => {
            let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            // ændre i opskrift og set i local storage
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




    // lav delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    // tilføj event listener for delete funktionalitet
    deleteButton.addEventListener('click', function () {
        // Logik til at lave opskrift deletion

        deleteRecipe(recipe.mealID);
        row.remove();
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // Tilføj rækken til listen
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