function saveCaloriesToServer(caloriesBurned) {
    const data = {
        date: new Date().toISOString().split('T')[0],
        caloriesBurned
    };

    fetch('/api/saveCalories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

// function displayCaloriesBurnedToday() {
//     fetch('/api/getTodayCalories')
//         .then(response => response.json())
//         .then(data => {
//             const caloriesInfoElement = document.getElementById('calories-info');
//             caloriesInfoElement.textContent = `Total Calories Burned Today: ${data.totalCalories.toFixed(2)} kcal`;
//         })
//         .catch(error => console.error('Error loading the header:', error));

// }

// Hjælpe funktion til at initialisere storage data

function getOrCreateStorageData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}

//Funktion til at gemme kalorier og aktiviteter til local storage
// function saveCaloriesToLocalStorages(caloriesBurned) {
//     const dateKey = new Date().toISOString().split('T')[0];
//     const storageKey = 'aktivitetsData';
//     let caloriesData = getOrCreateStorageData(storageKey, {});

//     let todayData = caloriesData[dateKey] || {
//         totalCalories: 0,
//         activities: []
//     };

//     todayData.totalCalories += caloriesBurned;
//     todayData.activities.push({
//         time: new Date().toLocaleTimeString(),
//         calories: caloriesBurned
//     });

//     caloriesData[dateKey] = todayData;
//     localStorage.setItem(storageKey, JSON.stringify(caloriesData));
// }

// Funktion til at udregne og vise kaloirier forbrændt i dag
function updateCaloriesDisplay() {
    const storageKey = 'aktivitetsData';
    const stofskifteKey = 'stofskifteData';
    const caloriesData = getOrCreateStorageData(storageKey, {});
    const stofskifte = getOrCreateStorageData(stofskifteKey, {});

    const dateKey = new Date().toISOString().split('T')[0];
    const todayData = caloriesData[dateKey] || { totalCalories: 0 };
    const BMR = stofskifte.basalMetabolism || 0;

    const totalCalories = todayData.totalCalories + BMR;

    const caloriesInfoElement = document.getElementById('calories-info');
    caloriesInfoElement.textContent = `Total Calories Burned Today: ${totalCalories.toFixed(2)} kcal`;
}

// Use only the necessary calculateCalories function
function calculateCalories() {
    const activityKcal = parseFloat(document.getElementById('activity').value);
    const hours = parseFloat(document.getElementById('hours').value) || 0;
    const minutes = parseFloat(document.getElementById('minutes').value) || 0;
    const duration = hours + (minutes / 60);
    const caloriesBurned = activityKcal * duration;

    if (duration <= 0 || isNaN(caloriesBurned)) {
        alert('Please enter a valid duration greater than 0.');
        return;
    }

    document.getElementById('result').textContent = `You have burned ${caloriesBurned.toFixed(2)} kcal.`;
    saveCaloriesToServer(caloriesBurned);  // Assuming this is the correct function to retain
    displayCaloriesBurnedToday();  // Assuming this updates the display correctly
}

// Ensure event listeners and other dependencies are correctly adjusted
//window.onload = displayCaloriesBurnedToday;
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', calculateCalories);

