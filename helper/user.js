// Funktion til at vise brugeroplysninger
function showUserInfo() {
    // lav et enkelt api-kald 
    fetch('/api/userinfo')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Opdaterer visningen af brugerens navn
            const nameDisplay = document.getElementById("userName");
            if (nameDisplay) {
                nameDisplay.textContent = data.name;
            } else {
                console.log('Element with ID "userName" not found in the document.');
            }


            // Opdaterer visningen af alder
            console.log(data)

            console.log('Received data:', data);
            const ageDisplay = document.getElementById("age");
            if (ageDisplay) {
                ageDisplay.textContent = data.age;
            } else {
                console.log('Element with ID "age" not found in the document.');
            }

            // Opdaterer visningen af vægt
            const weightDisplay = document.getElementById("weight");
            if (weightDisplay) {
                weightDisplay.textContent = data.weight;
            } else {
                console.log('Element with ID "weight" not found in the document.');
            }

            // Opdaterer visningen af køn
            const genderDisplay = document.getElementById("gender");
            if (genderDisplay) {
                genderDisplay.textContent = data.gender;
            } else {
                console.log('Element with ID "gender" not found in the document.');
            }
         // Opdaterer visningen af metabolisme
            const metabolismDisplay = document.getElementById("metabolism");
            if (metabolismDisplay) {
                metabolismDisplay.textContent = data.metabolism;
            } else {
                console.log('Element with ID "metabolism" not found in the document.');
            }


        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


// Funktion til at slette brugeren
function deleteUser() {
        // Foretager en POST-anmodning til /api/delete-endepunktet for at slette brugeren
    fetch('api/delete', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Nødvendigt hvis cookies bruges til at håndtere session
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('User deleted successfully');
           // Her kan du eventuelt omdirigere eller genindlæse siden
        } else {
            alert('Error deleting user: ' + data.message);
        }
    })
    .catch(error => {
        console.log(body);
        console.error('Error:', error);
        alert('Failed to delete user');
    });
}

// function logout() {
//     fetch('/logout', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Logged out successfully');
//                 window.location.href = '/login';
//             } else {
//                 throw new Error('Logout failed');
//             }
//         })
//         .catch(error => console.error('Error:', error));
// }


// Lyt efter DOMContentLoaded-eventet, og kald showUserInfo-funktionen, når DOM'en er fuldt indlæst
// document.addEventListener('DOMContentLoaded', showUserInfo);

