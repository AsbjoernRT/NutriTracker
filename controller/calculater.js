export function calculateMetabolism(age, gender, weight) {
    let basalMetabolism = 0;

    // Beregn basalstofskiftet baseret på alder, køn, vægt og højde
    if (gender === 'male') {
        if (age < 3) {
            basalMetabolism = 0.249 * weight - 0.13;
        } else if (age >= 4 && age <= 10) {
            basalMetabolism = 0.095 * weight + 2.11;
        } else if (age >= 11 && age <= 18) {
            basalMetabolism = 0.074 * weight + 2.75;
        } else if (age >= 19 && age <= 30) {
            basalMetabolism = 0.064 * weight + 2.84;
        } else if (age >= 31 && age <= 60) {
            basalMetabolism = 0.0485 * weight + 3.67;
        } else if (age >= 61 && age <= 75) {
            basalMetabolism = 0.0499 * weight + 2.93;
        } else if (age > 75) {
            basalMetabolism = 0.035 * weight + 3.43;
        }
    } else if (gender === 'female') {
        if (age < 3) {
            basalMetabolism = 0.244 * weight - 0.13;
        } else if (age >= 4 && age <= 10) {
            basalMetabolism = 0.085 * weight + 2.03;
        } else if (age >= 11 && age <= 18) {
            basalMetabolism = 0.056 * weight + 2.9;
        } else if (age >= 19 && age <= 30) {
            basalMetabolism = 0.0615 * weight + 2.08;
        } else if (age >= 31 && age <= 60) {
            basalMetabolism = 0.0364 * weight + 3.47;
        } else if (age >= 61 && age <= 75) {
            basalMetabolism = 0.0386 * weight + 2.88;
        } else if (age > 75) {
            basalMetabolism = 0.041 * weight + 2.61;
        }
    }

    basalMetabolism *= 239;

    return basalMetabolism;
}

export function calculateBurnedKcal(activites){
    console.log(activites);
}

// console.log(calculateMetabolism(23,"male", 94));

function calculateRemainingCalories(metabolism) {
    const metabolismPerHour = metabolism / 24;

    const now = new Date();
    const currentHour = now.getHours(); // Current hour (0-23)
    console.log(currentHour);

    const usedMetabolism = metabolismPerHour * currentHour;
    console.log(usedMetabolism);
    // const totalCaloriesBurned = req.someDataSource.totalCaloriesBurnedToday;
    // const totalCaloriesConsumed = req.someDataSource.totalCaloriesConsumedToday;

    // const kcalsLeft = (usedMetabolism + totalCaloriesBurned) - totalCaloriesConsumed;

    return usedMetabolism;
}


export function categorizeActiviityDate(entries) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to compare only date parts

    const results = {
        today: {
            activities: [],
            totalCalories: 0,
            numberOfActivies: 0
        },
        otherDates: {}
    };

    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normalize time part for accurate comparison

        const dateKey = entryDate.toISOString().split('T')[0]; // Create a date key in YYYY-MM-DD format
        const isToday = entryDate.getTime() === today.getTime();
        const category = isToday ? results.today : (
            results.otherDates[dateKey] || (results.otherDates[dateKey] = {
                activities: [],
                totalCalories: 0,
                numberOfActivies: 0
            })
        );
        category.activities.push(entry);
        category.totalCalories += entry.caloriesBurned;
        category.numberOfActivies++;
    });

    return results;
}

export function categorizeMealDate(entries) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset time part to compare only date parts

    const results = {
        today: {
            meals: [],
            mTEnergyKj: 0,
            mTProtein: 0,
            mTFat: 0,
            mTFiber: 0,
            mTEnergyKcal: 0,
            mTWater: 0,
            mTDryMatter: 0,
            numberOfMeals: 0,
        },
        otherDates: {}
    };

    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);  // Normalize time part for accurate comparison

        const dateKey = entryDate.toISOString().split('T')[0]; // Create a date key in YYYY-MM-DD format
        const isToday = entryDate.getTime() === today.getTime();
        const category = isToday ? results.today : (
            results.otherDates[dateKey] || (results.otherDates[dateKey] = {
                meals: [],
                mTEnergyKj: 0,
                mTProtein: 0,
                mTFat: 0,
                mTFiber: 0,
                mTEnergyKcal: 0,
                mTWater: 0,
                mTDryMatter: 0,
                numberOfMeals: 0,
            })
        );

        // Aggregate the data
        category.meals.push(entry);
        category.mTEnergyKj += entry.mTEnergyKj;
        category.mTProtein += entry.mTProtein;
        category.mTFat += entry.mTFat;
        category.mTFiber += entry.mTFiber;
        category.mTEnergyKcal += entry.mTEnergyKcal;
        category.mTWater += entry.mTWater / 1000;
        category.mTDryMatter += entry.mTDryMatter;
        category.numberOfMeals++;
    });

    return results;
}

export function createDailySummaries(activityData, mealData, basicMetabolism) {
    const caclulatedMetabolism = calculateRemainingCalories(basicMetabolism)
    const basicMetabolismByHour = basicMetabolism/24

    const allDates = { ...mealData.otherDates, ...activityData.otherDates };
    const allDatesKeys = Object.keys(allDates);

    const dailySummaries = allDatesKeys.reduce((acc, date) => {
        const meals = mealData.otherDates[date] || {
            mTEnergyKcal: 0,
            mTWater: 0,
            mTProtein: 0,
            numberOfMeals: 0
        };
        const activities = activityData.otherDates[date] || {
            totalCalories: 0
        };

        acc[date] = {
            Date: date,
            numberOfMeals: meals.numberOfMeals,
            mTWater: meals.mTWater,
            mTEnergyKcal: meals.mTEnergyKcal,
            mTProtein: meals.mTProtein,
            totalCalories: activities.totalCalories + basicMetabolism,
            kcalsLeft: basicMetabolism + activities.totalCalories - meals.mTEnergyKcal,
            caclulatedMetabolism: caclulatedMetabolism,
            basicMetabolismByHour: basicMetabolismByHour
        };

        return acc;
    }, {});

    // Include today's data
    dailySummaries[new Date().toISOString().split('T')[0]] = {
        Date: new Date().toISOString().split('T')[0],
        numberOfMeals: mealData.today.numberOfMeals,
        mTWater: mealData.today.mTWater,
        mTEnergyKcal: mealData.today.mTEnergyKcal,
        mTProtein: mealData.today.mTProtein,
        totalCalories: activityData.today.totalCalories + basicMetabolism,
        kcalsLeft: basicMetabolism + activityData.today.totalCalories - mealData.today.mTEnergyKcal,
        caclulatedMetabolism: caclulatedMetabolism,
        basicMetabolismByHour: basicMetabolismByHour
    };

    return dailySummaries;
}