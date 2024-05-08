document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('openModal') === 'true') {
        document.getElementById('modal-wrapper').classList.remove('hide');
        localStorage.removeItem('openModal'); // Remove the flag after checking
    }

    let meal = JSON.parse(localStorage.getItem('meals')) || [];
    meal.forEach(meal => addMealToList(meal));
});

document.getElementById('modal-close-button').addEventListener('click', function() {
    toggleModalVisibility();
});


function openModalForAdding() {
    const modal = document.getElementById('modal-wrapper');
    const editWeightInput = document.getElementById('mealWeightInput'); // Hide this in 'add' context

    // Reset any editing-related elements
    if (editWeightInput) editWeightInput.style.display = 'none';

    // Show the modal
    if (modal) modal.classList.remove('hide');
}


function toggleModalVisibility() {
    const modal = document.getElementById('modal-wrapper');
    const addButton = document.getElementById('addMeal');
    const updateButton = document.getElementById('updateMealButton');
    const editWeightInput = document.getElementById('mealWeightInput'); // Static HTML weight input for editing

    // Toggle modal visibility
    if (modal) modal.classList.toggle('hide');

    // Reset the modal to its default state
    if (addButton) addButton.style.display = 'block';
    if (updateButton) updateButton.style.display = 'none';
    if (editWeightInput) editWeightInput.style.display = 'none';
}

function openModalForEditing(meal) {
    const modal = document.getElementById('modal-wrapper');
    const editWeightInput = document.getElementById('mealWeightInput'); // Show this in 'edit' context

    // Populate editWeightInput with meal data
    if (editWeightInput) {
        editWeightInput.style.display = 'block';
        editWeightInput.value = meal.consumedWeight;
    }

    // Populate other modal fields if necessary

    // Show the modal
    if (modal) modal.classList.remove('hide');
}

function addMealToList(meal) {
    const list = document.getElementById('meal-item');
    const row = document.createElement('tr');
    row.classList.add('meal-row');

    // Set the background color based on the meal type
    if (meal.type === 'beverage') {
        row.style.backgroundColor = '#99d9de'; // Blue for beverages
    } else if (meal.type === 'food') {
        row.style.backgroundColor = '#def6d8'; // Green for food
    }

    // Meal name and source
    const nameCell = document.createElement('td');
    const nameContainer = document.createElement('div'); // Container for name and source

    const nameSpan = document.createElement('span'); // Span for meal name
    nameSpan.textContent = meal.name;
    nameContainer.appendChild(nameSpan);

    const sourceSpan = document.createElement('span'); // Span for meal source
    sourceSpan.textContent = ` - ${meal.source}`;
    sourceSpan.style.display = 'block'; // Display on a new line
    sourceSpan.style.fontSize = 'smaller'; // Smaller font size
    nameContainer.appendChild(sourceSpan);

    nameCell.appendChild(nameContainer);
    row.appendChild(nameCell);

    //Meal Type
    const typeCell = document.createElement('td');
    typeCell.textContent = `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}`;
    row.appendChild(typeCell);

    // Weight and energy Info
    const WECell = document.createElement('td');
    const weight = parseFloat(meal.consumedWeight); // Ensure it's a number
    const kcal = meal.kcalPer100g * (meal.consumedWeight / 100);

    WECell.textContent = `${weight} g, ${kcal.toFixed(2)} kcal`;
    row.appendChild(WECell);


    //Date
    const dateCell = document.createElement('td');
    if (meal.date) {
        dateCell.textContent = new Date(meal.date).toLocaleDateString();
    } else {
        dateCell.textContent = 'Unknown Date'; // Default text if date is not available
    }
    row.appendChild(dateCell);

    //Nutrient Info
    const nutriCell = document.createElement('td');
    const protein = meal.proteinPer100g * (meal.consumedWeight / 100);
    const fats = meal.fatPer100g * (meal.consumedWeight / 100);
    const carbs = meal.carbPer100g * (meal.consumedWeight / 100);
    const fibers = meal.fiberPer100g * (meal.consumedWeight / 100);

    nutriCell.textContent = `Protein: ${protein.toFixed(0)} g, Fat: ${fats.toFixed(0)}g, Carb: ${carbs.toFixed(0)}g, Fiber ${fibers.toFixed(0)}g`;
    row.appendChild(nutriCell);


    // Create an edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', function () {
        console.log("Edit button clicked for meal:", meal);
        // Populate the modal with the current meal's data
        populateModalForEditing(meal);
        
        // Open the modal
        openModalForEditing(meal);
        // toggleModalVisibility();
    });
    
    editCell.appendChild(editButton)
    row.appendChild(editCell);

    /// Create a delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function () {
        // Call deleteMeal with the meal's unique identifier
        console.log(meal.id, meal.name);
        deleteMeal(meal.id);
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);


    list.appendChild(row);

};

function populateModalForEditing(meal) {
    console.log("Populating modal for editing meal:", meal);
    const addButton = document.getElementById('addMeal');
    const updateButton = document.getElementById('updateMealButton');
    const modal = document.getElementById('modal-wrapper');
    const editWeightInput = document.getElementById('mealWeightInput'); // The static HTML weight input for editing

    // Hide the add button and show the update button
    if (addButton) addButton.style.display = 'none';
    if (updateButton) updateButton.style.display = 'block';

    // Show the static HTML weight input for editing
    if (editWeightInput) {
        editWeightInput.style.display = 'block';
        editWeightInput.value = meal.consumedWeight;
    }

    // Open the modal for editing
    if (modal) modal.classList.remove('hide');

    if (updateButton) {
        updateButton.onclick = function() {
            // Call a function to handle the update
            updateMeal(meal.id, parseFloat(editWeightInput.value));
            toggleModalVisibility(); // Optionally close the modal after updating
        };
    }
}


function updateMeal(mealID, updatedWeight) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    let mealToUpdate = meals.find(meal => meal.id === mealID);

    if (mealToUpdate) {
        // Update the consumed weight
        mealToUpdate.consumedWeight = updatedWeight;

        // Recalculate nutritional values based on the new weight
        let weightFactor = updatedWeight / 100;
        mealToUpdate.nutrition.kcal = mealToUpdate.kcalPer100g * weightFactor;
        mealToUpdate.nutrition.protein = mealToUpdate.proteinPer100g * weightFactor;
        mealToUpdate.nutrition.fat = mealToUpdate.fatPer100g * weightFactor;
        mealToUpdate.nutrition.carbs = mealToUpdate.carbPer100g * weightFactor;
        mealToUpdate.nutrition.fibers = mealToUpdate.fiberPer100g * weightFactor;
        // Add any other nutritional recalculations as needed

        // Save the updated meals list back to localStorage
        localStorage.setItem('meals', JSON.stringify(meals));

        // Refresh the meal list or perform other post-update actions
        refreshMealList();  // Assuming you have a function to refresh the displayed list of meals
    } else {
        console.error("Meal not found for ID:", mealID);
    }
}





// Deletes meal from the table and updates localStorage
function deleteMeal(mealID) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    let mealCounts = JSON.parse(localStorage.getItem('mealCounts')) || {};

    console.log(meals, mealCounts);
    // Find the meal to be deleted using its unique ID
    const mealToDelete = meals.find(meal => meal.id === mealID);

    if (mealToDelete) {
        // Decrease the count for the deleted meal by its name
        mealCounts[mealToDelete.name] = Math.max(0, (mealCounts[mealToDelete.name] || 1) - 1);

        // Filter out the meal by its unique ID
        meals = meals.filter(meal => meal.id !== mealID);

        // Save the updated lists back to localStorage
        localStorage.setItem('meals', JSON.stringify(meals));
        localStorage.setItem('mealCounts', JSON.stringify(mealCounts));

        // Refresh the meal list in the UI
        refreshMealList();
    }
}


function refreshMealList() {
    const list = document.getElementById('meal-item');
    list.innerHTML = ''; // Clear the list

    // Repopulate the list with updated meal data
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals.forEach(addMealToList);
}
