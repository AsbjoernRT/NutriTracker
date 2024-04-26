 
 function geoLocation(params) {
 // Vis location
 const locationHeading = document.createElement('h3');
 locationHeading.textContent = 'Location:';
 LIST_DETAILS.appendChild(locationHeading);

 const locationParagraph = document.createElement('p');
 const location = mealObject.location;
 locationParagraph.innerHTML =
     '<strong>Latitude:</strong> ' + location.valueLat +
     '<br><strong>Longitude:</strong> ' + location.valueLon;
 LIST_DETAILS.appendChild(locationParagraph);
}



// Funktion til at finde lokationen for indtaget
function getLocation() {
 return new Promise((resolve, reject) => {
     navigator.geolocation.getCurrentPosition((position) => {
         const latitude = position.coords.latitude;
         const longitude = position.coords.longitude;

         const coordinates = {
             disValLat: latitude.toFixed(2),
             valueLat: latitude,
             disValLon: longitude.toFixed(2),
             valueLon: longitude
         };


         resolve(coordinates);
     }, (error) => {
         reject(error);
     });
 });
}

