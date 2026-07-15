// Importing express — the framework we use to build our server.
const express = require('express');

// Importing all our routes (combined in routes/index.js).
const routes = require('./routes');

// Creating our express application.
const app = express();

// This middleware lets our server understand JSON data
// sent by the client in a POST/PUT request body.
app.use(express.json());

// Every route we defined will now start with '/api'.
// Example: '/documents' becomes '/api/documents'.
app.use('/api', routes);

// Starting the server — it will listen for requests on port 3000.
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
