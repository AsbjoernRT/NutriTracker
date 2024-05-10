import index from '../index.js'


export const mealcreator = async (req, id, res) => {
    const { mealName, mealType, source, ingredients } = req.body;

    console.log("Back-end received:", req.body);

    // Validate ingredients array
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).send("No ingredients provided or incorrect format.");
    }

    try {
        // Create the meal first and get the meal ID
        const mealID = await index.connectedDatabase.postIntoDbMeal(mealName, id, mealType, source);
        console.log("Meal Created with ID:", mealID);

        // Ensure meal ID is valid before proceeding
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }

        // Initialize macro totals
        let totalWeight = 0;
        let totalEnergyKj = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalEnergyKcal = 0;
        let totalWater = 0;
        let totalDryMatter = 0;



        // Iterate over each ingredient and add them to the meal
        for (const ingredient of ingredients) {
            const { ingredientID, weight, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter } = ingredient;
            const addIngredientResult = await index.connectedDatabase.postIntoDbMealIngredient(
                mealID, ingredientID, weight, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter
            );
            console.log(`Ingredient ${ingredientID} added to meal ${mealID}:`, addIngredientResult);

            // Accumulate macro totals
            totalWeight += weight;
            totalEnergyKj += cEnergyKj;
            totalProtein += cProtein;
            totalFat += cFat;
            totalFiber += cFiber;
            totalEnergyKcal += cEnergyKcal;
            totalWater += cWater;
            totalDryMatter += cDryMatter;
        }

        // Calculate macros per 100g
        const macrosPer100g = {
            energyKjPer100g: (totalEnergyKj / totalWeight) * 100,
            proteinPer100g: (totalProtein / totalWeight) * 100,
            fatPer100g: (totalFat / totalWeight) * 100,
            fiberPer100g: (totalFiber / totalWeight) * 100,
            energyKcalPer100g: (totalEnergyKcal / totalWeight) * 100,
            waterPer100g: (totalWater / totalWeight) * 100,
            dryMatterPer100g: (totalDryMatter / totalWeight) * 100,
        };

        console.log(macrosPer100g.dryMatterPer100g);

        // Call the SQL function to update macro totals in the database
        const macroResult = await index.connectedDatabase.postCmacroMeal(mealID,
            macrosPer100g.energyKjPer100g,
            macrosPer100g.proteinPer100g,
            macrosPer100g.fatPer100g,
            macrosPer100g.fiberPer100g,
            macrosPer100g.energyKcalPer100g,
            macrosPer100g.waterPer100g,
            macrosPer100g.dryMatterPer100g);



        // Save meal details and macros in the session
        req.session.meal = {
            mealID: mealID,
            mealName: mealName,
            mealType: mealType,
            source: source,
            ingredients: ingredients,
            macrosPer100g: macrosPer100g
        };

        await req.session.save(); // Ensure session is saved

        console.log(req.session.meal);
        // Send a successful response
        res.status(201).send({ message: "Meal and ingredients successfully created", mealId: mealID });
    } catch (error) {
        console.error("Error in creating meal or adding ingredients:", error);
        res.status(500).send({ error: "Internal server error", details: error.message });
    }
};

export const getMeals = async (req, res) => {
    // Check if user is logged in
    if (!req.session.user || !req.session.loggedin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Check if meal data is available in the session
    // if (req.session.meal) {
    //     console.log("Using cached meal data from session: ", req.session.meal);
    //     res.json(req.session.meal, {
    //         mealID: req.session.meal.mealId,
    //         mealName: req.session.meal.mealName,
    //         mealType: req.session.meal.mealType,
    //         source: req.session.meal.source,
    //         ingredients: req.session.meal.ingredients,
    //         macrosPer100g: req.session.meal.macrosPer100g
    //     });
    // Meal data is not in session, fetch it from the database
    try {
        const userID = req.session.user.userID;
        const meals = await index.connectedDatabase.getAllUserRecipes(userID);


        console.log("Meals retrieved from the database:", meals);

        const groupedMeals = meals.reduce((acc, item) => {
            const { mealID, name, userID, mealType, source, mealCategory, ingredientID, foodName, mealIngredientID, quantity, tEnergyKj,
                tProtein,
                tFat,
                tFiber,
                tEnergyKcal,
                tWater,
                tDryMatter,
                cEnergyKj,
                cProtein,
                cFat,
                cFiber,
                cEnergyKcal,
                cWater,
                cDryMatter,
                ...otherNutrients
            } = item;

            // Check if mealID is an array and take the first element, or use it as is if it's not
            const uniqueMealID = Array.isArray(mealID) ? mealID[0] : mealID;

            if (!acc[uniqueMealID]) {
                acc[uniqueMealID] = {
                    mealID: uniqueMealID, // Assign mealID directly as an integer
                    name,
                    userID,
                    mealType,
                    source,
                    mealCategory,
                    ingredients: [],
                    ingredientCount: 0,  // Initialize the counter
                    totalNutrients: {
                        tEnergyKj,
                        tProtein,
                        tFat,
                        tFiber,
                        tEnergyKcal,
                        tWater,
                        tDryMatter,
                    },
                    aggregatedNutrients: {
                        aEnergyKj: 0,
                        aProtein: 0,
                        aFat: 0,
                        aFiber: 0,
                        aEnergyKcal: 0,
                        aWater: 0,
                        aDryMatter: 0,
                        aQuanity:0
                    }
                };
            }
            acc[uniqueMealID].ingredients.push({
                ingredientID,
                foodName,
                mealIngredientID,
                quantity,
                nutritionalValues: {
                    cEnergyKj,
                    cProtein,
                    cFat,
                    cFiber,
                    cEnergyKcal,
                    cWater,
                    cDryMatter,
                }
            });

            // Increment ingredient count
            acc[uniqueMealID].ingredientCount++;

            // Aggregate nutrient totals
            acc[uniqueMealID].aggregatedNutrients.aEnergyKj += cEnergyKj;
            acc[uniqueMealID].aggregatedNutrients.aProtein += cProtein;
            acc[uniqueMealID].aggregatedNutrients.aFat += cFat;
            acc[uniqueMealID].aggregatedNutrients.aFiber += cFiber;
            acc[uniqueMealID].aggregatedNutrients.aEnergyKcal += cEnergyKcal;
            acc[uniqueMealID].aggregatedNutrients.aWater += cWater;
            acc[uniqueMealID].aggregatedNutrients.aDryMatter += cDryMatter;
            acc[uniqueMealID].aggregatedNutrients.aQuanity += quantity;

            return acc;
        }, {});

        const formattedMeals = Object.values(groupedMeals);

        console.log(formattedMeals);

        res.json(groupedMeals);

        // // Assuming meals contain all required data
        // req.session.meal = meals;
        // req.session.save(err => {
        //     if (err) {
        //         console.error("Error saving session:", err);
        //         res.status(500).json({ error: 'Failed to save session data' });
        //     } else {
        //         res.json(meals);
        //     }
        // });
    } catch (error) {
        console.error("Failed to retrieve meals from the database:", error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};


export const deleteMeal = async (req, res) => {
    // console.log("Back-end Modtaget: ",req.body.mealID);
    const userID = req.session.user.userID
    const mealID = req.body.mealID
    console.log("Back-end Modtaget: ", userID, "&", mealID);
    const deleteMeal = await index.connectedDatabase.deleteMeal(mealID, userID);
    console.log(deleteMeal);
}