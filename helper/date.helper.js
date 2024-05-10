document.addEventListener("DOMContentLoaded", function () {
    getDate()
  
    var dateElement = document.getElementById("dateDisplay");
    // If the element exists, call 'showDate()'
    if (dateElement) {
        showDate(getDate());
    }
});

function getDate(){
    const currentDate = new Date();

    console.log(currentDate);

    return currentDate;
};

function showDate(currentDate) {

    // Define an array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get the day, month, and year
    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()]; // Get the month name
    const year = currentDate.getFullYear();
    console.log(day);
    // Create the formatted date string
    const formattedDate = `${currentDate.toDateString().substr(0, 3)} ${month} ${day} ${year}`;

    // Update the date display
    const dateDisplay = document.getElementById('dateDisplay');
    dateDisplay.textContent = `Todays Date: ${formattedDate}`;

    // showDate(currentDate);

    return currentDate; // return the currentDate object
};


// Function to check if the given date is today's date
function dateMatch(date) {
const today = new Date();
console.log("Date: ", today);

// Return true if the year, month, and day of the given date match today's date.
return date.getDate() === today.getDate() &&
       date.getMonth() === today.getMonth() &&
       date.getFullYear() === today.getFullYear();
}
