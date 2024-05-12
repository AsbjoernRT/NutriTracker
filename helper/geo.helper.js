
let cityName = '';  // Global variabel til at gemme bynavnet

// Asynkron funktion til at håndtere brugerens placering
async function handleLocation() {
    try {
        const location = await getLocation(); // Hent brugerens geografiske placering
        console.log(location);

     // Udfør en POST-anmodning for at få bynavnet baseret på geolokationen
        const response = await fetch("/api/getCityNameOfLocation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(location) // Send lokationsdata som JSON
        });

        const result = await response.json(); // Behandler serverens respons som JSON
        cityName = result.cityName;  // Gem bynavnet fra responsen
        console.log("City Name from server:", cityName); // Logger bynavnet modtaget fra serveren
    } catch (error) {
        console.error('An error occurred:', error); 
    }
}

// Funktion til at få brugerens geografiske koordinater
function getLocation() {
    return new Promise((resolve, reject) => {
        // Tjek om geolokation understøttes af browseren
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser'); // Afvis promise hvis geolokation ikke understøttes
        } else {
            navigator.geolocation.getCurrentPosition(position => {

                const latitude = position.coords.latitude; // Hent breddegraden fra positionen
                const longitude = position.coords.longitude; // Hent længdegraden fra positionen

                // Log latitude og longitude
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                // Resolve promise med latitude og longitude
                resolve({
                    latitude: latitude,
                    longitude: longitude
                });

            }, error => {
                reject(error); // Afvis promise hvis der opstår en fejl under lokationsopslaget
            });
        }
    });
}
