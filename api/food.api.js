// Alle API-funktioner

// API der henter data fra vores søge input
async function searchFoodItems(searchTerm) { // API pulling data from our search input.  
    const apiUrl = `https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch/${encodeURIComponent(searchTerm)}`; //for at sikre sig at formaten er rigtig bruger vi "encodeURIComponent". 
    const apiKey = '171390';

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "X-API-Key": apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Henter macros på ingredienser
async function getMacros(foodId, sortKeys) {
    const promises = sortKeys.map(key => getMacro(foodId, key));
    const results = await Promise.allSettled(promises);

    let macros = {};
    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.value !== undefined) {

            //Object
            macros[result.value.key] = {
                parameterName: result.value.parameterName,
                resVal: result.value.value
            };
        } else {
            console.error(`Failed to fetch data for key ${result.value.key}`);
            macros[result.value.key] = {
                parameterName: 'Error or no data',
                resVal: 'Error or no data'
            };
        }
    });

    return macros;
}

//
async function getMacro(foodId, sortKey) {
    const apiUrl = `https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${encodeURIComponent(foodId)}/BySortKey/${encodeURIComponent(sortKey)}`;
    const apiKey = '171390';

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "X-API-Key": apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Each response is an array and we are using the first [i] for rasVal.
        if (data.length > 0) {
            return { key: sortKey, parameterName: data[0].parameterName, value: data[0].resVal };
        } else {
            return { key: sortKey, parameterName: null, value: null };
        }
    } catch (error) {
        console.error(`Error fetching macro data for sort key ${sortKey}:`, error);
        return { key: sortKey, error };
    }
}
async function getInfo(foodId) {
    const apiUrl = `https://nutrimonapi.azurewebsites.net/api/FoodItems/${encodeURIComponent(foodId)}`;
    const apiKey = '171390';

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "X-API-Key": apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract taxonomicValue and foodGroup from the response
        const taxonomicName = data.taxonomicName || null;
        const foodGroup = data.foodGroup || null;

        return { taxonomicName, foodGroup };
    } catch (error) {
        console.error(`Error fetching data for food ID ${foodId}:`, error);
        return { taxonomicName: null, foodGroup: null };
    }
}