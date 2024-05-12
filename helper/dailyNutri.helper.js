function showMealAndActivity() {
        // Kalder showDailyNutri-funktionen, som forventes at returnere et promise med daglig ernæringsdata
    showDailyNutri()
        .then(data => {
            console.log("Received on front-end:", data); // Logger de modtagne data til konsollen
        })
        .catch(error => {
            console.error("Failed to fetch meal and activity data:", error);
            // Håndter fejlen, for eksempel ved at vise en fejlmeddelelse til brugeren
        });

}