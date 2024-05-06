export function calculateCalories() {
    
}


export function calculateBasalMetabolism(age, gender, weight) {
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

