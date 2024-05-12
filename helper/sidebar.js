// Funktion til at åbne/lukke sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("profileSidebar");
        // Kontrollerer bredden af sidebar-elementet for at afgøre om den skal åbnes eller lukkes
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0'; // Luk sidebar
    } else {
        sidebar.style.width = '250px'; // Åbn sidebar
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

// Funktion til at logge ud
function logout() {
        // Udfører en POST-anmodning til /logout-endepunktet for at logge brugeren ud
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'  // Nødvendigt hvis cookies bruges til at håndtere session
    })
        .then(response => {
            if (response.ok) {
                console.log('Logged out successfully'); // Hvis logud-anmodningen lykkes
                window.location.href = '/login'; // Omdirigerer brugeren til login-siden
            } else {
                throw new Error('Logout failed'); // Hvis logud-anmodningen mislykkes
            }
        })
        .catch(error => console.error('Error:', error));
}
// Funktion til at vise brugerens navn i sidebar
function showNameSidebar() {
    // Forsøger at finde elementet med id'et "userName"
    const nameDisplay = document.getElementById("userName");

    // Kontrollerer om elementet blev fundet
    if (nameDisplay) {
                // Udfører en GET-anmodning til /api/userinfo-endepunktet for at få brugerens oplysninger
        fetch('/api/userinfo')
        .then(response => {
            if (response.ok) {
                return response.json(); // Konverterer svaret til JSON-format
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            //check igen just in case at DOM er ændret
            if (nameDisplay) {
                console.log(nameDisplay);  
                nameDisplay.textContent = data.name;  
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        console.log('Element with ID "userName" not found in the document.');
    }
}


