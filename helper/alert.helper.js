document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    const successMessages = [
        { param: 'registration', message: 'Registration successful' },
        { param: 'login', message: 'Login successful' }
        // Add more parameters and success messages as needed
    ];
    
    const errorMessages = [
        { param: 'usernotfound', message: 'No user with that email' },
        { param: 'wrongpassword', message: 'Wrong password' },
        { param: 'error', value: 'Wrong%20password', message: 'Wrong password' },
        { param: 'error', value: 'No%20user%20with%20that%20email', message: 'No user with that email' }
        // { param: 'error', message: 'No user with that email' }
        // Add more parameters and error messages as needed
    ];
    
    successMessages.forEach(({ param, message }) => {
        if (params.has(param) && params.get(param) === 'success') {
            alert(message);
        }
    });
    
    errorMessages.forEach(({ param, message }) => {
        if (params.has(param)) {
            alert(message);
        }
    });
});



