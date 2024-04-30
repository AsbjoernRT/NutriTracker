// register.functions.js

import User from './models/User.js';

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const birthyear = formData.get('birthyear');
    const email = formData.get('email');
    const password = formData.get('password');
    const weight = formData.get('weight');
    const gender = formData.get('gender');

    // Create a new instance of the User class
    const newUser = new User(username, password, email, birthyear, weight, gender);

    // Call the save method to save the user data to the database
    newUser.save()
        .then(() => {
            console.log('User registered successfully!');
            // Optionally, you can redirect the user to another page or show a success message
        })
        .catch(error => {
            console.error('Error registering user:', error);
            // Optionally, you can display an error message to the user
        });
}

// Add event listener to the form
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', handleSubmit);
