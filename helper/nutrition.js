function loadNutritionData(type, period) {
    const userId = '123'; // Antag brugerens ID er kendt eller hentes dynamisk

    // Opret API-URL'en baseret på brugerens ID, anmodningstype og periode
    const apiUrl = `/api/nutrition/${userId}/${type}/${period}`;

    // Foretag en fetch-anmodning til API'en
    fetch(apiUrl)
        .then(response => response.json()) // Konverter svaret til JSON-format
        .then(data => {
            // Opdater den relevante tabel baseret på den indlæste datatypes
            if (type === 'hourly') {
                // Hvis data er timerbaseret, opdater den daglige visningstabel
                updateTable(data, 'dailyView');
                hideElement('monthlyView'); // Skjul månedlig visningstabel
                showElement('dailyView'); // Vis daglig visningstabel
            } else if (type === 'daily') {
                // Hvis data er dagbaseret, opdater den månedlige visningstabel
                updateTable(data, 'monthlyView');
                hideElement('dailyView'); // Skjul daglig visningstabel
                showElement('monthlyView'); // Vis månedlig visningstabel
            }
        })
        .catch(error => console.error('Error fetching nutrition data:', error)); // Håndter fejl i fetch-anmodning
}
