function toggleSidebar() {
    var sidebar = document.getElementById("profileSidebar");
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
    }
}

// Close the sidebar if clicking outside of it
document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("profileSidebar");
    var profileContainer = document.querySelector(".profile-container");

    // Check if the click was outside the sidebar and profile-container
    if (!sidebar.contains(event.target) && !profileContainer.contains(event.target)) {
        if (sidebar.style.width === '250px') {
            sidebar.style.width = '0'; // Close the sidebar
        }
    }
});

// // Close the sidebar if clicking outside of it
// document.addEventListener('click', function(event) {
//     var sidebar = document.getElementById("profileSidebar");
//     var profileContainer = document.querySelector(".profile-container");

//     // Check if the click was outside the sidebar and profile-container
//     if (!sidebar.contains(event.target) && !profileContainer.contains(event.target)) {
//         if (sidebar.style.width === '250px') {
//             sidebar.style.width = '0'; // Close the sidebar
//         }
//     }
// });

function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Necessary if using cookies to manage session
    })
        .then(response => {
            if (response.ok) {
                console.log('Logged out successfully');
                window.location.href = '/login';
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => console.error('Error:', error));
}

function showNameSidebar() {
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


