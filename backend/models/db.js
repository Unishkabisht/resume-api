const fs = require('fs');

const path = require('path');

const dataPath = path.join(__dirname, '../data.json');

// readFileSync reads the file as text; JSON.parse turns that text
// into a usable JS object.
function read() {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
}

// JSON.stringify converts the object into text (2-space indent);
// writeFileSync overwrites the file with that text.
function write(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = { read, write };

// ---------------------------------------------------------------------------
// File: models/db.js
// Handles direct file access for data.json. This is the lowest layer
// of the app — it only knows how to read and write raw JSON, and has
// no idea what a "document" is. documentModel.js calls read()/write()
// from here whenever it needs to work with data.
//
// About the "models" folder:
// Models define how data is stored and accessed. This folder currently
// stores document records (id, name, createdAt, updatedAt) inside
// data.json, which acts as a simple file-based database for the app.
// ---------------------------------------------------------------------------
