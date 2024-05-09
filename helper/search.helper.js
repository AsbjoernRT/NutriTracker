let debounceTimerId;

// let savedIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];


//Activities Search

// document.addEventListener('DOMContentLoaded', function () {
//     var inputElement = document.getElementById('activity-search');
//     var resultsDiv = document.getElementById('searchResult');
//     var debounceTimerId;

//     inputElement.addEventListener('input', function () {
//         clearTimeout(debounceTimerId);
//         debounceTimerId = setTimeout(() => {
//             var searchTerm = inputElement.value;
//             if (searchTerm.length > 1) {
//                 var filteredActivities = searchActivities(searchTerm);
//                 displayResults(filteredActivities);
//             } else {
//                 resultsDiv.innerHTML = ''; // Clear results if input is too short
//             }
//         }, 400);
//     });
// });

// function searchActivities(searchTerm) {
//     return activities.filter(activity => activity.name.toLowerCase().includes(searchTerm.toLowerCase()));
// }

// function displayResults(filteredActivities) {
//     var resultsDiv = document.getElementById('searchResult');
//     resultsDiv.innerHTML = ''; // Clear previous results
//     filteredActivities.forEach(activity => {
//         var div = document.createElement('div');
//         div.textContent = `${activity.name} - ${activity.calories} calories`;
//         resultsDiv.appendChild(div);
//     });
// }





// function selectActivity(name, calories) {
//     document.getElementById('activity-search').value = ''; // Ryd søgefeltet
//     document.getElementById('activity-list').innerHTML = ''; // Ryd listen

//     // Vis den valgte aktivitet og gem kalorierne
//     document.getElementById('activity-display').textContent = `${name} (${calories} kcal/time)`;
//     document.getElementById('selected-activity-kcal').value = calories; // Antager du har dette hidden input
// }



// //Food Search
document.addEventListener('DOMContentLoaded', function () {
    var inputElement = document.getElementById('searchInput');
    var resultsDiv = document.getElementById('searchResults');
    var debounceTimerId;

    inputElement.addEventListener('input', function () {
        clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value;
            if (searchTerm.length > 1) {
                fetch("/api/ingredient_search?searchTerm=" + searchTerm)
                    .then(res => res.json())
                    .then((res) => {
                        console.log(res);
                        displayResults(res)
                    });
            } else {
                resultsDiv.innerHTML = ''; // Clear results if input is too short
            }
        }, 200);
    });
});


function displayResults(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.textContent = item.foodName;
        resultItem.onclick = function () { selectItem(item); };
        resultsContainer.appendChild(resultItem);
    });
}

function selectItem(item) { // Here we can select the items from our API pull, which we are displaying in our html file. 
    document.getElementById('searchInput').value = item.foodName;
    document.getElementById('selectedItem').textContent = `Selected Item: ${item.foodName}`;
    document.getElementById('searchResults').innerHTML = '';

    return selectedItemData = {
        foodName: item.foodName,
        ingredientID: item.ingredientID,
        energyKj: item.energyKj,
        protein: item.protein,
        fat: item.fat,
        fiber: item.fiber,
        energyKcal: item.energyKcal,
        water: item.water,
        dryMatter: item.dryMatter,
        weight: null
    };
}

// Registrerer vi "addIngredient" klik
document.getElementById('addIngredient').addEventListener('click', function () {
    const weight = parseFloat(document.getElementById('itemWeight').value);
    if (isNaN(weight)) {
        console.error('Invalid weight entered');
        return;
    }

    // Assuming selectedItemData is defined elsewhere and has the proper structure
    selectedItemData.weight = weight;
    const properties = ['energyKj', 'protein', 'fat', 'fiber', 'energyKcal', 'water', 'dryMatter'];
    properties.forEach(prop => {
        selectedItemData['c' + prop.charAt(0).toUpperCase() + prop.slice(1)] = (selectedItemData[prop] / 100) * weight;
    });

    // // Retrieve saved ingredients from localStorage and validate
    // let savedIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    // if (!Array.isArray(savedIngredients)) {
    //     console.error('savedIngredients is not an array:', savedIngredients);
    //     savedIngredients = [];
    // }

    let savedIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];


    let ingredientAlreadyExists = false;

    savedIngredients = savedIngredients.map(ingredient => {
        if (ingredient.foodID === selectedItemData.foodID) {
            ingredient.weight += weight; // Sum up the weights if already exists
            ingredientAlreadyExists = true;
            updateListItem(ingredient); // Assuming this function updates the UI
        }
        return ingredient;
    });

    if (!ingredientAlreadyExists) {
        savedIngredients.push(selectedItemData);
        addItemToList(selectedItemData); // Assuming this function updates the UI
    }

    // Save updated ingredient list to localStorage
    // let IngredientsSaved = savedIngredients
    localStorage.setItem('ingredients', JSON.stringify(savedIngredients));
    // console.log(IngredientsSaved);
    console.log('Updated selectedItemData with macros:', selectedItemData);
});

// Global variable to store ingredients
// let ingredients = [];


function addItemToList(item) {
    const list = document.getElementById('ingredientList');
    const listItem = document.createElement('li');
    listItem.classList.add('ingredient-item');
    listItem.classList.add(`ingredient_${item.foodID}`);
    listItem.style.display = 'flex';
    listItem.style.justifyContent = 'space-between';
    listItem.style.alignItems = 'center';

    // Text content container
    const textContent = document.createElement('span');
    textContent.textContent = `Ingredint: ${item.foodName}, Weight: ${item.weight}g`;
    listItem.appendChild(textContent);

    // Button container
    const buttonContainer = document.createElement('div');

    // Create an Inspect button
    const inspectButton = document.createElement('button');
    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');
    // Add future functionality here
    buttonContainer.appendChild(inspectButton);


    // Create a Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        console.log("Deleting item with ID:", item.foodID);
        list.removeChild(listItem);
        removeItemFromLocalStorage(item.foodID);
    };

    buttonContainer.appendChild(deleteButton);

    // Add the button container to the list item
    listItem.appendChild(buttonContainer);

    // Add the list item to the list
    list.appendChild(listItem);

    inspectButton.addEventListener('click', function () {
        localStorage.setItem('selectedIngredientId', item.foodID);
        window.location.href = 'foodInspect.html';
    });
}

function updateListItem(ingedient) {
    const listItems = document.getElementsByClassName(`ingredient_${ingedient.foodID}`);

    // dårlig kode 
    for (const listItem of listItems) {
        listItem.remove();
        addItemToList(ingedient);
    }
}


function removeItemFromLocalStorage(itemId) {
    // Retrieve the array of ingredients from local storage, or initialize an empty array if none exists
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // Filter the array, keeping only the ingredients whose id does NOT match the provided itemId
    ingredients = ingredients.filter(ingredient => ingredient.foodID !== itemId);

    // Update the local storage with the new array of ingredients
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

document.getElementById('recipeForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collecting the form data
    const recipeName = document.getElementById('nameInput').value;
    const mealType = document.getElementById('typeSelect').value;
    const source = document.getElementById('sourceInput').value;

    // Retrieve ingredients from local storage
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // Combine all data into one object
    const postData = {
        recipeName,
        mealType,
        source,
        ingredients
    };

    console.log("Opskrifts Data:", postData );

    // Send the data using fetch API
    fetch('/api/ingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
});




// function selectItem(item) {
//     console.log('Selected:', item);
//     
// }





// document.getElementById('searchInput').addEventListener('input', function (event) {
//     clearTimeout(debounceTimerId);
//     debounceTimerId = setTimeout(async () => {
//         const searchTerm = event.target.value.trim();
//         if (searchTerm.length > 1) {
//             await index.connectedDatabase.searchFoodItems(searchTerm);
//         } else {
//             document.getElementById('searchResults').innerHTML = '';
//         }
//     }, 400);
// });

// async function index.connectedDatabase.searchFoodItems(searchTerm) {
//     try {
//         const response = await fetch(`http://your-api-url/search-food?term=${encodeURIComponent(searchTerm)}`);
//         if (!response.ok) throw new Error('Failed to fetch');
//         const items = await response.json();
//         displayResults(items);
//     } catch (error) {
//         console.error('Error fetching food items:', error);
//     }
// }


