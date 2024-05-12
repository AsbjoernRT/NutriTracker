function AcvtivitySeach() {
    var inputElement = document.getElementById('searchInput'); // Få adgang til søgefeltet
    var resultsDiv = document.getElementById('searchResults'); // Få adgang til div-elementet, hvor søgeresultater vises
    var debounceTimerId; // Variabel til at gemme en reference til timeout, bruges til debouncing
    // Adgang til input-elementerne
    const hoursInput = document.getElementById('hours'); // Få adgang til inputfeltet for timer
    const minutesInput = document.getElementById('minutes');  // Få adgang til inputfeltet for minutter



    // Tilføj event listeners til inputfelter
    hoursInput.addEventListener('input', handleDurationChange);
    minutesInput.addEventListener('input', handleDurationChange);
    inputElement.addEventListener('input', function () {
       
        // Nulstil debounceTimerId
        clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value; // Hent den indtastede søgetekst
            if (searchTerm.length > 1) { // Tjekker at søgeterm er længere end 1 tegn
                fetch("/api/activity_search?searchTerm=" + searchTerm) // Sender en anmodning til serveren
                    .then(res => res.json())
                    .then((res) => {
                        // console.log(res);
                        displayResults(res) // Viser resultaterne ved at kalde displayResults
                    });
            } else {
                resultsDiv.innerHTML = ''; // Ryd resultater hvis input er for kort
            }
        }, 200); // Sætter en forsinkelse på 200ms før søgningen udføres
    });
   // Funktion til at håndtere ændringer i input
    function handleDurationChange() {
        const hours = parseInt(hoursInput.value, 10) || 0;  // Brug 0 som standard hvis input er tomt
        const minutes = parseInt(minutesInput.value, 10) || 0;

// Eksempel: Beregn kcal forbrændt - Antag 100 kcal per time som en placeholder
        const totalMinutes = hours * 60 + minutes;
        const kcalsBurned = (totalMinutes / 60) * activity.calories; // Antag en simpel kcal-beregning

        // Update display
        document.getElementById('selected-activity').textContent = `${kcalsBurned.toFixed(2)} kcals burned`;
    }
};



// document.addEventListener('DOMContentLoaded', function () {
//     // Access the input elements
//     const hoursInput = document.getElementById('hours');
//     const minutesInput = document.getElementById('minutes');

//     // Function to handle the input changes
//     function handleDurationChange() {
//         const hours = parseInt(hoursInput.value, 10) || 0;  // Use 0 as default if the input is empty
//         const minutes = parseInt(minutesInput.value, 10) || 0;

//         // Example: Calculate kcals burned - Assume 100 kcals per hour as a placeholder
//         const totalMinutes = hours * 60 + minutes;
//         const kcalsBurned = (totalMinutes / 60) * 100; // Assuming a simple kcal calculation

//         // Update the display
//         document.getElementById('selected-activity').textContent = `${kcalsBurned.toFixed(2)} kcals burned`;
//     }

//     // Attach event listeners to the input fields
//     hoursInput.addEventListener('input', handleDurationChange);
//     minutesInput.addEventListener('input', handleDurationChange);
// });






function displayResults(items) {
    console.log(items);
    const resultsContainer = document.getElementById('searchResults'); // Få adgang til resultatkcontaineren
    resultsContainer.innerHTML = ''; // Rydder tidligere resultater

    items.forEach(item => { // For hvert element i resultatet
        const resultItem = document.createElement('div'); // Opretter et nyt div-element
        resultItem.classList.add('result-item'); // Tilføjer en klasse til div-elementet
        resultItem.textContent = item.activityName; // Sætter tekstindholdet til aktivitetens navn
        resultItem.onclick = function () { selectItem(item); };
        resultsContainer.appendChild(resultItem);
    });
}

function selectItem(item) { // Her kan vi vælge elementer fra vores API-hentning, som vi viser i vores HTML-fil. 
    console.log(item);

    document.getElementById('searchInput').value = item.activityName; // Sætter søgefeltet til det valgte aktivitetsnavn
    // document.getElementById('selectedItem').textContent = `Selected Item: ${item.activityName}`;
    document.getElementById('searchResults').innerHTML = ''; // Rydder søgeresultater
    // // console.log("this: ", item);

    // Returnerer og gemmer det valgte aktivitetsobjekt
    return activity = {
        activityName: item.activityName,
        activityID: item.activityID,
        calories: item.calories,
    };
}





document.getElementById('activityForm').addEventListener('submit', function (event) {
    // Collecting the form data
    const activityName = document.getElementById('searchInput').value;
    const activityHours = document.getElementById('hours').value;
    const activityMinutes = document.getElementById('minutes').value;
    const activityKcals = activity.calories;
    const activityID = activity.activityID;
  // Samler data i et objekt til afsendelse
    const postData = {
        activityName,
        activityHours,
        activityMinutes,
        activityKcals,
        activityID

    };
    fetch('/api/activity', { // Sender data til serveren via POST-anmodning
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Sætter indholdstype til JSON
        },
        body: JSON.stringify(postData) // Omdanner dataobjektet til en JSON-streng
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    console.log(activityName, activityHours, activityMinutes, activityKcals);
})

