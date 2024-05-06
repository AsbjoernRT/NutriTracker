
// Modal toggle:
function toggleModalVisibility() {
    console.log('toggleModalVisibility');
    //hide edit button
    document.getElementById('ingredientList').innerHTML = '';
    document.getElementById("editRecipe").classList.add('hide');
    document.getElementById("addRecipe").classList.remove('hide');
    document.getElementById('modal-wrapper').classList.toggle('hide');
}


document.getElementById('close-create-btn').addEventListener('click', toggleModalVisibility);
document.getElementById('add-recipe-button').addEventListener('click', function () {
    //Modal type should be either food or beverages.
    modalType = 'food';
    toggleModalVisibility();
});

document.getElementById('add-liquid-button').addEventListener('click', function () {
    modalType = 'beverage';
    toggleModalVisibility();
});