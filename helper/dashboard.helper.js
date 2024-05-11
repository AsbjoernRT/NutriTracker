// In another file where you want to use getMealAndActivity
function showMealAndActivity() {
    getMealAndActivity()
    .then(data => {
        console.log("Received on front-end:", data);
        updateTodaysSummary(data.dailySummaries);
        // // Set the date
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
            // Handle the error, such as showing an error message to the user
        });
    
}

function updateTodaysSummary(dailySummaries) {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format

    // Check if there's a summary for today
    const summary = dailySummaries[today];

    // Update the UI elements if today's summary exists
    if (summary) {
        document.getElementById('mealsToday').textContent = `Number of meals consumed today: ${summary.numberOfMeals}`;
        document.getElementById('energyToday').textContent = `Calories consumed today: ${summary.mTEnergyKcal.toFixed(2)} kcal`;
        document.getElementById('waterToday').textContent = `Liters of water drunk today: ${summary.mTWater.toFixed(2)} L`;
        document.getElementById('proteinsToday').textContent = `Grams of protein consumed today: ${summary.mTProtein} g`;
        document.getElementById('kcalsToday').textContent = `Kcals Burned Today: ${summary.totalCalories.toFixed(2)}`;
        document.getElementById('kcalsLeftToday').textContent = `Kcals Left Today: ${summary.kcalsLeft.toFixed(2)}`;
    } else {
        // Provide feedback if no data is available for today
        document.getElementById('mealsToday').textContent = "Number of meals consumed today: Data not available";
        document.getElementById('energyToday').textContent = "Calories consumed today: Data not available";
        document.getElementById('waterToday').textContent = "Liters of water drunk today: Data not available";
        document.getElementById('proteinsToday').textContent = "Grams of protein consumed today: Data not available";
        document.getElementById('kcalsToday').textContent = "Kcals Burned Today: Data not available";
        document.getElementById('kcalsLeftToday').textContent = "Kcals Left Today: Data not available";
    }
}
