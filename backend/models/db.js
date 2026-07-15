// Importing the built-in 'fs' (File System) module.
// This lets us read from and write to files on disk.
const fs = require('fs');

// Importing the built-in 'path' module.
// This helps us build file paths correctly, no matter which OS we're on.
const path = require('path');

// __dirname gives the folder path of THIS file (models folder).
// path.join('..', 'data.json') goes one level up and points to data.json.
// So dataPath = the full, correct path to our data.json file.
const dataPath = path.join(__dirname, '../data.json');

// This function reads the current data from data.json.
function readData() {
    // Reads the file content as raw text (synchronously = code waits here until done).
    const raw = fs.readFileSync(dataPath);

    // Converts that raw text (JSON string) into a real JavaScript object,
    // so we can use it like a normal object/array in our code.
    return JSON.parse(raw);
}

// This function writes (saves) new data into data.json.
function writeData(data) {
    // JSON.stringify turns our JavaScript object back into text.
    // 'null, 2' just makes the saved file neatly formatted (2-space indent).
    // writeFileSync replaces the old file content with this new text.
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Exporting both functions so other files (like controllers) can import and use them.
module.exports = { readData, writeData };
