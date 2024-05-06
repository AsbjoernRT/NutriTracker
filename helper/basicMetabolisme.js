

// Dette er et eksempel, vi skal kunne hente dette ned dynamisk og herefter tilføje Kcal til brugerens forbrænding.

document.addEventListener('DOMContentLoaded', function () {

    let age = 30;
    let gender = 'male';
    let weight = 75; // Brugerens vægt

    // Beregn basal metabolisme
    fetch('/calculateBMR', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age, gender, weight })
    })
        .then(response => response.json())
        .then(data => {
            const basalMetabolism = data.basalMetabolism;
            console.log("Basal metabolism:", basalMetabolism + " Kcal");
            document.getElementById('calories-info').textContent = `${basalMetabolism} kcal forbrændt grundlæggende`;

            // Her kan du tilføje yderligere logik for at kombinere dette med kalorier forbrændt fra aktiviteter
        })
        .catch(error => console.error('Error:', error));
});

