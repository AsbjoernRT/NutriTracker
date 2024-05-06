let debounceTimerId;

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
document.getElementById('addIngredient').addEventListener('click', function() {
    // Retrieve the weight input from the user
    const weight = parseFloat(document.getElementById('itemWeight').value);

    // Check if the weight is a valid number
    if (isNaN(weight)) {
        console.error('Invalid weight entered');
        return;
    }

    // Calculate the macros based on the weight
    selectedItemData.weight = weight;
    selectedItemData.cEnergyKj = (selectedItemData.energyKj / 100) * weight;
    selectedItemData.cProtein = (selectedItemData.protein / 100) * weight;
    selectedItemData.cFat = (selectedItemData.fat / 100) * weight;
    selectedItemData.cFiber = (selectedItemData.fiber / 100) * weight;
    selectedItemData.cEnergyKcal = (selectedItemData.energyKcal / 100) * weight;
    selectedItemData.cWater = (selectedItemData.water / 100) * weight;
    selectedItemData.cDryMatter = (selectedItemData.dryMatter / 100) * weight;

    // Display or use the calculated data
    console.log('Updated selectedItemData with macros:', selectedItemData);
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


