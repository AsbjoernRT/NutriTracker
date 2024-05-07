function showUserInfo() {
    // Make a single API call
    fetch('/api/userinfo')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Update user name
            const nameDisplay = document.getElementById("userName");
            if (nameDisplay) {
                nameDisplay.textContent = data.name;
            } else {
                console.log('Element with ID "userName" not found in the document.');
            }

            // Update age
            const ageDisplay = document.getElementById("age");
            if (ageDisplay) {
                ageDisplay.textContent = data.age;
            } else {
                console.log('Element with ID "age" not found in the document.');
            }

            // Update weight
            const weightDisplay = document.getElementById("weight");
            if (weightDisplay) {
                weightDisplay.textContent = data.weight;
            } else {
                console.log('Element with ID "weight" not found in the document.');
            }

            // Update gender
            const genderDisplay = document.getElementById("gender");
            if (genderDisplay) {
                genderDisplay.textContent = data.gender;
            } else {
                console.log('Element with ID "gender" not found in the document.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// You can call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showUserInfo);
