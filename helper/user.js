function showName() {
    // Attempt to find the element by ID
    const nameDisplay = document.getElementById("userName");

    // Check if the element exists
    if (nameDisplay) {
        fetch('/api/userinfo')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Check again in case the DOM has changed
            if (nameDisplay) {
                console.log(nameDisplay);  // This log will confirm that the element is still present
                nameDisplay.textContent = data.name;  // Update the text content with the user's name
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        console.log('Element with ID "userName" not found in the document.');
    }
}

// You can call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showName);
