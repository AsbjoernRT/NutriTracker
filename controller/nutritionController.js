class NutritionController {
    async getNutritionData(userId, type, period) {
        // Funktion til at hente ernæringsdata baseret på brugerens anmodningstype og periode
        if (type === 'hourly') {
            // Hvis anmodningstypen er 'hourly'
            if (period === 'last24Hours') {
                // Hvis perioden er 'last24Hours', hent data for de sidste 24 timer
                return this.getHourlyData(userId, 24);
            } else if (period === 'dailyLastMonth') {
                // Hvis perioden er 'dailyLastMonth', hent data for de sidste 30 dage
                return this.getDailyData(userId, 30);
            }
        } else {
            // Hvis anmodningstypen ikke er gyldig (dvs. ikke 'hourly')
            throw new Error("Invalid type or period");
        }
    }

    async getHourlyData(userId, hours) {
        // Funktion til at generere dummy-data for de sidste 24 timer
        const data = []; // Placeholder data
        for (let i = 0; i < hours; i++) {
            // Generer dummy-data for hver time
            const item = {
                hour: i,
                energyIntake: Math.random() * 1000, //  energiindtag
                waterIntake: Math.random() * 2, //  vandindtag
                caloriesBurned: Math.random() * 500, //  kalorier forbrændt
                calorieDifference: Math.random() * 200 - 100 //  kalorieforskel
            };
            data.push(item);
        }
        return data; // Returner dummy-data
    }

    async getDailyData(userId, days) {
        // Funktion til at generere dummy-data for de sidste 30 dage
        const data = []; // Placeholder data
        const currentDate = new Date(); // Aktuel dato
        for (let i = 0; i < days; i++) {
            // For hver af de sidste 30 dage
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
            // Generer dummy-data for hver dag
            const item = {
                date: date.toLocaleDateString(), // Dato i formatet 'dd/mm/yyyy'
                energyIntake: Math.random() * 3000, //  energiindtag
                waterIntake: Math.random() * 3, //  vandindtag
                caloriesBurned: Math.random() * 1500, //  kalorier forbrændt
                calorieDifference: Math.random() * 500 - 250 //  kalorieforskel
            };
            data.push(item);
        }
        return data; // Returner data
    }
}

export default new NutritionController();
