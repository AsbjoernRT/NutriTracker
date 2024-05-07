
let modalType; // Declare at the top of your script if this needs to be accessed globally.

function toggleModalVisibility() {
    removeItemFromLocalStorage();
    console.log('toggleModalVisibility');
    const ingredientList = document.getElementById('ingredientList');
    // const editRecipe = document.getElementById('editRecipe');
    const addRecipe = document.getElementById('addRecipe');
    const modalWrapper = document.getElementById('modal-wrapper');
    
    if (ingredientList && addRecipe && modalWrapper) {
        ingredientList.innerHTML = '';
        // editRecipe.classList.add('hide');
        addRecipe.classList.remove('hide');
        modalWrapper.classList.toggle('hide');
    } else {
        console.error('One or more elements are missing in the DOM');
    }
}

document.getElementById('add-recipe-btn').addEventListener('click', function () {
    modalType = 'food';
    toggleModalVisibility();
});

document.getElementById('add-liquid-btn').addEventListener('click', function () {
    modalType = 'beverage';
    toggleModalVisibility();
});

//Close Modal
document.getElementById('close-create-btn').addEventListener('click', toggleModalVisibility);