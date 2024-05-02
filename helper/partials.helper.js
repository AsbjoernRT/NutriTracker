document.addEventListener("DOMContentLoaded", function () {

    //footer
    const footerContainer = document.getElementById('footerContainer');
    fetch('/footer')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));

        //Header
        const headerContainer = document.getElementById('headerContainer');
    fetch('/header')
        .then(response => response.text())
        .then(data => {
            headerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));
        console.log("HeaderContainer",headerContainer);
});


