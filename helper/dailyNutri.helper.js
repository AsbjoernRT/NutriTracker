function displayDailyNutri() {


    getMealAndActivity()
        .then(data => {
            console.log("Received on front-end:", data);
            displayActivitiesAndMeals(data)
            displayMonthlyView(data)
      
        })
        .catch(error => {
            console.error("Failed to fetch meal and activity data:", error);
            // Håndter fejlen, for eksempel ved at vise en fejlmeddelelse til brugeren
        });


   


}

function displayActivitiesAndMeals(data) { 
    const currentHour = new Date().getHours(); //Finder den nuværende time, vi er i
    const summaryByHour = Array.from({ length: currentHour + 1 }, () => ({
        mealsCount: 0,
        totalWater: 0,
        totalKcalConsumed: 0,
        totalKcalBurned: 0,
        kcalLeft: 0
    }));

    const date = new Date().toISOString().split('T')[0];

    const summary = data.dailySummaries[date];



    

    // Behandler måltider
    data.detailed.meals.today.meals.forEach(meal => {
        const mealHour = new Date(meal.regTime).getUTCHours();
        if (mealHour <= currentHour) {
            summaryByHour[mealHour].mealsCount++;
            summaryByHour[mealHour].totalWater += meal.mTWater;
            summaryByHour[mealHour].totalKcalConsumed += meal.mTEnergyKcal;
        }
    });

    // Behandler aktiviteter
    data.detailed.activities.today.activities.forEach(activity => {
        const activityHour = new Date(activity.regTime).getUTCHours();
        if (activityHour <= currentHour) {
            summaryByHour[activityHour].totalKcalBurned += activity.caloriesBurned;
        }
    });

    // Beregner tilbageværende kalorier for hver time
    summaryByHour.forEach(hour => {
        hour.kcalLeft = hour.totalKcalConsumed - hour.totalKcalBurned-summary.basicMetabolismByHour;
    });

    // Finder tabelkroppen, hvor data skal indsættes
    const tbody = document.getElementById('dailyNutritionTable').querySelector('tbody');
    tbody.innerHTML = '';  // Clear existing rows if necessary

    summaryByHour.forEach((hourData, index) => {
        let nextHour = index + 1;
        let timeframe = `${index}:00 - ${nextHour}:00`;

        // Opret en ny række og tilføj data
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


function displayMonthlyView(data) {
    const today = new Date()
    const daysInMonth = new Date(today.getDate());
    const summaryByDay = Array.from({ length: daysInMonth }, () => ({
        mealsCount: 0,
        totalWater: 0,
        totalKcalConsumed: 0,
        totalKcalBurned: 0,
        kcalLeft: 0
    }));

    // Behandler måltider
     data.detailed.meals.today.meals.forEach(meal => {
        const mealDate = new Date(meal.date);
        if (mealDate.getMonth() === today.getMonth() && mealDate.getFullYear() === today.getFullYear()) {
            const day = mealDate.getDate() - 1;
            summaryByDay[day].mealsCount++;
            summaryByDay[day].totalWater += meal.mTWater;
            summaryByDay[day].totalKcalConsumed += meal.mTEnergyKcal;
        }
    });

    // Behandler aktiviteter
    data.detailed.activities.today.activities.forEach(activity => {
        const activityDate = new Date(activity.date);
        if (activityDate.getMonth() === today.getMonth() && activityDate.getFullYear() === today.getFullYear()) {
            const day = activityDate.getDate() - 1;
            summaryByDay[day].totalKcalBurned += activity.caloriesBurned;
        }
    });

    // Beregner tilbageværende kalorier for hver dag
    summaryByDay.forEach(day => {
        day.kcalLeft = day.totalKcalConsumed - day.totalKcalBurned;
    });

    // Viser data
    const tbody = document.getElementById('monthlyNutritionTable').querySelector('tbody');
    tbody.innerHTML = '';  // Clear existing rows

    summaryByDay.forEach((dayData, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), index + 1).toLocaleDateString();
        tbody.innerHTML += `<tr>
            <td>${date}</td>
            <td>${dayData.mealsCount}</td>
            <td>${dayData.totalWater.toFixed(2)} L</td>
            <td>${dayData.totalKcalConsumed}</td>
            <td>${dayData.totalKcalBurned}</td>
            <td>${dayData.kcalLeft}</td>
        </tr>`;
    });
}
