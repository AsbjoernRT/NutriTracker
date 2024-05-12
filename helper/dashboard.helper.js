// I en anden fil, hvor du ønsker at bruge getMealAndActivity
function showMealAndActivity() {
    getMealAndActivity()
        .then(data => {
            console.log("Received on front-end:", data);
            updateTodaysSummary(data.dailySummaries);
            // // Sæt dato
            // document.getElementById('date').textContent = new Date().toLocaleDateString();

            // // Update dashboard values based on the received data
            // document.getElementById('mealsToday').textContent = `Number of meals consumed today: ${data.detailed.meals.today.numberOfMeals}`;
            // document.getElementById('energyToday').textContent = `Calories consumed today: ${data.detailed.meals.today.mTEnergyKcal} kcal`;
            // document.getElementById('waterToday').textContent = `Liters of water drunk today: ${data.detailed.meals.today.mTWater} L`;
            // document.getElementById('proteinsToday').textContent = `Grams of protein consumed today: ${data.detailed.meals.today.mTProtein} g`;
            // Assuming data for kcalsBurnedToday and kcalsLeftToday is available in 'data'
            // document.getElementById('kcalsToday').textContent = `Kcals Burned Today: ${data.detailed.activities.today.totalCalories}`;
            // document.getElementById('kcalsLeftToday').textContent = `Kcals Left Today: ${calculateKcalsLeft(data)}`;
        })
        .catch(error => {
            console.error("Failed to fetch meal and activity data:", error);
// Håndter fejlen, for eksempel ved at vise en fejlmeddelelse til brugeren
        });

}

function updateTodaysSummary(dailySummaries) {
    const today = new Date().toISOString().split('T')[0];  // få dato i YYYY-MM-DD format

// Tjek om der er et resumé for i dag
    const summary = dailySummaries[today];

// Opdater brugergrænsefladeelementerne, hvis der findes et resumé for i dag
    if (summary) {
        document.getElementById('mealsToday').textContent = `Number of meals consumed today: ${summary.numberOfMeals}`;
        document.getElementById('energyToday').textContent = `Calories consumed today: ${summary.mTEnergyKcal.toFixed(2)} kcal`;
        document.getElementById('waterToday').textContent = `Liters of water drunk today: ${summary.mTWater.toFixed(2)} L`;
        document.getElementById('proteinsToday').textContent = `Grams of protein consumed today: ${summary.mTProtein} g`;

        document.getElementById('kcalsToday').textContent = `Kcals Burned Today: ${summary.totalCalories.toFixed(2)}`;
        if (summary.kcalsLeft.toFixed(2) !== 0) {
            document.getElementById('kcalsLeftToday').textContent = `Kcals Left Today: ${summary.kcalsLeft.toFixed(2)}`;

        } else { document.getElementById('kcalsLeftToday').textContent = `Kcals Left Today: ${summary.basicMetabolism.toFixed(2)}`; }
    }
}