let debounceTimerId;






// //Food Search
document.addEventListener('DOMContentLoaded', function () {
    fetchMeals();  // Call fetchMeals when the DOM is fully loaded
    var inputElement = document.getElementById('searchInput');
    var resultsDiv = document.getElementById('searchResults');
    var debounceTimerId;

    inputElement.addEventListener('input', function () {
        clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value;
            if (searchTerm.length > 1) {
                fetch("/api/addWeightToMeal?searchTerm=" + searchTerm)
                    .then(res => res.json())
                    .then((res) => {
                        console.log("Response from search: ", res);
                        displayResults(res)
                    });
            } else {
                resultsDiv.innerHTML = ''; // Clear results if input is too short
            }
        }, 200);
    });
});


// Laver en post request når man trykker på submit knap i mealTrackerformular

document.getElementById('mealTrackerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const recipeName = document.getElementById('searchInput').value;
    const quantity = document.getElementById('itemWeight').value;
    const mealID = selectedMeal.mealID;
    const userID = selectedMeal.userID;
    const timesEaten = selectedMeal.timesEaten;



    const postData = {
        userID,
        mealID,
        recipeName,
        quantity,
        timesEaten,
        cityName
    };

    // Log postData to ensure it's correct
    console.log(cityName);

    // Call submitData function and handle it with then/catch
    submitData(postData).then(() => {
        alert('Data submitted successfully');
        window.location.reload();


    }).catch(error => {
        console.error('Submission failed:', error);
        alert('Failed to submit data');
    });

}).catch(error => {
    console.error('Failed to get geolocation:', error);
    alert('Geolocation is required for this submission, please allow access and try again.');
    // Optionally, handle submission without geolocation or inform the user more specifically
});

function submitData(postData) {
    return fetch('api/addWeightToRecepie', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        if (!data.success) {
            throw new Error(data.message);
        }
        return data;  // Optionally, handle more data processing here
    });
}



function fetchMeals() {
    fetch("/api/mealTracker")
        .then(response => response.json())
        .then(mealData => {
            const mealListElement = document.getElementById('meal-item');
            console.log(mealData)

            mealData.forEach(meal => {
                // Hvis måltidet ikke findes laver vi en ny række
                const row = document.createElement('div');
                row.className = 'meal-row';
                appendNewRow(row, meal);
                mealListElement.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching meals:', error));
}

function appendNewRow(row, meal) {
    const nameCell = document.createElement('div');
    nameCell.className = 'meal-column';
    nameCell.textContent = meal.name;

    const mealSource = document.createElement('div');
    mealSource.className = 'meal-column';
    mealSource.textContent = meal.source;

    const weightEnergyCell = document.createElement('div');
    weightEnergyCell.className = 'meal-column weight-energy';
    const weight = document.createElement('div');
    weight.textContent = meal.quantity + 'g';
    const energy = document.createElement('div');
    energy.textContent = meal.mTEnergyKcal + 'kcal';
    weightEnergyCell.appendChild(weight);
    weightEnergyCell.appendChild(energy);

    const geoLocation = document.createElement('div');
    geoLocation.className = 'meal-column';
    geoLocation.textContent = meal.geoLocation;

    const addedOn = document.createElement('div');
    addedOn.className = 'meal-column';
    addedOn.textContent = meal.date.split('T')[0];

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



    row.appendChild(nameCell);
    row.appendChild(mealSource);
    row.appendChild(weightEnergyCell);
    row.appendChild(geoLocation);
    row.appendChild(addedOn);
    row.appendChild(dailyCons);

}

function updateExistingRow(row, meal) {
    // Denne funktion skal håndtere opdatering af en eksisterende række
    const weightCell = row.querySelector('.weight-column');
    const energyCell = row.querySelector('.energy-column');
    const dailyConsEnergyCell = row.querySelector('.daily-cons-energy-column');

    let currentWeight = parseInt(weightCell.textContent.replace('g', ''));
    let currentEnergy = parseInt(energyCell.textContent.replace('kcal', ''));
    let currentConsEnergy = parseInt(dailyConsEnergyCell.textContent.replace(' kj', ''));

    currentWeight += parseInt(meal.quantity);
    currentEnergy += parseInt(meal.mTEnergyKcal);
    currentConsEnergy += parseInt(meal.mTEnergyKj);

    weightCell.textContent = currentWeight + 'g';
    energyCell.textContent = currentEnergy + 'kcal';
    dailyConsEnergyCell.textContent = currentConsEnergy + ' kj';
}


// ?searchTerm=" + searchTerm

function displayResults(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.textContent = item.name;
        resultItem.onclick = function () { selectItem(item); };
        document.getElementById('selectedItem').dataset.mealId = resultItem.mealID; // Store mealID in data attribute
        resultsContainer.appendChild(resultItem);
    });
}

function selectItem(item) { // Here we can select the items from our API pull, which we are displaying in our html file. 
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



//     document.addEventListener('DOMContentLoaded', () => {
//         // Simulating fetching the meal data arra

//         fetchMeals().then(mealData => {

//     })


getGeolocation().then(position => {
    const geoLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    return geoLocation
}
);