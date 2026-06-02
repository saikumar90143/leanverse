const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'exercises');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const mapping = {
  "Dumbbell Floor Press": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Floor_Press/0.jpg",
  "Incline Dumbbell Press": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
  "Dumbbell Flyes": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg",
  "Decline Bench Press": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg",
  "Cable Flyes": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Cable_Flyes/0.jpg",
  "One-Arm Dumbbell Row": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_One-Arm_Long_Bar_Row/0.jpg",
  "Dumbbell Shoulder Press": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg",
  "Barbell Back Squat": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg",
  "Dumbbell Curl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Incline_Dumbbell_Curl/0.jpg",
  "Plank": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg"
};

Object.keys(mapping).forEach(name => {
    const url = mapping[name];
    if (!url) return;
    const filename = name.toLowerCase().replace(/ /g, '_').replace(/-/g, '') + '.jpg';
    const filePath = path.join(dir, filename);
    
    https.get(url, (res) => {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
        });
    }).on('error', (err) => {
        console.log(`Error downloading ${filename}: ${err.message}`);
    });
});
