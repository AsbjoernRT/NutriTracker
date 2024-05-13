let modalType; // Declare at the top of your script if this needs to be accessed globally.

function toggleModalVisibility(isEditMode) {
    let selectedItemData = {};
    console.log('toggleModalVisibility', isEditMode ? "Edit Mode" : "Add Mode");
    const modalWrapper = document.getElementById('modal-wrapper');
    const addRecipe = document.getElementById('addRecipe');
    const editRecipe = document.getElementById('editRecipe');
    const ingredientList = document.getElementById('ingredientList');

    if (modalWrapper && addRecipe && editRecipe && ingredientList) {
        ingredientList.innerHTML = ''; // Ryd tidligere ingredienser
        
        if (isEditMode) {
            addRecipe.classList.add('hide'); // Skjul 'Add Recipe' knappen
            editRecipe.classList.remove('hide'); // Vis 'Edit Recipe' knappen
        } else {
            addRecipe.classList.remove('hide'); // Vis 'Add Recipe' knappen
            editRecipe.classList.add('hide'); // Skjul 'Edit Recipe' knappen
        }

        modalWrapper.classList.toggle('hide'); // Skift synligheden af modalen
    } else {
        console.error('One or more elements are missing in the DOM');
    }
}

function toggleModalVisibilityTracker() {
    const modalWrapper = document.getElementById('modal-wrapper');


    if (modalWrapper) {
        ingredientList.innerHTML = ''; // Ryd tidligere ingredienser
        document.getElementById('searchInput').value = ""
        document.getElementById('itemWeight').value = ""

        modalWrapper.classList.toggle('hide');

    } else {
        console.error('One or more elements are missing in the DOM');
    }
}

function toggleModalVisibilityTrackerEdit() {
    const modalWrapper = document.getElementById('modal-wrapper');
    const getSingleIngredient = document.getElementById('singleIngredient')
    const addTrackedMeal = document.getElementById('addTrackedMeal')
    const updateTrackedMeal = document.getElementById('updateTrackedMeal')
    const addTrackedMealButton = document.getElementById('addTrackedMealButton')
    const editTrackedMealButton = document.getElementById('editTrackedMealButton')


    if (modalWrapper && getSingleIngredient && addTrackedMeal && updateTrackedMeal) {
        ingredientList.innerHTML = ''; // Ryd tidligere ingredienser

        modalWrapper.classList.toggle('hide');
        getSingleIngredient.classList.toggle('hide');
        addTrackedMeal.classList.toggle('hide');
        updateTrackedMeal.classList.toggle('hide');
        addTrackedMealButton.classList.toggle('hide')
        editTrackedMealButton.classList.toggle('hide')

    } else {
        console.error('One or more elements are missing in the DOM');
    }
}

function toggleModalVisibilitySingleIngredient() {
    const modalWrapper = document.getElementById('modal-wrapper');
    const modealWrapper2 = document.getElementById('modal-wrapper2')

    if (modalWrapper && modealWrapper2) {

        modalWrapper.classList.add('hide'); 
        modealWrapper2.classList.remove('hide'); 
    } else {
        console.error('One or more elements are missing in the DOM');
    }
}

function toggleModalCloseVisibilitySingleIngredient() {
    const modealWrapper2 = document.getElementById('modal-wrapper2')

    if (modealWrapper2) {
        modealWrapper2.classList.toggle('hide');
        setTimeout(function() {
          // window.location.reload()
        }, 1000); // 1000 milliseconds = 1 second
    } else {
        console.error('One or more elements are missing in the DOM');
    }
}




function toggleModalVisibilitySettings() {

    const modalWrapper = document.getElementById('modal-wrapper');
    if (modalWrapper) {
        modalWrapper.classList.toggle('hide');
        showUserInfo()
    }
}

function toggleIngredientList(){
    document.getElementById('mealInspectionListBody').innerHTML=""
    const modalWrapper = document.getElementById('ingdredient-modal-wrapper');

    if(modalWrapper){
        modalWrapper.classList.toggle('hide');
    }else {
        console.error('One or more elements are missing in the DOM');
    }
}

function toggleMealTrackerModal(){
    const modalWrapper = document.getElementById('modal-wrapper');

    if(modalWrapper){
        modalWrapper.classList.toggle('hide');
        setTimeout(function() {
         // window.location.reload()
        }, 1000); // 1000 milliseconds = 1 second
    }else {
        console.error('One or more elements are missing in the DOM');
    }
}


document.getElementById('add-recipe-btn').addEventListener('click', function () {
    localStorage.removeItem('ingredients')
    modalType = 'food';
    localStorage.setItem('mealCategory','food')
    toggleModalVisibility(false);
});

document.getElementById('add-liquid-btn').addEventListener('click', function () {
    localStorage.removeItem('ingredients')
    modalType = 'beverage';
    localStorage.setItem('mealCategory','beverage')
    toggleModalVisibility(false);
});


document.getElementById('editRecipe').addEventListener('click', function () {
    
    toggleModalVisibility(true); // Åbner modalen i rediger tilstand
});

document.getElementById('add-meal-btn').addEventListener('click', function () {
    modalType = 'food';
    toggleModalVisibility();
});


document.getElementById('updateUserInSettings-Btn').addEventListener('click', function () {
    modalType = 'Settings';
    toggleModalVisibilitySettings();
});


// document.querySelectorAll('.edit-recipe-btn').addEventListener('click', function () {
//         modalType = 'edit';
//         toggleEditRecipeModal();
//     });

//Close Modal
// document.getElementById('close-create-btn').addEventListener('click', toggleModalVisibility);
// document.getElementById('close-settings-btn').addEventListener('click', toggleModalVisibilitySettings);