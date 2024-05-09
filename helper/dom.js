document.addEventListener('DOMContentLoaded', function() {
    // Check the current URL or a part of it
    const path = window.location.pathname;

     // Conditionally execute code based on the current path
     if (path === '/mealCreator') {
        // Execute code specific to '/specific-page'
        console.log("Current page:", path);
        showRecipes()
     }
    // } else if (path.startsWith('/category/')) {
    //     // Execute code specific to any category page
    //     modifyCategoryDOM();
    
});

function showRecipes() {
// Make a single API call
fetch('/api/recipes')
.then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
})
.then(data => {
    console.log(data);})};
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
