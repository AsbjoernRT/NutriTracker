// opretBruger.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries()); // Convert FormData to object

        try {
            const response = await fetch('/functions/auth.functions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register user');
            }

            const responseData = await response.json();
            console.log(responseData.message); // Log success message
            form.reset(); // Clear the form
        } catch (error) {
            console.error('Error registering user:', error.message);
            // Display error message to the user if needed
        }
    });
});
