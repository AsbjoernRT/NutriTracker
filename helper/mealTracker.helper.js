let debounceTimerId;

// Kører fetchMeals, når DOM'en er fuldt indlæst
document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();  // Call fetchMeals when the DOM is fully loaded
    var inputElement = document.getElementById('searchInput');
    var resultsDiv = document.getElementById('searchResults');
    var debounceTimerId;

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

   // Oprettelse af knapper til inspektion og sletning af måltider
    const inspectCell = document.createElement('div');
    const editButton = document.createElement('button');
    inspectCell.appendChild(editButton)
    editButton.classList.add('edit-button');

    editButton.textContent = "Inspekt"

    const deleteCell = document.createElement('div');
    const deleteButton = document.createElement('button');
    deleteCell.appendChild(deleteButton)
    deleteButton.classList.add('delete-button');

    deleteButton.textContent = "Delete"

     // Tilføjer celler til rækken
    row.appendChild(nameCell);
    row.appendChild(mealSource);
    row.appendChild(weightEnergyCell);
    row.appendChild(geoLocation);
    row.appendChild(addedOn);
    row.appendChild(dailyCons);
    row.appendChild(editButton)
    row.appendChild(deleteCell)


    // Tilføjer eventlisteners til slet- og inspektionsknapperne
    deleteButton.addEventListener('click', function () {


        deleteTrackedMeal(meal.mealID[0]);
        row.remove();
    });

    editButton.addEventListener('click', () => {
        modalType = 'edit';

        console.log(recipe);
         // Gemmer ingredienser i localStorage for senere brug
        localStorage.setItem('ingredients', JSON.stringify(recipe.ingredients));
         // Populerer modalen med måltidsdata
        document.getElementById("nameInput").value = recipe.name;
        document.getElementById("typeSelect").value = recipe.mealType;
        document.getElementById("sourceInput").value = recipe.source;
        console.log('edit');
         // Skjuler "Tilføj" knappen og viser "Rediger" knappen
        document.getElementById("addRecipe").classList.add('hide');
        document.getElementById("editRecipe").classList.remove('hide');

        recipe.ingredients.forEach((ingredient) => addItemToList(ingredient));
        document.getElementById('editRecipe').addEventListener('click', () => {
            let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            // Redigering af måltidet
            recipes.forEach(r => {
                if (r.name === recipe.name) {
                    r.name = document.getElementById("nameInput").value;
                    r.mealType = document.getElementById("typeSelect").value;
                    r.source = document.getElementById("sourceInput").value;
                }
            });
            // Redigerer måltidet og gemmer det i localStorage
            localStorage.setItem('recipes', JSON.stringify(recipes));
        });
         // Viser modalen
        document.getElementById('modal-wrapper').classList.toggle('hide');
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


// Laver en post request når man trykker på submit knap i mealTrackerformular

document.getElementById('mealTrackerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const recipeName = document.getElementById('searchInput').value;
    const quantity = document.getElementById('itemWeight').value;
    const mealID = selectedMeal.mealID;
    const userID = selectedMeal.userID;


    const postData = {
        userID,
        mealID,
        recipeName,
        quantity,
        timesEaten,
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
})

function deleteTrackedMeal(mealID) {
    console.log("Deleting meal with ID:", mealID);

    const mealToDelete = JSON.stringify({ mealID });

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