document.addEventListener("DOMContentLoaded", function () {
    // Funktion til at indlæse indhold fra en URL og placere det i en specificeret container
    function loadContent(url, containerId) {
                // Hent reference til container-elementet ved hjælp af containerens id
        const container = document.getElementById(containerId);
                // Brug fetch til at hente indholdet fra den angivne URL
        fetch(url)
            .then(response => response.text())   // Konverter responsen til tekst
            .then(data => {
                container.innerHTML = data;      // Indsæt indholdet i container-elementet

            })
            .catch(error => console.error(`Error loading the content from ${url}:`, error));  // Håndter fejl, hvis der opstår en under hentningen af indholdet
    }

    // Indlæs footer og header ved hjælp af loadContent-funktionen
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




