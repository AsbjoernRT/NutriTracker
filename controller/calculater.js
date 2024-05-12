export function calculateMetabolism(age, gender, weight) {
    let basalMetabolism = 0;

    // Beregn basalstofskiftet baseret på alder, køn, vægt og højde
    if (gender === 'male') {
        // Beregninger for mandlige brugere baseret på alder
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
            // Beregninger for kvindelige brugere baseret på alder
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
 // Konverter basalstofskiftet til kalorier pr. dag
    basalMetabolism *= 239;

    return basalMetabolism;
}
// Funktion til at beregne forbrændte kalorier fra aktiviteter
export function calculateBurnedKcal(activites){
    console.log(activites);
}


// Funktion til at beregne de resterende kalorier for dagen
export function calculateRemainingCalories(req) {
    console.log(req.session.user.metabolism);

    // Henter brugerens stofskifte fra sessionsoplysningerne
    const metabolism = req.session.user.metabolism;
    // Beregner stofskiftet per time
    const metabolismPerHour = metabolism / 24;

    // Opretter et nyt datoobjekt til det aktuelle tidspunkt
    const now = new Date();
    // Finder den aktuelle time (0-23)
    const currentHour = now.getHours();
    console.log(currentHour);

    // Beregner det brugte stofskifte baseret på den aktuelle time
    const usedMetabolism = metabolismPerHour * currentHour;
    console.log(usedMetabolism); 
   
    return usedMetabolism;  // Returnerer det brugte stofskifte
}

// Funktion til at kategorisere aktivitetsdata efter dato
export function categorizeActiviityDate(entries) {
 // Initialisering af variabler til at holde data for i dag og andre datoer
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Nulstil tidsdelen for at sammenligne kun datodelen

    const results = {
        today: {
            activities: [],
            totalCalories: 0,
            numberOfActivies: 0
        },
        otherDates: {}
    };

     // Loop gennem hver entry og kategoriser dem efter dato
    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normalisér tidsdelen for nøjagtig sammenligning

        const dateKey = entryDate.toISOString().split('T')[0]; // Opret en dato-nøgle i formatet YYYY-MM-DD
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
// Funktion til at kategorisere måltidsdata efter dato
export function categorizeMealDate(entries) {
    // Opret en datoobjekt for i dag
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Nulstil tidsdelen for at sammenligne kun datodelen

    // Initialisering af resultaterobjektet med struktur til at holde måltidsdata for i dag og andre datoer
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
 // Loop gennem måltidsindgange og kategoriser dem efter dato
    entries.forEach(entry => {
        // Opret et datoobjekt baseret på måltidsindgangens dato
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0); // Normaliser tidsdelen for nøjagtig sammenligning

        const dateKey = entryDate.toISOString().split('T')[0]; // Opret en dato-nøgle i formatet YYYY-MM-DD
        // Kontroller om datoen er i dag
       const isToday = entryDate.getTime() === today.getTime();
       // Vælg den relevante kategori (i dag eller andre datoer)
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

         // Saml data for måltidet i den relevante kategori
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

    return results; // Returnerer de kategoriserede måltidsdata
}

// Funktion til at oprette daglige opsummeringer baseret på aktivitets- og måltidsdata
export function createDailySummaries(activityData, mealData, basicMetabolism) {
    // Saml alle datoer fra både måltids- og aktivitetsdata
    const allDates = { ...mealData.otherDates, ...activityData.otherDates };
    const allDatesKeys = Object.keys(allDates);

    // Opret et objekt til at holde de daglige opsummeringer
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
// Beregn opsummeringerne for hver dag
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

   // Inkluder dagens data
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