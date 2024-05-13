
let debounceTimerId;

// Kører fetchMeals, når DOM'en er fuldt indlæst
document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();  // Call fetchMeals when the DOM is fully loaded
    let inputElement = document.getElementById('searchInput');
    let resultsDiv = document.getElementById('searchResults');
    let debounceTimerId;

    // Tilføjer en event listener til input-elementet for at håndtere søgning med debouncing
    inputElement.addEventListener('input', function () {
        clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value;
            if (searchTerm.length > 1) {
                // Fetcher måltider baseret på søgetermet
                fetch("/api/trackedMealSearch?searchTerm=" + searchTerm)
                    .then(res => res.json())
                    .then((res) => {
                        console.log("Response from search: ", res);
                        displayResults(res) // Viser resultaterne
                    });
            } else {
                resultsDiv.innerHTML = ''; // Rydder resultaterne, hvis søgetermen er for kortt
            }
        }, 200);
    });
});


// Søg efter en enkelt ingrediens

let inputElementIngredient = document.getElementById('searchInputIngredient');
let resultsDivIngredient = document.getElementById('searchResultsIngredient');

inputElementIngredient.addEventListener('input', function () {
    clearTimeout(debounceTimerId);  // Stop den tidligere satte timer
    debounceTimerId = setTimeout(() => {
        var searchTerm = inputElementIngredient.value;  // Gemmer den indtastede søgeværdi
        if (searchTerm.length > 1) { // Sikrer at der er mindst 2 tegn før søgning
            fetch("/api/ingredient_search?searchTerm=" + searchTerm)
                .then(res => res.json())
                .then((res) => {
                    console.log("data vi får ud", res);
                    displayIngredientResults(res)
                });
        } else {
            resultsDivIngredient.innerHTML = ''; // Tømmer søgeresultater hvis søgeterm er for kort
        }
    }, 200); // Debounce tid på 200 millisekunder
});




// Henter alle måltider registret for den givene bruger
function fetchMeals() {
    fetch("/api/mealTracker")
        .then(response => response.json())
        .then(mealData => {
            const mealListElement = document.getElementById('meal-item');
            console.log(mealData)


            mealData.forEach(meal => {
                // Opretter en ny række for hvert måltid
                const row = document.createElement('div');
                row.className = 'meal-row';
                appendNewRow(row, meal); // Tilføjer data til rækken
                mealListElement.appendChild(row); // Tilføjer rækken til måltidslisten
            });
        })
        .catch(error => console.error('Error fetching meals:', error));
}

// Indsætter data i frontend i rækkerne

function appendNewRow(row, meal) {
    // Oprettelse af celle til måltidsnavnet
    const nameCell = document.createElement('div');
    nameCell.className = 'meal-column';
    nameCell.textContent = meal.name;

    // Oprettelse af celle til måltidskilden
    const mealSource = document.createElement('div');
    mealSource.className = 'meal-column';
    mealSource.textContent = meal.source;

    // Oprettelse af celle til vægt og energiindhold af måltidet
    const weightEnergyCell = document.createElement('div');
    weightEnergyCell.className = 'meal-column weight-energy';
    const weight = document.createElement('div');
    weight.textContent = meal.quantity + 'g';
    const energy = document.createElement('div');
    energy.textContent = meal.mTEnergyKcal + 'kcal';
    weightEnergyCell.appendChild(weight);
    weightEnergyCell.appendChild(energy);

    // Oprettelse af celle til geografisk placering af måltidet
    const geoLocation = document.createElement('div');
    geoLocation.className = 'meal-column';
    geoLocation.textContent = meal.geoLocation;

    // Oprettelse af celle til dato for tilføjelse af måltidet
    const addedOn = document.createElement('div');
    addedOn.className = 'meal-column';
    addedOn.textContent = meal.date.split('T')[0];

    // Oprettelse af celle til daglige forbrugsværdier (energi, protein, fedt, fiber)
    const dailyCons = document.createElement('div');
    dailyCons.className = 'meal-column daily-cons-grid';
    const dailyConsEnergy = document.createElement('div');
    dailyConsEnergy.textContent = meal.mTEnergyKj + ' kj';
    const dailyConsProtein = document.createElement('div');
    dailyConsProtein.textContent = meal.mTProtein + ' g';
    const dailyConsFat = document.createElement('div');
    dailyConsFat.textContent = meal.mTFat + ' g';
    const dailyConsFiber = document.createElement('div');
    dailyConsFiber.textContent = meal.mTFiber + ' g';
    dailyCons.appendChild(dailyConsEnergy);
    dailyCons.appendChild(dailyConsProtein);
    dailyCons.appendChild(dailyConsFat);
    dailyCons.appendChild(dailyConsFiber);

    const editCell = document.createElement('div');
    const editButton = document.createElement('button');
    editCell.appendChild(editButton)
    editButton.classList.add('edit-button-mealTracker');

    editButton.textContent = "Edit"

    editButton.addEventListener('click', () => {
        // Sæt modalType to 'edit'
        modalType = 'edit';


        document.getElementById('searchInput').value = meal.name;
        document.getElementById('itemWeight').value = meal.quantity
        localStorage.setItem('meal', JSON.stringify(meal))
        toggleModalVisibilityTrackerEdit()

    })




    const deleteCell = document.createElement('div');
    const deleteButton = document.createElement('button');
    deleteCell.appendChild(deleteButton)
    deleteButton.classList.add('delete-button-mealTracker');

    deleteButton.textContent = "Delete"

    // Tilføjer celler til rækken
    row.appendChild(nameCell);
    row.appendChild(mealSource);
    row.appendChild(weightEnergyCell);
    row.appendChild(geoLocation);
    row.appendChild(addedOn);
    row.appendChild(dailyCons);
    row.appendChild(editCell)
    row.appendChild(deleteCell)


    // Tilføjer eventlisteners til slet- og inspektionsknapperne
    deleteButton.addEventListener('click', function () {


        deleteTrackedMeal(meal.regID);
        row.remove();
    });


}

// Viser resultaterne for søge funktionen, så der er en drop down funktion.
function displayResults(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    console.log(resultsContainer);

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.textContent = item.name;
        console.log(item.name);
        resultItem.onclick = function () { selectItem(item); };
        //    document.getElementById('selectedItem').dataset.mealId = resultItem.mealID; 
        resultsContainer.appendChild(resultItem);
    });
}

function displayIngredientResults(IngredientItems) {
    const resultsContainer = document.getElementById('searchResultsIngredient');
    resultsContainer.innerHTML = '';
    console.log(resultsContainer);

    IngredientItems.forEach(IngredientItems => {
        const resultIngredientItem = document.createElement('div');
        resultIngredientItem.classList.add('result-item');
        resultIngredientItem.textContent = IngredientItems.foodName;
        console.log(IngredientItems.foodName);
        resultIngredientItem.onclick = function () { selectIngredient(IngredientItems); };
        //    document.getElementById('selectedItem').dataset.mealId = resultItem.mealID; 
        resultsContainer.appendChild(resultIngredientItem);
    });
}



// Denne hjælper med at vælge det givene item, og her laved et objekt der kan anvendes til senere at sende data til backenden.
function selectItem(item) {
    document.getElementById('searchInput').value = item.name;
    document.getElementById('selectedItem').textContent = `Selected Item: ${item.name}`;
    document.getElementById('searchResults').innerHTML = '';

    console.log("Ting", item);

    return selectedMeal = {
        userID: item.userID,
        mealName: item.name,
        mealID: item.mealID,
        source: item.source,

    };
}

function selectIngredient(IngredientItems) {
    document.getElementById('searchInputIngredient').value = IngredientItems.foodName;
    document.getElementById('selectedIngredientItem').textContent = `Selected Item: ${IngredientItems.foodName}`;
    document.getElementById('searchResultsIngredient').innerHTML = '';

    console.log("Ting", IngredientItems);

    selectedItemData = {
        foodName: IngredientItems.foodName,
        ingredientID: IngredientItems.ingredientID,
        energyKj: IngredientItems.energyKj,
        protein: IngredientItems.protein,
        fat: IngredientItems.fat,
        fiber: IngredientItems.fiber,
        energyKcal: IngredientItems.energyKcal,
        water: IngredientItems.water,
        dryMatter: IngredientItems.dryMatter,
        quantity: null
    };

    localStorage.setItem('ingriedientData', JSON.stringify(selectedItemData))
}

// Laver en post request når man trykker på submit knap i mealTrackerformular

document.getElementById('updateTrackedMeal').addEventListener('click', function () {

    console.log("submit");
    const mealData = localStorage.getItem('meal');
    const mealObject = JSON.parse(mealData);

    console.log("Meal to update", mealObject);
    mealID = mealObject.mealID[0]
    regID = mealObject.regID
    userID = mealObject.userID[0]
    singleIngredientId = mealObject.singleIngredientId


    const quantity = parseInt(document.getElementById('itemWeight').value)
    console.log(quantity);

    const mealToUpdate = JSON.stringify({ userID, regID, mealID, quantity, singleIngredientId });
    console.log('mealToUpdate', mealToUpdate);
    fetch('/api/updateTrackedMeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: mealToUpdate
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    setTimeout(function () {
        // window.location.reload()
    }, 1000); // 1000 milliseconds = 1 second

})

document.getElementById('mealTrackerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const mealData = localStorage.getItem('meal');
    const mealObject = JSON.parse(mealData);

    const recipeName = document.getElementById('searchInput').value;
    const quantity = document.getElementById('itemWeight').value;

    const mealID = mealObject.mealID[0];
    const userID = mealObject.userID[0];


    const postData = {
        userID,
        mealID,
        recipeName,
        quantity,
        cityName
    };

    // Kalder submitData function og håndterer det med catch funktioner for fejl håndtering.
    fetch('api/addWeightToRecepie', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error))
}
)



document.getElementById('mealTrackerSingleIngredient').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const quantityInput = document.getElementById('ingredientItemWeight').value;

    // } else {
    document.getElementById('searchInputIngredient').value = ""

    // const recipeName = document.getElementById('searchInputIngredient').value;

    console.log("selectedItemData create snack", selectedItemData);
    console.log("quantity single", selectedItemData.foodName);
    console.log("Protein", selectedItemData.protein);



    mealIngredientName = selectedItemData.foodName
    energyKJ = selectedItemData.energyKj
    protein = selectedItemData.protein
    fat = selectedItemData.fat
    fiber = selectedItemData.fiber
    energyKcal = selectedItemData.energyKcal
    water = selectedItemData.water
    dryMatter = selectedItemData.dryMatter


    const postData = {
        mealIngredientName,
        singleIngredientId: '' + selectedItemData.ingredientID,
        cityName,
        quantityInput,
        energyKJ,
        protein,
        fat,
        fiber,
        energyKcal,
        water,
        dryMatter
    };

    console.log("forsøger at sende: ", postData);

    // Kalder submitData function og håndterer det med catch funktioner for fejl håndtering.
    fetch('api/singleIngredient', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)

    }).then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error))
}
);




function deleteTrackedMeal(regID) {
    console.log("Deleting meal with ID:", regID);

    const mealToDelete = JSON.stringify({ regID });

    fetch('/api/deleteTrackedMeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: mealToDelete
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data)
        })
        .catch(error => console.error('Error:', error));
}