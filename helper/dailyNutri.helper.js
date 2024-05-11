function showMealAndActivity() {
    showDailyNutri()
        .then(data => {
            console.log("Received on front-end:", data);
        })
        .catch(error => {
            console.error("Failed to fetch meal and activity data:", error);
            // Handle the error, such as showing an error message to the user
        });

}