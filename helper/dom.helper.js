document.addEventListener('DOMContentLoaded', function () {
    // Check the current URL or a part of it
    const path = window.location.pathname;

    // Conditionally execute code based on the current path
    if (path === '/mealCreator') {
        // Execute code specific to '/specific-page'
        console.log("Current page:", path);
        IngredientSearch()
        showRecipes()
    }

    if (path === '/activityTracker') {
        console.log("Current page:", path);
        AcvtivitySeach()
    }

    if (path === '/dailyNutri') {
        console.log("Current page:", path);
        getMealAndActivity()
        function getMealAndActivity() {

            fetch("/api/MealAndActivity",{
            method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
        })
                // fetch('/api/ingredients' + postData)
                .then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch(error => console.error('Error:', error));
        }


        // } else if (path.startsWith('/category/')) {
        //     // Execute code specific to any category page
        //     modifyCategoryDOM();

    }});

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
