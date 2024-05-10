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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the received data
            // Check if there are any recipes
            if (data.length > 0) {
                data.forEach(displayRecipes()); // Call a function to display the recipes
            } else {
                console.log('No recipes found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error); // Log any errors that occur during the fetch operation
        });
}

function displayRecipes(recipe) {
        const list = document.getElementById('mealList');
        const row = document.createElement('tr');
        row.classList.add('recipe-row');
    
        // Set the background color based on the recipe type
        // if (recipe.type === 'beverage') {
        //     row.style.backgroundColor = '#99d9de'; // Blue for beverages
        // } else if (recipe.type === 'food') {
        //     row.style.backgroundColor = '#def6d8'; // Green for food
        // }
    
        // Add cells and data for the meal name, etc.
        addTableCell(row, recipe.name);
        addTableCell(row, recipe.kcalPer100g?.toFixed(2) || 'N/A');
        addTableCell(row, recipe.date ? new Date(recipe.date).toLocaleDateString() : 'Unknown Date');
        addTableCell(row, recipe.ingredients?.length || 0);
    
        // Inspect, Edit, and Delete buttons with functionality
        addInspectButton(row, recipe);
        addEditButton(row, recipe);
        addDeleteButton(row, recipe);
    
        list.appendChild(row);
    }
    
    function addTableCell(row, text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
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
