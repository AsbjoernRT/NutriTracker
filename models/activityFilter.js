
// activities.js
const activities = [
    { name: "Almindelig gang", calories: 215 },
    { name: "Gang ned af trapper", calories: 414 },
    { name: "Gang op af trapper", calories: 1079 },
    { name: "Slå græs med manuel græsslåmaskine", calories: 281 },
    { name: "Lave mad og redde senge", calories: 236 },
    { name: "Luge ukrudt", calories: 362 },
    { name: "Rydde sne", calories: 481 },
    { name: "Læse eller se TV", calories: 74 },
    { name: "Stå oprejst", calories: 89 },
    { name: "Cykling i roligt tempo", calories: 310 },
    { name: "Tørre støv af", calories: 163 },
    { name: "Vaske gulv", calories: 281 },
    { name: "Pudse vinduer", calories: 259 },
    { name: "Cardio", calories: 814 },
    { name: "Hård styrketræning", calories: 348 },
    { name: "Badminton", calories: 318 },
    { name: "Volleyball", calories: 318 },
    { name: "Bordtennis", calories: 236 },
    { name: "Dans i højt tempo", calories: 355 },
    { name: "Dans i moderat tempo", calories: 259 },
    { name: "Fodbold", calories: 510 },
    { name: "Rask gang", calories: 384 },
    { name: "Golf", calories: 244 },
    { name: "Håndbold", calories: 466 },
    { name: "Squash", calories: 466 },
    { name: "Jogging", calories: 666 },
    { name: "Langrend", calories: 405 },
    { name: "Løb i moderat tempo", calories: 872 },
    { name: "Løb i hurtigt tempo", calories: 1213 },
    { name: "Ridning", calories: 414 },
    { name: "Skøjteløb", calories: 273 },
    { name: "Svømning", calories: 296 },
    { name: "Cykling i højt tempo", calories: 658 },
    { name: "Bilreparation", calories: 259 },
    { name: "Gravearbejde", calories: 414 },
    { name: "Landbrugsarbejde", calories: 236 },
    { name: "Let kontorarbejde", calories: 185 },
    { name: "Male hus", calories: 215 },
    { name: "Murerarbejde", calories: 207 },
    { name: "Hugge og slæbe på brænde", calories: 1168 }
];

function filterActivities() {
    const input = document.getElementById('activity-search').value.toLowerCase();
    const filteredActivities = activities.filter(activity => 
        activity.name.toLowerCase().includes(input)
    );

    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    filteredActivities.slice(0, 5).forEach(activity => {
        const li = document.createElement('li');
        li.textContent = `${activity.name} (${activity.calories} kcal/time)`;
        li.onclick = function() { selectActivity(activity.name, activity.calories); };
        activityList.appendChild(li);
    });
}


function selectActivity(name, calories) {
    document.getElementById('activity-search').value = ''; // Ryd søgefeltet
    document.getElementById('activity-list').innerHTML = ''; // Ryd listen

    // Vis den valgte aktivitet og gem kalorierne
    document.getElementById('activity-display').textContent = `${name} (${calories} kcal/time)`;
    document.getElementById('selected-activity-kcal').value = calories; // Antager du har dette hidden input
}

