// function checkLogin() {
//     // Check for a key in localStorage or sessionStorage
//     const isLoggedInLocal = localStorage.getItem('isLoggedIn');
//     const isLoggedInSession = sessionStorage.getItem('isLoggedIn');

//     // Redirect if neither storage contains the login flag
//     if (!isLoggedInLocal && !isLoggedInSession) {
//         window.location.href = 'login.html';
//     }
// }
function userLoginSucess() {
    // Setting the login flag in sessionStorage
    sessionStorage.setItem('isLoggedIn', 'true');

    // Optionally, set the login flag in localStorage to persist login state even after the browser is closed
    localStorage.setItem('isLoggedIn', 'true');
}

async function checkLoginStatus() {
    try {
        const isLoggedInLocal = localStorage.getItem('isLoggedIn');
        const isLoggedInSession = sessionStorage.getItem('isLoggedIn');

        if (!isLoggedInLocal && !isLoggedInSession) {
            console.log("User not logged in")
            //window.location.href = 'login.html'; // Redirect to login page if not logged in
        }
    } catch (error) {
        console.error('Failed to check login status:', error);
    }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);
