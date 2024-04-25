document.addEventListener("DOMContentLoaded", function() {
    userLoginSucess();
    checkLogin();
    const headerContainer = document.getElementById('headerContainer');
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
});
