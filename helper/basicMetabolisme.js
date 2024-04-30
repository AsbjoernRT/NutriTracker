function calculateBasalMetabolism(age, gender, weight, height) {
    let basalMetabolism = 0;

    // Calculate basal metabolism based on age, gender, weight, and height
    if (gender === 'male') {
        if (age < 3) {
            basalMetabolism = 0.249 * weight - 0.13;
        } else if (age >= 3 && age <= 10) {
            basalMetabolism = 0.082 * weight;  // Includes height for males 3-10 years old
            basalMetabolism += 0.055 * height + 1.74;
        } else if (age >= 11 && age <= 18) {
            basalMetabolism = 0.068 * weight;  // Includes height for males 11-18 years old
            basalMetabolism += 0.057 * height + 2.16;
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
        } else if (age >= 3 && age <= 10) {
            basalMetabolism = 0.085 * weight + 2.03;  // Includes height for females 3-10 years old
            basalMetabolism += 0.071 * height + 1.55;
        } else if (age >= 11 && age <= 18) {
            basalMetabolism = 0.056 * weight + 2.90;  // Includes height for females 11-18 years old
            basalMetabolism += 0.035 * height + 0.84;
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

    basalMetabolism *= 239; // Convert kcal/day to kilojoules/day (1 kcal = 4.184 kJ)

    return basalMetabolism;
}


// Dette er et eksempel, vi skal kunne hente dette ned dynamisk og herefter tilføje Kcal til brugerens forbrænding.

document.addEventListener('DOMContentLoaded', function() {

let age = 13;
let gender = 'male';
let weight = 40; // Brugerens vægt
let height = 170; // Brugerens højde (kan være valgfrit, afhængigt af beregningsformlerne)

// Beregn basal metabolisme
let basalMetabolism = calculateBasalMetabolism(age, gender, weight, height);
console.log("Basal metabolism:", basalMetabolism + " Kcal");

// Hvis stofskifteData allerede er defineret, skal du opdatere det, ellers initialisere det som et tomt objekt
let stofskifteData = JSON.parse(localStorage.getItem('stofskifteData')) || {};

// Tilføj basal metabolisme til stofskifteData
stofskifteData.basalMetabolism = basalMetabolism;

// Gem opdaterede stofskifteData i lokal lagring
localStorage.setItem('stofskifteData', JSON.stringify(stofskifteData));

});