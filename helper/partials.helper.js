document.addEventListener("DOMContentLoaded", function() {
    // Function to load content into a specified container from a URL
    function loadContent(url, containerId) {
        const container = document.getElementById(containerId);
        fetch(url)
            .then(response => response.text())
            .then(data => {
                container.innerHTML = data;
            })
            .catch(error => console.error(`Error loading the content from ${url}:`, error));
    }

    // Load footer and header
    loadContent('/footer', 'footerContainer');
    loadContent('/header', 'headerContainer');
});


// document.addEventListener("DOMContentLoaded", function () {

//     //footer
//     const footerContainer = document.getElementById('footerContainer');
//     fetch('/footer')
//         .then(response => response.text())
//         .then(data => {
//             footerContainer.innerHTML = data;
//         })
//         .catch(error => console.error('Error loading the header:', error));

//         //Header
//         const headerContainer = document.getElementById('headerContainer');
//     fetch('/header')
//         .then(response => response.text())
//         .then(data => {
//             headerContainer.innerHTML = data;
//         })
//         .catch(error => console.error('Error loading the header:', error));
//         console.log("HeaderContainer",headerContainer);
// });




