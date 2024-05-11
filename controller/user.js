import index from '../index.js'
import { calculateMetabolism, calculateBurnedKcal } from '../controller/calculater.js'

export const updateUser = async (req, res) => {
    const { age, weight, gender } = req.body;
    const email = req.session.user.email
    const name = req.session.user.name
    const cMetabolism = calculateMetabolism(age, gender, weight)
    console.log("Session Data: ", email, age, weight, gender, cMetabolism);
    const updateUser = await index.connectedDatabase.updateUser(email, age, weight, gender, cMetabolism);


    const user = await index.connectedDatabase.getUserByMail(email)
    console.log(user);
    req.session.user = user
}

export const deleteUser = async (req, res) => {
    console.log("backend: ", req.session.user);
    const { userID, email } = req.session.user;

    console.log(userID, email);

    const deleteUser = await index.connectedDatabase.deleteUserId(userID)

    console.log("User to delete: ", deleteUser);
}

export const getMealAndActivity = async (req, res) => {

    const userID = req.session.user.userID;
    const basicMetabolism = calculateRemainingCalories(req)


    console.log("User ID: ", userID);

    const getMeals = await index.connectedDatabase.getAllUserMeal(userID)
    const getActivites = await index.connectedDatabase.getActivity(userID)

    // console.log("Meals: ", getMeals, "&", getActivites);

    // console.log(categorizeByDate(getActivites))
    // console.log(categorizeByDate(getMeals))

    const categorizedActivity = categorizeActiviityDate(getActivites)
    console.log(categorizedActivity);
    const categorizedMeals = categorizeMealDate(getMeals)
    console.log(categorizedMeals);

    const dailySummaries = createDailySummaries(categorizedActivity, categorizedMeals, basicMetabolism);
    console.log(dailySummaries);

    // const result = {dailySummaries}

    const response = {
        dailySummaries: dailySummaries, // Summarized data for each day
        detailed: {
            activities: categorizedActivity,
            meals: categorizedMeals
        }
    };

    res.json(response);



    // res.json(dailySummaries)
    // console.log(createSummaryObject(categorizedActivity,categorizedMeals));
    // console.log(sumCalories());
}

function calculateRemainingCalories(req) {

    const metabolism = req.session.user.metabolism; // from user session
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


function categorizeActiviityDate(entries) {

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

function categorizeMealDate(entries) {
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

function createDailySummaries(activityData, mealData, basicMetabolism) {
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
            basicMetabolism: basicMetabolism
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
        basicMetabolism: basicMetabolism
    };

    return dailySummaries;
}



// function createSummaryObject(categorizedActivity, categorizedMeals) {
//     // // Helper function to format summary data
//     // function formatSummary(dateData, mealsData) {
//     //     return {
//     //         Date: dateData.date || new Date().toISOString().split('T')[0],  // Default to today if no date provided
//     //         numberOfMeals: mealsData.numberOfMeals,
//     //         mTWater: mealsData.mTWater,
//     //         mTEnergyKcal: mealsData.mTEnergyKcal,
//     //         totalCalories: dateData.totalCalories
//     //     };
//     // }

//     // // Create summaries for today and other dates
//     // const todaySummary = formatSummary(activityData.today, mealData.today);
//     // const otherDatesSummary = formatSummary(activityData.otherDates, mealData.otherDates);

//     // return {
//     //     today: todaySummary,
//     //     otherDates: otherDatesSummary
//     // }; 
//     const summary = {
//         Date: new Date().toISOString().split('T')[0],  // Get today's date in YYYY-MM-DD format
//         numberOfMeals: categorizedMeals.numberOfMeals,
//         mTWater: categorizedMeals.mTWater,
//         mTEnergyKcal: categorizedMeals.mTEnergyKcal,
//         totalCalories: categorizedActivity.totalCalories
//     };

//     return summary;
// }

// function sumCalories(entries) {
//     return entries.reduce((total, entry) => total + entry.caloriesBurned, 0);
// }
