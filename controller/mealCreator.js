import index from '../index.js'

// Funktion til at oprette et måltid i databasen
export const mealCreator = async (req, id, res) => {
    // Udpakker relevante oplysninger fra anmodningen
    const { mealName, mealType, source, ingredients, mealCategory } = req.body;

    console.log("Back-end received:", req.body);

    // Validerer ingrediensarrayet
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).send("No ingredients provided or incorrect format.");
    }

    try {
        // Opretter først måltidet og får måltids-ID'et
        const mealID = await index.connectedDatabase.postIntoDbMeal(mealName, id, mealType, source, mealCategory);
        console.log("Meal Created with ID:", mealID);

        // Sørg for, at måltids-ID'et er gyldigt, før der fortsættes
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }

        // Initialiser makro totaler
        let totalWeight = 0;
        let totalEnergyKj = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalEnergyKcal = 0;
        let totalWater = 0;
        let totalDryMatter = 0;

        // Calculate cumulative macro values
        const processedIngredients = ingredients.map(ingredient => {
            return {
                ...ingredient,
                cEnergyKj: ingredient.energyKj * (ingredient.quantity / 100),
                cProtein: ingredient.protein * (ingredient.quantity / 100),
                cFat: ingredient.fat * (ingredient.quantity / 100),
                cFiber: ingredient.fiber * (ingredient.quantity / 100),
                cEnergyKcal: ingredient.energyKcal * (ingredient.quantity / 100),
                cWater: ingredient.water * (ingredient.quantity / 100),
                cDryMatter: ingredient.dryMatter * (ingredient.quantity / 100)
            };
        });

        console.log("Processed Ingredients:", processedIngredients);

        console.log(ingredients);

        // Itererer over hver ingrediens og tilføjer dem til måltidet
        for (const ingredient of processedIngredients) {
            const { ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter } = ingredient;
            const addIngredientResult = await index.connectedDatabase.postIntoDbMealIngredient(
                mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter
            );
            console.log(`Ingredient ${ingredientID} added to meal ${mealID}:`, addIngredientResult);

            // Akkumuler makro totaler
            totalWeight += quantity;
            totalEnergyKj += cEnergyKj;
            totalProtein += cProtein;
            totalFat += cFat;
            totalFiber += cFiber;
            totalEnergyKcal += cEnergyKcal;
            totalWater += cWater;
            totalDryMatter += cDryMatter;
        }

        // Beregn makroer pr. 100g
        const macrosPer100g = {
            energyKjPer100g: (totalEnergyKj / totalWeight) * 100,
            proteinPer100g: (totalProtein / totalWeight) * 100,
            fatPer100g: (totalFat / totalWeight) * 100,
            fiberPer100g: (totalFiber / totalWeight) * 100,
            energyKcalPer100g: (totalEnergyKcal / totalWeight) * 100,
            waterPer100g: (totalWater / totalWeight) * 100,
            dryMatterPer100g: (totalDryMatter / totalWeight) * 100,
        };

        console.log(macrosPer100g);

        // Kald til SQL-funktionen til at opdatere makrototaler i databasen
        const macroResult = await index.connectedDatabase.postCmacroMeal(mealID,
            macrosPer100g.energyKjPer100g,
            macrosPer100g.proteinPer100g,
            macrosPer100g.fatPer100g,
            macrosPer100g.fiberPer100g,
            macrosPer100g.energyKcalPer100g,
            macrosPer100g.waterPer100g,
            macrosPer100g.dryMatterPer100g);



        // Gem måltidsdetaljer og makroer i sessionen
        req.session.meal = {
            mealID: mealID,
            mealName: mealName,
            mealType: mealType,
            mealCategory: mealCategory,
            source: source,
            ingredients: ingredients,
            macrosPer100g: macrosPer100g
        };

        await req.session.save();

        console.log(req.session.meal);
        // Send a successful response
        res.status(201).send({ message: "Meal and ingredients successfully created", mealId: mealID });
    } catch (error) {
        console.error("Error in creating meal or adding ingredients:", error);
        res.status(500).send({ error: "Internal server error", details: error.message });
    }
};

// Funktion til at updatere et måltid
export const updateMeal = async (req, userID, res) => {
    // Udpakker relevante oplysninger fra anmodningen
    const { mealName, mealType, source, ingredients, mealID } = req.body;

    console.log("Back-end received:", req.body);

    const getIngredients = await index.connectedDatabase.getAllIngredientsForMeal(mealID)
    console.log(getIngredients);

    console.log(checkIngredients(ingredients, getIngredients))

    function checkIngredients(receivedIngredients, dbIngredients) {
        const dbIngredientIDs = new Set(dbIngredients.map(i => i.ingredientID));
        const receivedIngredientIDs = new Set(receivedIngredients.map(i => i.ingredientID));

        // Determine if there are any unmatched ingredients in the database to be deleted
        if (dbIngredientIDs.size > receivedIngredientIDs.size) {
            const toDelete = dbIngredients.filter(ing => !receivedIngredientIDs.has(ing.ingredientID));
            return { action: 'delete', items: toDelete };
        }
        // Determine if there are new ingredients to be inserted
        else if (receivedIngredientIDs.size > dbIngredientIDs.size) {
            const toInsert = receivedIngredients.filter(ing => !dbIngredientIDs.has(ing.ingredientID));
            insertnewIngredient(toInsert)
            updateMeal(ingredients)
            return { action: 'insert', items: toInsert };
        }
        // Default to update if the sets are equal
        else {
            updateMeal(ingredients)
            return { action: 'update', items: receivedIngredients };

        }
    }

    async function insertnewIngredient(ingredients) {
        // Sørg for, at måltids-ID'et er gyldigt, før der fortsættes
        if (!mealID) {
            throw new Error("Meal creation failed, no ID returned.");
        }

        // Initialiser makro totaler
        let totalWeight = 0;
        let totalEnergyKj = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalEnergyKcal = 0;
        let totalWater = 0;
        let totalDryMatter = 0;

        // Calculate cumulative macro values
        const processedIngredients = ingredients.map(ingredient => {
            return {
                ...ingredient,
                cEnergyKj: ingredient.energyKj * (ingredient.quantity / 100),
                cProtein: ingredient.protein * (ingredient.quantity / 100),
                cFat: ingredient.fat * (ingredient.quantity / 100),
                cFiber: ingredient.fiber * (ingredient.quantity / 100),
                cEnergyKcal: ingredient.energyKcal * (ingredient.quantity / 100),
                cWater: ingredient.water * (ingredient.quantity / 100),
                cDryMatter: ingredient.dryMatter * (ingredient.quantity / 100)
            };
        });

        console.log("Processed Ingredients:", processedIngredients);

        console.log(ingredients);

        // Itererer over hver ingrediens og tilføjer dem til måltidet
        for (const ingredient of processedIngredients) {
            const { ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter } = ingredient;
            const addIngredientResult = await index.connectedDatabase.postIntoDbMealIngredient(
                mealID, ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter
            );
            console.log(`Ingredient ${ingredientID} added to meal ${mealID}:`, addIngredientResult);

            // Akkumuler makro totaler
            totalWeight += quantity;
            totalEnergyKj += cEnergyKj;
            totalProtein += cProtein;
            totalFat += cFat;
            totalFiber += cFiber;
            totalEnergyKcal += cEnergyKcal;
            totalWater += cWater;
            totalDryMatter += cDryMatter;
        }

        // Beregn makroer pr. 100g
        const macrosPer100g = {
            energyKjPer100g: (totalEnergyKj / totalWeight) * 100,
            proteinPer100g: (totalProtein / totalWeight) * 100,
            fatPer100g: (totalFat / totalWeight) * 100,
            fiberPer100g: (totalFiber / totalWeight) * 100,
            energyKcalPer100g: (totalEnergyKcal / totalWeight) * 100,
            waterPer100g: (totalWater / totalWeight) * 100,
            dryMatterPer100g: (totalDryMatter / totalWeight) * 100,
        };

        console.log(macrosPer100g);
    }


    async function updateMeal(ingredients) {



        // Validerer ingrediensarrayet
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).send("No ingredients provided or incorrect format.");
        }

        const processedIngredients = ingredients.map(ingredient => {
            // Check if cMacros are provided
            if (!ingredient.cEnergyKj || !ingredient.cProtein) {
                const calculatedCMacros = calculateCMacros(ingredient);
                // Merge calculated cMacros with existing ingredient data
                return { ...ingredient, ...calculatedCMacros };
            }
            return ingredient; // Return ingredient if cMacros are already provided
        });

        // Proceed to save processedIngredients into the database or further processing
        console.log("Processed Ingredients:", processedIngredients);

        function calculateCMacros(ingredient) {
            const { energyKj, protein, fat, fiber, energyKcal, water, dryMatter, quantity } = ingredient;
            return {
                cEnergyKj: (energyKj * quantity / 100) || 0,
                cProtein: (protein * quantity / 100) || 0,
                cFat: (fat * quantity / 100) || 0,
                cFiber: (fiber * quantity / 100) || 0,
                cEnergyKcal: (energyKcal * quantity / 100) || 0,
                cWater: (water * quantity / 100) || 0,
                cDryMatter: (dryMatter * quantity / 100) || 0,
            };
        }


        // Initialiser makro totaler
        let totalWeight = 0;
        let totalEnergyKj = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalEnergyKcal = 0;
        let totalWater = 0;
        let totalDryMatter = 0;


        // Itererer over hver ingrediens og tilføjer dem til måltidet
        for (const ingredient of processedIngredients) {
            const { ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter } = ingredient;
            console.log(ingredient.id);
            // Akkumuler makro totaler
            totalWeight += quantity;
            totalEnergyKj += cEnergyKj;
            totalProtein += cProtein;
            totalFat += cFat;
            totalFiber += cFiber;
            totalEnergyKcal += cEnergyKcal;
            totalWater += cWater;
            totalDryMatter += cDryMatter;


            // Beregn makroer pr. 100g
            const macrosPer100g = {
                energyKjPer100g: (totalEnergyKj / totalWeight) * 100,
                proteinPer100g: (totalProtein / totalWeight) * 100,
                fatPer100g: (totalFat / totalWeight) * 100,
                fiberPer100g: (totalFiber / totalWeight) * 100,
                energyKcalPer100g: (totalEnergyKcal / totalWeight) * 100,
                waterPer100g: (totalWater / totalWeight) * 100,
                dryMatterPer100g: (totalDryMatter / totalWeight) * 100,
            };

            console.log(macrosPer100g);

            // Kald til SQL-funktionen til at opdatere makrototaler i databasen
            // const macroResult = await index.connectedDatabase.postCmacroMeal(mealID,
            //     macrosPer100g.energyKjPer100g,
            //     macrosPer100g.proteinPer100g,
            //     macrosPer100g.fatPer100g,
            //     macrosPer100g.fiberPer100g,
            //     macrosPer100g.energyKcalPer100g,
            //     macrosPer100g.waterPer100g,
            //     macrosPer100g.dryMatterPer100g);


            const addIngredientResult = await index.connectedDatabase.updateMealIngredient(ingredientID, quantity, cEnergyKj, cProtein, cFat, cFiber, cEnergyKcal, cWater, cDryMatter,
                mealID, macrosPer100g.energyKjPer100g,
                macrosPer100g.proteinPer100g,
                macrosPer100g.fatPer100g,
                macrosPer100g.fiberPer100g,
                macrosPer100g.energyKcalPer100g,
                macrosPer100g.waterPer100g,
                macrosPer100g.dryMatterPer100g
            );

            console.log(`Ingredient ${ingredientID} added to meal ${mealID}:`, addIngredientResult);


            // Gem måltidsdetaljer og makroer i sessionen
            req.session.meal = {
                mealID: mealID,
                mealName: mealName,
                mealType: mealType,
                source: source,
                ingredients: ingredients,
                macrosPer100g: macrosPer100g
            };

            await req.session.save();
        }

    }
}







// Funktion til at hente måltider fra databasen
export const getMeals = async (req, res) => {
    // Tjekker om brugeren er logget ind
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
        // Henter brugerens ID fra sessionen
        const userID = req.session.user.userID;
        // Henter alle måltider tilhørende den pågældende bruger fra databasen
        const meals = await index.connectedDatabase.getAllUserRecipes(userID);


        console.log("Meals retrieved from the database:", meals);

        // Grupperer måltiderne efter unikke måltids-ID'er og aggregerer ernæringsmæssige oplysninger
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
                energyKj,
                protein,
                fat,
                energyKcal,
                water,
                dryMatter,
            } = item;

            // Kontrollerer om mealID er et array og tager det første element, eller bruger det som det er, hvis det ikke er
            const uniqueMealID = Array.isArray(mealID) ? mealID[0] : mealID;

            // Opretter et nyt måltid i akkumulatoren, hvis det ikke allerede findes
            if (!acc[uniqueMealID]) {
                acc[uniqueMealID] = {
                    mealID: uniqueMealID, // Tildeler måltids-ID direkte som et INT
                    name,
                    userID,
                    mealType,
                    source,
                    mealCategory,
                    ingredients: [],
                    ingredientCount: 0,  // Initialiserer tælleren
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
                        aQuanity: 0
                    }
                };
            }
            // Tilføjer hver ingrediens til det relevante måltid
            acc[uniqueMealID].ingredients.push({
                ingredientID,
                foodName,
                mealIngredientID,
                quantity,
                cEnergyKj,
                cProtein,
                cFat,
                cFiber,
                cEnergyKcal,
                cWater,
                cDryMatter,
                energyKj,
                protein,
                fat,
                energyKcal,
                water,
                dryMatter,
            });

            // Inkrementerer ingrediensantallet
            acc[uniqueMealID].ingredientCount++;

            // Aggregerer ernæringsmæssige oplysninger
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
        // Konverterer måltiderne til et array og sender dem som JSON-svar
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


// Funktion til at slette et måltid
export const deleteMeal = async (req, res) => {
    // Henter brugerens ID fra sessionen
    const userID = req.session.user.userID
    // Henter måltids-ID'et fra anmodningens krop
    const mealID = req.body.mealID
    console.log("Back-end Modtaget: ", userID, "&", mealID);
    // Kalder funktionen til at slette måltidet fra databasen og venter på svar
    const deleteMeal = await index.connectedDatabase.deleteMeal(mealID, userID);
}

