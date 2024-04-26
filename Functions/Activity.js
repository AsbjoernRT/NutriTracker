function saveCaloriesToLocalStorage(caloriesBurned) {
    // Hent dagens dato
    let today = new Date();
    let dateKey = today.toISOString().split('T')[0]; // Formatér datoen til YYYY-MM-DD

    // Hent eksisterende data fra localStorage eller opret et tomt objekt, hvis der ikke er nogen data for dagen
    let existingData = JSON.parse(localStorage.getItem('caloriesData')) || {};

    // Opret et nyt objekt til dagens data
    let todayData = existingData[dateKey] || {
        date: today.toISOString(),
        totalCalories: 0, // Startværdi for dagens samlede forbrænding
        activities: [] // Startværdi for dagens aktiviteter
    };

    todayData.totalCalories += caloriesBurned;

    // Tilføj dagens forbrænding til aktiviteterne
    todayData.activities.push({
        time: today.toLocaleTimeString(), // Gem tidspunktet for beregningen
        calories: caloriesBurned
    });

    // Gem dagens data under den relevante dato
    existingData[dateKey] = todayData;

    // Gem opdateret data til localStorage
    localStorage.setItem('aktivitetsData', JSON.stringify(existingData));
}


function calculateCalories() {
    let activityKcal = document.getElementById('activity').value;
    let hours = parseInt(document.getElementById('hours').value) || 0; // Timer
    let minutes = parseInt(document.getElementById('minutes').value) || 0; // Minutter
    let duration = hours + (minutes / 60);
    let caloriesBurned = activityKcal * duration;

    // Valider at varigheden er et gyldigt tal større end 0
    if (isNaN(duration) || duration <= 0) {
        alert('Indtast venligst en gyldig varighed (et tal større end 0).');
        return; // Afslutter funktionen hvis valideringen fejler
    }

    document.getElementById('result').textContent = 'Du har forbrændt ' + caloriesBurned.toFixed(2) + ' kcal.';

    // Gemmer resultatet i localStorage hvis beregningen er gyldig
    saveCaloriesToLocalStorage(caloriesBurned);

    // Update calories burned today on the page
    displayCaloriesBurnedToday();
}


function openSelector() {
    let select = document.getElementById("activity");
    select.size = 3; // Antallet af valgmuligheder, der skal vises
}

function closeSelector() {
    let select = document.getElementById("activity");
    select.size = 1;
}

function selectActivity() {
    let select = document.getElementById("activity");

    closeSelector(); // Lukker selectoren efter valg
}

function filterActivities() {
    let input = document.getElementById("activity-search");
    let filter = input.value.toUpperCase();
    let select = document.getElementById("activity");
    let options = select.options;
    let visibleCount = 0;

    for (let i = 0; i < options.length; i++) {
        let txtValue = options[i].textContent || options[i].innerText;
        if (txtValue.toUpperCase().startsWith(filter)) {
            options[i].classList.remove("hidden");
            options[i].disabled = false; // Gør optionen valgbar
            visibleCount++;
        } else {
            options[i].classList.add("hidden");
            options[i].disabled = true; // Gør optionen ikke-valgbar
        }
    }

    select.size = Math.max(visibleCount, 1); // Mindst 1 for at sikre, at select altid viser en option
}

// Hjælpe funktion til at initialisere storage data

function getOrCreateStorageData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}

//Funktion til at gemme kalorier og aktiviteter til local storage
function saveCaloriesToLocalStorage(caloriesBurned) {
    const dateKey = new Date().toISOString().split('T')[0];
    const storageKey = 'aktivitetsData';
    let caloriesData = getOrCreateStorageData(storageKey, {});

    let todayData = caloriesData[dateKey] || {
        totalCalories: 0,
        activities: []
    };

    todayData.totalCalories += caloriesBurned;
    todayData.activities.push({
        time: new Date().toLocaleTimeString(),
        calories: caloriesBurned
    });

    caloriesData[dateKey] = todayData;
    localStorage.setItem(storageKey, JSON.stringify(caloriesData));
}

//Funktion til at udregne og vise kaloirier forbrændt i dag
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

//udregner kalorier forbrænd baseret på aktivitet valgt og antal timer aktiviteten er blevet udført
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
    saveCaloriesToLocalStorage(caloriesBurned);
    updateCaloriesDisplay();
}

// Event listeners for at udregne kalorier, når knap trykkes på.
window.onload = updateCaloriesDisplay;
document.getElementById('activity-form').addEventListener('submit', calculateCalories);
