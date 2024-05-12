import index from '../index.js'
import { calculateMetabolism, calculateRemainingCalories, calculateBurnedKcal, categorizeActiviityDate, categorizeMealDate, createDailySummaries } from '../controller/calculater.js'

export const updateUser = async (req, res) => {
    const { age, weight, gender } = req.body;
    const email = req.session.user.email

    const cMetabolism = calculateMetabolism(age, gender, weight)
    console.log("Session Data: ", email, age, weight, gender, cMetabolism);

    const updateUser = await index.connectedDatabase.updateUser(email, age, weight, gender, cMetabolism);
    console.log("Database update result:", updateUser);


    const user = await index.connectedDatabase.getUserByMail(email)
    console.log(req.session.user);

    console.log(updateUser);
    req.session.user = user
    req.session.user.metabolism = cMetabolism
    console.log("Updated session user:", req.session.user);
    
}

export const deleteUser = async (req, res) => {
    console.log("backend: ", req.session.user);
    const { userID, email } = req.session.user;

    console.log(userID, email);

    const deleteUser = await index.connectedDatabase.deleteUserId(userID)

    console.log("User to delete: ", deleteUser);
}

export const getMealAndActivity = async (req, res) => {

    const user = await index.connectedDatabase.getUserByMail(req.session.user.email)
    req.session.user = user
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
}

export const getUserInfo = async (req, res) => {

    const user = await index.connectedDatabase.getUserByMail(req.session.user.email)
    

    res.json(user);
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
