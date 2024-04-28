document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById('headerContainer');
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
});

module.exports = header.helper