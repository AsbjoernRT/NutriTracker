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

    console.log("Back-end received:", req.body.cityName);

    // Henter variabler fra anmodningens krop
    const mealID = req.body.mealID
    const recipeName = req.body.recipeName
    const quantity = req.body.quantity;
    const userID = req.body.userID
    const getCityFromLocation = req.body.cityName

    console.log("Meal ID: ", mealID, "geolokation", req.body.cityName);

    // Henter de samlede næringsstoffer for måltidet fra databasen
    const getMacro = await index.connectedDatabase.getTotalNutriens(mealID)
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


export const createSnackInMealTracker = async (req, res) => {

    const userID = req.session.user.userID
    // Udpakker relevante oplysninger fra anmodningen
    const { ingredients, cityName } = req.body;

    console.log(ingredients, cityName);

    const mealName = ingredients.foodName
    const mealType = "singleIngredient"
    const source = "snack"

    console.log("Back-end received:", req.body);


    try {
        // Opretter først måltidet og får måltids-ID'et
        const mealID = await index.connectedDatabase.postIntoDbMeal(mealName, userID, mealType, source);
        console.log("Meal Created with ID:", mealID);

        // Sørg for, at måltids-ID'et er gyldigt, før der fortsættes
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }




        const { ingredientID, quantity, energyKj, protein, fat, fiber, energyKcal, water, dryMatter } = ingredients;
        const addIngredientResult = await index.connectedDatabase.postIntoDbMealIngredient(
            mealID, ingredientID, quantity, energyKj, protein, fat, fiber, energyKcal, water, dryMatter
        );
        console.log(`Ingredient ${ingredientID} added to meal ${mealID}:`, addIngredientResult);

        const quantityTimesInput = (quantity / 100)
        // Akkumuler makro totaler
        const totalWeight = quantity;
        const totalEnergyKj = energyKj * quantityTimesInput;
        const totalProtein = protein * quantityTimesInput;
        const totalFat = fat * quantityTimesInput;
        const totalFiber = fiber * quantityTimesInput;
        const totalEnergyKcal = energyKcal * quantityTimesInput;
        const totalWater = water * quantityTimesInput;
        const totalDryMatter = dryMatter * quantityTimesInput;


        // // Beregn makroer pr. 100g
        // const macrosPer100g = {
        //     energyKjPer100g: (totalEnergyKj / totalWeight) * 100,
        //     proteinPer100g: (totalProtein / totalWeight) * 100,
        //     fatPer100g: (totalFat / totalWeight) * 100,
        //     fiberPer100g: (totalFiber / totalWeight) * 100,
        //     energyKcalPer100g: (totalEnergyKcal / totalWeight) * 100,
        //     waterPer100g: (totalWater / totalWeight) * 100,
        //     dryMatterPer100g: (totalDryMatter / totalWeight) * 100,
        // };

        // console.log(macrosPer100g);

        // Kald til SQL-funktionen til at opdatere makrototaler i databasen
        const macroResult = await index.connectedDatabase.postCmacroMeal(mealID, ingredientID, quantity, energyKj, protein, fat, fiber, energyKcal, water, dryMatter);
        console.log("Macrolog:", macroResult);


        // Gem måltidsdetaljer og makroer i sessionen
        req.session.meal = {
            mealID: mealID,
            mealName: mealName,
            mealType: mealType,
            source: source,
            ingredients: ingredients
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

