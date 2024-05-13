// Tilføjer en 'DOMContentLoaded' hændelseslytter til dokumentet for at sikre, at hele HTML er indlæst
document.addEventListener('DOMContentLoaded', function () {
    // Tjek den aktuelle URL eller en del af den
    const path = window.location.pathname;
    showUserInfo()
    // Betinget udfør kode baseret på den aktuelle sti
    if (path === '/mealCreator') {
        // Udfør kode specifikt for siden '/mealCreator'
        console.log("Current page:", path);
        IngredientSearch() // Kald funktionen for at søge efter ingredienser
        showRecipes() // Kald funktionen for at vise opskrifter
    }
    if (path === '/mealTracker') {
// Kode specifik for 'mealTracker' siden
        getLocation()
        handleLocation()
    }
    if (path === '/activityTracker') {
 // Kode specifik for 'activityTracker' siden
        console.log("Current page:", path);
        AcvtivitySeach()
    }

    if (path === '/dailyNutri') {
// Kode specifik for 'dailyNutri' siden

        console.log("Current page:", path);
        displayDailyNutri()
    }
    if (path === '/dashboard') {
// Kode specifik for 'dashboard' siden
        console.log("Current page:", path);
        showMealAndActivity() 
    }
});



// I filen hvor getMealAndActivity er defineret
function getMealAndActivity() {
    return fetch("/api/MealAndActivity")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            throw error;  // Tillad kaldende funktion at håndtere fejlen
        });
}


//     // Update user name
//     const nameDisplay = document.getElementById("");
//     if (nameDisplay) {
//         nameDisplay.textContent = data.name;
//     } else {
//         console.log('Element with ID "userName" not found in the document.');
//     }

//     // Update age
//     console.log('Received data:', data);
//     const ageDisplay = document.getElementById("age");
//     if (ageDisplay) {
//         ageDisplay.textContent = data.age;
//     } else {
//         console.log('Element with ID "age" not found in the document.');
//     }

//     // Update weight
//     const weightDisplay = document.getElementById("weight");
//     if (weightDisplay) {
//         weightDisplay.textContent = data.weight;
//     } else {
//         console.log('Element with ID "weight" not found in the document.');
//     }

//     // Update gender
//     const genderDisplay = document.getElementById("gender");
//     if (genderDisplay) {
//         genderDisplay.textContent = data.gender;
//     } else {
//         console.log('Element with ID "gender" not found in the document.');
//     }
// })
// .catch(error => {
//     console.error('There has been a problem with your fetch operation:', error);
// });
// }
