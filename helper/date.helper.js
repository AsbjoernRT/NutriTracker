document.addEventListener("DOMContentLoaded", function () {
    getDate()
  
    var dateElement = document.getElementById("dateDisplay");
// Hvis elementet eksisterer, kald 'showDate()' med den aktuelle dato
    if (dateElement) {
        showDate(getDate());
    }
});
// Funktion til at hente den aktuelle dato
function getDate(){
    const currentDate = new Date(); // Opretter et nyt Date objekt for den aktuelle dato og tid

    console.log(currentDate);

    return currentDate;
};

// Funktion til at vise den aktuelle dato i et brugergrænsefladeelement
function showDate(currentDate) {

    // Definer et array med navne på måneder
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Hent dag, måned og år fra currentDate
    const day = currentDate.getDate();// Hent dag
    const month = monthNames[currentDate.getMonth()]; // Hent månedsnavnet
    const year = currentDate.getFullYear(); // Hent år
    // Opret en formatteret dato-string
    const formattedDate = `${currentDate.toDateString().substr(0, 3)} ${month} ${day} ${year}`;

    // Opdater datovisningen i display
    const dateDisplay = document.getElementById('dateDisplay');
    dateDisplay.textContent = `Todays Date: ${formattedDate}`;

    // showDate(currentDate);

    return currentDate; // Returner currentDate-objektet
};


// Funktion til at tjekke, om en given dato er dagens dato
function dateMatch(date) {
const today = new Date();  // Opretter et nyt Date-objekt for den aktuelle dato
console.log("Date: ", today); // Logger 'today' til konsollen

    // Returner true, hvis året, måneden og dagen for den givne dato matcher dagens dato
    return date.getDate() === today.getDate() &&
       date.getMonth() === today.getMonth() &&
       date.getFullYear() === today.getFullYear();
}
