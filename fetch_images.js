const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json', (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        try {
            const exercises = JSON.parse(data);
            console.log(`Fetched ${exercises.length} exercises from external DB.`);
            
            // Our target exercises
            const targets = [
                "Push-Ups", "Incline Push-Ups", "Knee Push-Ups", "Dumbbell Floor Press",
                "Barbell Bench Press", "Incline Dumbbell Press", "Dumbbell Flyes", "Chest Dips",
                "Weighted Dips", "Decline Bench Press", "Cable Flyes",
                "Superman Hold", "Resistance Band Rows", "Inverted Rows", "Lat Pulldown",
                "Seated Cable Row", "One-Arm Dumbbell Row", "Pull-Ups", "Deadlifts",
                "Pike Push-Ups", "Dumbbell Shoulder Press", "Lateral Raises", "Face Pulls",
                "Bodyweight Squats", "Goblet Squats", "Barbell Back Squat", "Romanian Deadlift",
                "Standing Calf Raises",
                "Dumbbell Curl", "Rope Pushdowns", "Skull Crushers",
                "Plank", "Hanging Leg Raises", "HIIT Sprint Intervals"
            ];

            const mapping = {};

            targets.forEach(t => {
                // simple search
                const query = t.toLowerCase().replace('-', ' ').replace('sprint intervals', 'sprint');
                let match = exercises.find(e => e.name.toLowerCase() === query);
                if (!match) {
                    match = exercises.find(e => e.name.toLowerCase().includes(query));
                }
                if (!match) {
                    const words = query.split(' ');
                    match = exercises.find(e => e.name.toLowerCase().includes(words[0]) && e.name.toLowerCase().includes(words[words.length-1]));
                }
                if (match && match.images && match.images.length > 0) {
                    mapping[t] = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${match.images[0]}`;
                } else {
                    mapping[t] = null;
                }
            });

            console.log(JSON.stringify(mapping, null, 2));
        } catch(e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', err => {
    console.error('HTTPS Error:', err.message);
});
