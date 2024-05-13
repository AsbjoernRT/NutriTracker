let debounceTimerId;

let ingredientsList = JSON.parse(localStorage.getItem('ingredients')) || [];


function updateUIFromStoredIngredients() {
    ingredientsList.forEach(addItemToList); // Correct function reference
}

function IngredientSearch() {
    var inputElement = document.getElementById('searchInput'); // Henter input-elementet for søgning
    var resultsDiv = document.getElementById('searchResults'); // Henter div-elementet hvor søgeresultater vises

    var debounceTimerId;

    inputElement.addEventListener('input', function () {
        clearTimeout(debounceTimerId);  // Stop den tidligere satte timer
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value;  // Gemmer den indtastede søgeværdi
            if (searchTerm.length > 1) { // Sikrer at der er mindst 2 tegn før søgning
                fetch("/api/ingredient_search?searchTerm=" + searchTerm)
                    .then(res => res.json())
                    .then((res) => {
                        console.log(res);
                        displayResults(res)
                    });
            } else {
                resultsDiv.innerHTML = ''; // Tømmer søgeresultater hvis søgeterm er for kort
            }
        }, 200); // Debounce tid på 200 millisekunder
    });
};


function displayResults(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item'); // Tilføjer klasse til resultatdiv
        resultItem.textContent = item.foodName; // Sætter tekstindholdet til fødevarens navn
        resultItem.onclick = function () { selectItem(item); }; // Tilføjer funktion til at vælge element ved klik
        resultsContainer.appendChild(resultItem);
    });
}

function selectItem(item) { // Her kan vi vælge elementer fra vores API-opslag, som vi viser i vores HTML-fil.
    selectedItemData = {};
    document.getElementById('searchInput').value = item.foodName;
    document.getElementById('selectedItem').textContent = `Selected Item: ${item.foodName}`;
    document.getElementById('searchResults').innerHTML = '';

    // console.log("this: ", item);
    // Gemmer og returnerer data om det valgte element
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
        quantity: 0
    };
    // console.log("Selected Item: ", selectedItemData);
    // return selectedItemData
}

document.getElementById('addIngredient').addEventListener('click', function () {
    const quantity = parseFloat(document.getElementById('itemWeight').value);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid weight greater than zero.');
        return;
    }

    // Retrieve the current list of ingredients from localStorage and parse it.
    let ingredientsList = JSON.parse(localStorage.getItem('ingredients')) || [];

    // Find if the ingredient already exists in the list.
    const existingIngredient = ingredientsList.find(ing => ing.ingredientID === selectedItemData.ingredientID);

    if (existingIngredient) {
        // Ingredient exists, update its quantity.
        existingIngredient.quantity += quantity;
        console.log('Updated ingredient:', existingIngredient);
    } else {
        // New ingredient, set its initial quantity and add to the list.
        selectedItemData.quantity = quantity;
        ingredientsList.push(selectedItemData);
        console.log('Added new ingredient:', selectedItemData);
    }

    // Save the updated list back to localStorage.
    localStorage.setItem('ingredients', JSON.stringify(ingredientsList));

    // Clear the current list in the UI and update it from storage.
    document.getElementById('ingredientList').innerHTML = '';
    updateUIFromStoredIngredients();
});

function updateUIFromStoredIngredients() {
    // Retrieve and parse the updated list from localStorage.
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // Rebuild the UI list with updated items.
    ingredients.forEach(addItemToList);
}

function addItemToList(ingredient) {
    const list = document.getElementById('ingredientList');
    const listItem = document.createElement('li');
    listItem.textContent = `Ingredient: ${ingredient.foodName}, Quantity: ${ingredient.quantity}`;
    list.appendChild(listItem);
}

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


    // Antag at standardenheden er gram og formater outputtet
    const quantity = item.quantity || item.weight; // Benyt mængde som standard hvis vægt mangler
    // const unit = item.quantity ? 'g' : 'g';
    textContent.textContent = `Ingredint: ${item.foodName}, Weight: ${quantity} g`;

    listItem.appendChild(textContent);

    // Button container
    const buttonContainer = document.createElement('div');

    // Lav en Inspect button
    const inspectButton = document.createElement('button');
    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');

    inspectButton.addEventListener('click', function () {
        const modal = document.getElementsByClassName('inspect-list')[0];
        modal.classList.remove('hide');

        // Referencer til elementet, der indeholder opskriftens detaljer
        const inspectionListTable = document.getElementById('mealInspectionListBody');

        // const ingredients = localStorage.getItem('ingredients');
        const ingredientsJson = localStorage.getItem('ingredients');
        const ingredients = JSON.parse(ingredientsJson);
        console.log(ingredients);


        ingredients.forEach(ingredient => {
            if (ingredient.ingredientID === item.ingredientID) {
                const ingredientRow = document.createElement('tr');

                // Navn på ingrediens
                const nameCell = document.createElement('td');
                nameCell.textContent = ingredient.foodName || 'No name provided';  // Standardværdi, hvis navn ikke er angivet
                ingredientRow.appendChild(nameCell);

                // Mængde af ingrediens
                const weightCell = document.createElement('td');
                weightCell.textContent = ingredient.quantity ? `${ingredient.quantity} g` : 'No data';
                ingredientRow.appendChild(weightCell);

                // Tjek og tilføj næringsværdier hvis tilgængelige
                if (ingredient && typeof ingredient.nutritionalValues === 'object' && ingredient.nutritionalValues !== null) {
                    const nutrientsOfInterest = ['cDryMatter', 'cEnergyKcal', 'cEnergyKj', 'cFat', 'cFiber', 'cProtein', 'cWater'];
                    nutrientsOfInterest.forEach(macroKey => {
                        const cell = document.createElement('td');
                        if (typeof ingredient.nutritionalValues[macroKey] === 'number') {
                            cell.textContent = ingredient.nutritionalValues[macroKey].toFixed(2);
                        } else {
                            cell.textContent = 'N/A';  // hjælper med "missing or non-numeric data"
                        }
                        ingredientRow.appendChild(cell);
                    });
                } else {
                    // Udfyld celler med 'N/A' hvis næringsdata mangler
                    const nutrientsOfInterest = ['cDryMatter', 'cEnergyKcal', 'cEnergyKj', 'cFat', 'cFiber', 'cProtein', 'cWater'];
                    nutrientsOfInterest.forEach(() => {
                        const cell = document.createElement('td');
                        cell.textContent = 'N/A';
                        ingredientRow.appendChild(cell);
                    });

                }

                // Tilføj den færdige række til tabellen
                inspectionListTable.appendChild(ingredientRow);
            }
        });

    });

    buttonContainer.appendChild(inspectButton);
    // lav en Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        console.log("Deleting item with ID:", item.ingredientID);
        list.removeChild(listItem);
        removeIngredient(item.ingredientID);
    };

    buttonContainer.appendChild(deleteButton);
    // Tilføj knapbeholderen til listen over elementer
    listItem.appendChild(buttonContainer);

    // Tilføj listen over elementer til listen
    list.appendChild(listItem);
}


function removeIngredient(itemId) {
    // Hent listen af ingredienser fra lokal lagring, eller initialiser en tom liste, hvis ingen findes
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // Filtrer listen, så kun ingredienser, hvis id IKKE matcher det angivne itemId, beholdes
    ingredients = ingredients.filter(ingredient => ingredient.ingredientID !== itemId);

    // Opdater lokal lagring med den nye liste af ingredienser
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

document.getElementById('addRecipe').addEventListener('click', function (event) {
    event.preventDefault(); // Forhindre standardformens afsendelsesadfærd


    // samler form data
    const mealName = document.getElementById('nameInput').value;
    const mealType = document.getElementById('typeSelect').value;
    const source = document.getElementById('sourceInput').value;

    const mealCategory = localStorage.getItem('mealCategory')
    console.log(mealCategory); 

    // hent ingredients fra local storage
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // samler alt data i et  object
    const postData = {
        mealName,
        mealType,
        source,
        mealCategory,
        ingredients
    };

    console.log("Opskrifts Data:", postData);

    // Send data ved brug af fetch API
    fetch('/api/ingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Insert Success:', data))
        .catch(error => console.error('Error:', error));

    // Nulstiller visning
    setTimeout(function() {
        toggleModalVisibility()
        window.location.reload()
    }, 1000); // 1000 milliseconds = 1 second
   
});

document.getElementById('editRecipe').addEventListener('click', function (event) {
    event.preventDefault(); // Forhindre standardformens afsendelsesadfærd


    // samler form data
    const mealName = document.getElementById('nameInput').value;
    const mealType = document.getElementById('typeSelect').value;
    const source = document.getElementById('sourceInput').value;

    // hent ingredients fra local storage
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const mealID = JSON.parse(localStorage.getItem('mealID')) || [];

    // samler alt data i et  object
    const postData = {
        mealID,
        mealName,
        mealType,
        source,
        ingredients
    };

    console.log("Opskrifts Data:", postData);

    // Send data ved brug af fetch API
    fetch('/api/updateIngredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Update Success:', data))
        .catch(error => console.error('Error:', error));

    // Nulstiller visning

    setTimeout(function() {
        toggleModalVisibility()
        window.location.reload()
    }, 1000); // 1000 milliseconds = 1 second
});

