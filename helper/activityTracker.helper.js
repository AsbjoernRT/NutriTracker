function AcvtivitySeach() {
    var inputElement = document.getElementById('searchInput');
    var resultsDiv = document.getElementById('searchResults');
    var debounceTimerId;
    // Access the input elements
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');


    // Attach event listeners to the input fields
    hoursInput.addEventListener('input', handleDurationChange);
    minutesInput.addEventListener('input', handleDurationChange);
    inputElement.addEventListener('input', function () {

        clearTimeout(debounceTimerId);
        debounceTimerId = setTimeout(() => {
            var searchTerm = inputElement.value;
            if (searchTerm.length > 1) {
                fetch("/api/activity_search?searchTerm=" + searchTerm)
                    .then(res => res.json())
                    .then((res) => {
                        // console.log(res);
                        displayResults(res)
                    });
            } else {
                resultsDiv.innerHTML = ''; // Clear results if input is too short
            }
        }, 200);
    });
    // Function to handle the input changes
    function handleDurationChange() {
        const hours = parseInt(hoursInput.value, 10) || 0;  // Use 0 as default if the input is empty
        const minutes = parseInt(minutesInput.value, 10) || 0;

        // Example: Calculate kcals burned - Assume 100 kcals per hour as a placeholder
        const totalMinutes = hours * 60 + minutes;
        const kcalsBurned = (totalMinutes / 60) * activity.calories; // Assuming a simple kcal calculation

        // Update the display
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
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.textContent = item.activityName;
        resultItem.onclick = function () { selectItem(item); };
        resultsContainer.appendChild(resultItem);
    });
}

function selectItem(item) { // Here we can select the items from our API pull, which we are displaying in our html file. 
    console.log(item);

    document.getElementById('searchInput').value = item.activityName;
    // document.getElementById('selectedItem').textContent = `Selected Item: ${item.activityName}`;
    document.getElementById('searchResults').innerHTML = '';
    // // console.log("this: ", item);

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
    // Combine all data into one object
    const postData = {
        activityName,
        activityHours,
        activityMinutes,
        activityKcals,
        activityID

    };
    fetch('/api/activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        // fetch('/api/ingredients' + postData)
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    console.log(activityName, activityHours, activityMinutes, activityKcals);
})

