function displayDailyNutri() {

    const hour = new Date().getHours();
    console.log(hour);


    getMealAndActivity()
        .then(data => {
            console.log("Received on front-end:", data);
            displayActivitiesAndMeals(data)
      
        })
        .catch(error => {
            console.error("Failed to fetch meal and activity data:", error);
            // Håndter fejlen, for eksempel ved at vise en fejlmeddelelse til brugeren
        });


   


}

function displayActivitiesAndMeals(data) {
    const currentHour = new Date().getHours();
    const summaryByHour = Array.from({ length: currentHour + 1 }, () => ({
        mealsCount: 0,
        totalWater: 0,
        totalKcalConsumed: 0,
        totalKcalBurned: 0,
        kcalLeft: 0
    }));

    const date = new Date().toISOString().split('T')[0];

    const summary = data.dailySummaries[date];



    

    // Process Meals
    data.detailed.meals.today.meals.forEach(meal => {
        const mealHour = new Date(meal.regTime).getUTCHours();
        if (mealHour <= currentHour) {
            summaryByHour[mealHour].mealsCount++;
            summaryByHour[mealHour].totalWater += meal.mTWater;
            summaryByHour[mealHour].totalKcalConsumed += meal.mTEnergyKcal;
        }
    });

    // Process Activities
    data.detailed.activities.today.activities.forEach(activity => {
        const activityHour = new Date(activity.regTime).getUTCHours();
        if (activityHour <= currentHour) {
            summaryByHour[activityHour].totalKcalBurned += activity.caloriesBurned;
        }
    });

    // Calculate calories left for each hour
    summaryByHour.forEach(hour => {
        hour.kcalLeft = hour.totalKcalConsumed - hour.totalKcalBurned-summary.basicMetabolismByHour;
    });

    // Find the table body where data should be inserted
    const tbody = document.getElementById('dailyNutritionTable').querySelector('tbody');
    tbody.innerHTML = '';  // Clear existing rows if necessary

    summaryByHour.forEach((hourData, index) => {
        let nextHour = index + 1;
        let timeframe = `${index}:00 - ${nextHour}:00`;

        // Create a new row and append data
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${timeframe}</td>
            <td>${hourData.mealsCount}</td>
            <td>${hourData.totalWater.toFixed(2)}</td>
            <td>${hourData.totalKcalConsumed}</td>
            <td>${hourData.totalKcalBurned}</td>
            <td>${hourData.kcalLeft.toFixed(2)}</td>
        `;
    });
}


// function displayActivitiesAndMeals(data) {
//     const activitiesByHour = {};
//     const mealsByHour = {};

//     // Parse activities and organize by hour
//     data.detailed.activities.today.activities.forEach(activity => {
//         const hour = new Date(activity.regTime).getUTCHours(); // Use getUTCHours() if regTime is in UTC
//         if (!activitiesByHour[hour]) {
//             activitiesByHour[hour] = [];
//         }
//         activitiesByHour[hour].push(activity);
//     });

//     // Parse meals and organize by hour
//     data.detailed.meals.today.meals.forEach(meal => {
//         const hour = new Date(meal.regTime).getUTCHours(); // Use getUTCHours() if regTime is in UTC
//         if (!mealsByHour[hour]) {
//             mealsByHour[hour] = [];
//         }
//         mealsByHour[hour].push(meal);
//     });

    // Render activities and meals
    // const target = document.getElementById('data-display'); // Assuming you have a div with this ID in your HTML
    // target.innerHTML = '';

    // Object.keys(activitiesByHour).concat(Object.keys(mealsByHour)).sort().forEach(hour => {
    //     const activities = activitiesByHour[hour] || [];
    //     const meals = mealsByHour[hour] || [];

    //     let content = `<h3>${hour}:00</h3>`;
    //     content += '<h4>Activities</h4>';
    //     activities.forEach(activity => {
    //         content += `<p>Calories Burned: ${activity.caloriesBurned}, Time Spent: ${activity.timeSpent} minutes</p>`;
    //     });

    //     content += '<h4>Meals</h4>';
    //     meals.forEach(meal => {
    //         content += `<p>Meal: ${meal.name}, Calories: ${meal.mTEnergyKcal} kcal</p>`;
    //     });

    //     target.innerHTML += content;
    // });
