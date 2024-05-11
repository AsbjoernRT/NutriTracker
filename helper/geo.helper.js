
let cityName = '';  // Global variabel til at gemme bynavnet

async function handleLocation() {
    try {
        const location = await getLocation();
        console.log(location);

        const response = await fetch("/api/getCityNameOfLocation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(location)
        });

        const result = await response.json();
        cityName = result.cityName;  // Gem bynavnet fra responsen
        console.log("City Name from server:", cityName);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function getLocation() {
    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(position => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Log latitude og longitude
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                // Resolve promise med latitude og longitude
                resolve({
                    latitude: latitude,
                    longitude: longitude
                });

            }, error => {
                reject(error);
            });
        }
    });
}
