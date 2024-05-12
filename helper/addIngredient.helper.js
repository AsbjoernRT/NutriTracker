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
// document.addEventListener('DOMContentLoaded', function () {
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

    // Opdaterer vægten for det valgte element
    selectedItemData.weight = weight;
    const properties = ['energyKj', 'protein', 'fat', 'fiber', 'energyKcal', 'water', 'dryMatter'];
    properties.forEach(prop => {
        // Beregner næringsværdier baseret på indtastet vægt
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

    savedIngredients.forEach(ingredient => {
        if (ingredient.ingredientID === selectedItemData.ingredientID) {
            console.log("Updating existing ingredient:", ingredient.foodName);
            ingredient.weight += weight; // Opdaterer vægt for eksisterende ingrediens
            ingredientAlreadyExists = true;
            updateListItem(ingredient);
        }
    });

    if (!ingredientAlreadyExists) {
        console.log("Adding new ingredient:", selectedItemData.foodName);
        savedIngredients.push(selectedItemData); // Tilføjer ny ingrediens til listen
        addItemToList(selectedItemData);
    }






    // savedIngredients = savedIngredients.map(ingredient => {
    //     if (ingredient.foodID === selectedItemData.foodID) {
    //         ingredient.weight += weight; // Sum up the weights if already exists
    //         ingredientAlreadyExists = true;
    //         updateListItem(ingredient); // Assuming this function updates the UI
    //     }
    //     return ingredient;
    // });

    // if (!ingredientAlreadyExists) {
    //     savedIngredients.push(selectedItemData);
    //     addItemToList(selectedItemData); // Assuming this function updates the UI
    // }

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
    // Antag at standardenheden er gram og formater outputtet
     const weight = item.weight || item.quantity; // Benyt mængde som standard hvis vægt mangler
     const unit = item.weight ? 'g' : 'g'; 
    textContent.textContent = `Ingredint: ${item.foodName}, Weight: ${weight}${unit} g`;
    listItem.appendChild(textContent);

    // Button container
    const buttonContainer = document.createElement('div');

    // Lav en Inspect button
    const inspectButton = document.createElement('button');
    inspectButton.textContent = 'Inspect';
    inspectButton.classList.add('inspect-button');
   
    buttonContainer.appendChild(inspectButton);


    // lav en Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        console.log("Deleting item with ID:", item.ingredientID);
        list.removeChild(listItem);
        removeItemFromLocalStorage(item.ingredientID);
    };

    buttonContainer.appendChild(deleteButton);

// Tilføj knapbeholderen til listen over elementer
    listItem.appendChild(buttonContainer);

// Tilføj listen over elementer til listen
    list.appendChild(listItem);

    inspectButton.addEventListener('click', function () {
        localStorage.setItem('selectedIngredientId', item.ingredientID);
        window.location.href = 'foodInspect.html';
    });
}

function updateListItem(ingedient) {
    const listItems = document.getElementsByClassName(`ingredient_${ingedient.ingredientID}`);


    for (const listItem of listItems) {
        listItem.remove();
        addItemToList(ingedient);
    }
}


function removeItemFromLocalStorage(itemId) {
// Hent listen af ingredienser fra lokal lagring, eller initialiser en tom liste, hvis ingen findes
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

// Filtrer listen, så kun ingredienser, hvis id IKKE matcher det angivne itemId, beholdes
    ingredients = ingredients.filter(ingredient => ingredient.ingredientID !== itemId);

// Opdater lokal lagring med den nye liste af ingredienser
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

document.getElementById('recipeForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Forhindre standardformens afsendelsesadfærd


    // samler form data
    const mealName = document.getElementById('nameInput').value;
    const mealType = document.getElementById('typeSelect').value;
    const source = document.getElementById('sourceInput').value;

    // hent ingredients fra local storage
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    // samler alt data i et  object
    const postData = {
        mealName,
        mealType,
        source,
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
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));

    // Nulstiller visning

    toggleModalVisibility()
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


