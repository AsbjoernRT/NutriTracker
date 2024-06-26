import index from '../index.js'

import moment from 'moment'

export const sendLocationToServer = async (req, res) => {
    try {

        // Opretter forbindelse til Nominatim API med korrekte headers
        const cityResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.body.latitude}&lon=${req.body.longitude}`, {
            method: 'GET',
        });

        if (!cityResponse.ok) {
            // Håndterer fejl, hvis respons fra serveren ikke er "OK"
            throw new Error(`HTTP error! Status: ${cityResponse.status}`);
        }

        const cityData = await cityResponse.json();

        // Udtrækker bynavn fra svaret, eller angiver en fejlmeddelelse hvis ikke fundet
        const cityName = cityData.address?.town || cityData.address?.city || cityData.address?.village || cityData.address?.hamlet || cityData.address?.suburb || "Location not found";
        console.log("City Name:", cityName);
        res.json({ cityName });  // Sender bynavnet som et svar til klienten
    } catch (error) {
        // Logger eventuelle fejl som opstår under udførsel af funktionen
        console.error('Failed to fetch city name:', error);
    }
}

// Funktion til at tilføje en vægt til et måltid
export const addWeightToMeal = async (req, res) => {

    console.log("Back-end received:", req.body);

    // Henter variabler fra anmodningens krop
    const mealID = req.body.mealID
    const recipeName = req.body.recipeName
    const quantity = req.body.quantity;
    const userID = req.body.userID
    const getCityFromLocation = req.body.cityName

    console.log("Meal ID: ", mealID, "geolokation", req.body.cityName);

    // Henter de samlede næringsstoffer for måltidet fra databasen
    const getMacro = await index.connectedDatabase.getTotalNutriens(mealID)

    console.log(getMacro);

    // Beregner de samlede næringsstoffer baseret på mængden
    const getTotalEnergyKj = (quantity / 100) * getMacro[0].tEnergyKj
    const getTotalProtein = (quantity / 100) * getMacro[0].tProtein
    const getTotalFat = (quantity / 100) * getMacro[0].tFat
    const getTotalFiber = (quantity / 100) * getMacro[0].tFiber
    const getTotalEnergyKcal = (quantity / 100) * getMacro[0].tEnergyKcal
    const getTotalWater = (quantity / 100) * getMacro[0].tWater
    const getTotalDryMatter = (quantity / 100) * getMacro[0].tDryMatter


    // Registrerer tidspunktet for måltidets tilføjelse

    const regTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');


    try {

        // Indsætter måltidet med tilføjede vægt i databasen
        const mealTracked = await index.connectedDatabase.postIntoDbMealTracker(userID, mealID, quantity, regTime, getCityFromLocation, getTotalEnergyKj, getTotalProtein, getTotalFat, getTotalFiber, getTotalEnergyKcal, getTotalWater, getTotalDryMatter);
        console.log("Meal Created with ID:", mealTracked);

        // Sikrer, at måltids-ID'et er gyldigt, før der fortsættes
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }

        res.json({ success: true, message: `Meal created with ID ${mealID}` });
    } catch (error) {
        console.error("Error in addWeightToMeal:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Opdatere vægt for måltid

export const updateWeightForMeal = async (req, res) => {
    console.log("Back-end received:", req.body);

    const userID = req.body.userID
    const mealID = req.body.mealID
    const regID = req.body.regID
    const quantity = req.body.quantity
    const singleIngredientId = req.body.singleIngredientId


    const getMacro = await index.connectedDatabase.getTotalNutriens(mealID)
    const ingredients = await index.connectedDatabase.searchIngredientById(singleIngredientId)
    console.log('getIngredients', ingredients);

    console.log('getMacro', getMacro);


    // Check if getMacro is empty
    if (Array.isArray(getMacro) && getMacro.length === 0) {
        console.log('No macro nutrient data found for mealID:', mealID);

        const ingredient = ingredients[0]

            const mTEnergyKj = (quantity / 100) * ingredient.energyKj
            const mTProtein = (quantity / 100) * ingredient.protein
            const mTFat = (quantity / 100) * ingredient.fat
            const mTFiber = (quantity / 100) * ingredient.fiber
            const mTEnergyKcal = (quantity / 100) * ingredient.energyKcal
            const mTWater = (quantity / 100) * ingredient.water
            const mTDryMatter = (quantity / 100) * ingredient.dryMatter
        
            const updateTrackedMeal = await index.connectedDatabase.updateTrackedMeal(regID, mealID, quantity, mTEnergyKj, mTProtein, mTFat, mTFiber, mTEnergyKcal, mTWater, mTDryMatter);
            console.log("Ingredient snack updated", updateTrackedMeal);
            res.status(200).json({ success: true, message: 'Snack updated successfully' });
    } else {
        try {
            const mTEnergyKj = (quantity / 100) * getMacro[0].tEnergyKj
            const mTProtein = (quantity / 100) * getMacro[0].tProtein
            const mTFat = (quantity / 100) * getMacro[0].tFat
            const mTFiber = (quantity / 100) * getMacro[0].tFiber
            const mTEnergyKcal = (quantity / 100) * getMacro[0].tEnergyKcal
            const mTWater = (quantity / 100) * getMacro[0].tWater
            const mTDryMatter = (quantity / 100) * getMacro[0].tDryMatter


            const updateTrackedMeal = await index.connectedDatabase.updateTrackedMeal(regID, mealID, quantity, mTEnergyKj, mTProtein, mTFat, mTFiber, mTEnergyKcal, mTWater, mTDryMatter);
            console.log(updateTrackedMeal);
            res.status(200).json({ success: true, message: 'Meal updated successfully' });
        } catch (error) {
            console.error('Update failed:', error);
            res.status(500).json({ success: false, message: 'Failed to update meal' });
        }
    }
};


// export const postIntoDbMealTracker = async (req,res) => {


// }

export const createSnackInMealTracker = async (req, res) => {

    const userID = req.session.user.userID
    console.log('createSnackInMealTracker body', req.body);
    // Udpakker relevante oplysninger fra anmodningen
    const { mealIngredientName, cityName, quantityInput, energyKJ,
        singleIngredientId,
        protein,
        fat,
        fiber,
        energyKcal,
        water,
        dryMatter } = req.body;

    console.log(mealIngredientName, cityName);
    console.log('create snack stuff', mealIngredientName, singleIngredientId);

    const mealName = req.body.mealIngredientName
    const mealType = "singleIngredient"
    const source = "snack"
    const quantity = req.body.quantityInput

    console.log("Back-end received:", req.body);


    try {
        // Opretter først måltidet og får måltids-ID'et
        const mealID = await index.connectedDatabase.postIntoDbMeal(mealName, userID, mealType, source, "", singleIngredientId);
        console.log("Meal Created with ID:", mealID);

        // Sørg for, at måltids-ID'et er gyldigt, før der fortsættes
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }


        const quantityTimesInput = (quantity / 100)
        // Akkumuler makro totaler
        const totalWeight = quantity;
        const totalEnergyKj = energyKJ * quantityTimesInput;
        const totalProtein = protein * quantityTimesInput;
        const totalFat = fat * quantityTimesInput;
        const totalFiber = fiber * quantityTimesInput;
        const totalEnergyKcal = energyKcal * quantityTimesInput;
        const totalWater = water * quantityTimesInput;
        const totalDryMatter = dryMatter * quantityTimesInput;



        req.session.meal = {
            mealID: mealID,
            mealName: mealName,
            mealType: mealType,
            source: source,
        };


        const getCityFromLocation = req.body.cityName

        console.log("Meal ID: ", mealID, "geolokation", req.body.cityName);


        // Registrerer tidspunktet for måltidets tilføjelse

        const regTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');


        try {

            // Indsætter måltidet med tilføjede vægt i databasen
            const mealTracked = await index.connectedDatabase.postIntoDbMealTracker(userID, mealID, totalWeight, regTime, getCityFromLocation, totalEnergyKj, totalProtein, totalFat, totalFiber, totalEnergyKcal, totalWater, totalDryMatter);
            console.log("Meal Created with ID:", mealTracked);

            // Sikrer, at måltids-ID'et er gyldigt, før der fortsættes
            if (!mealID) {
                throw new Error("Meal creation failed, no ID returned.");
            }

            res.json({ success: true, message: `Meal created with ID ${mealID}` });
        } catch (error) {
            console.error("Error in addWeightToMeal:", error);
            res.status(500).json({ success: false, message: error.message });
        }

        // await req.session.save();

        // Send a successful response
        // res.status(201).send({ message: "Meal and ingredients successfully created", mealId: mealID });
    } catch (error) {
        console.error("Error in creating meal or adding ingredients:", error);
        res.status(500).send({ error: "Internal server error", details: error.message });
    }
};





// Sletter et meal der er oprettet i mealTracker
export const deleteTrackedMeal = async (req, res) => {
    // Henter brugerens ID fra sessionen
    const userID = req.session.user.userID
    const regID = req.body.regID
    console.log("Back-end Modtaget: ", userID, "&", regID);
    const deleteMeal = await index.connectedDatabase.deleteTrackedMeal(regID, userID);

}

