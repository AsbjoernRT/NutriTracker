document.addEventListener("DOMContentLoaded", function () {
const footerContainer = document.getElementById('footerContainer');
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
    });