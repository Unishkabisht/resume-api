// app.js
// Entry point of the application. This file wires together the core
// Express middleware, mounts all API routes, and starts the HTTP server.

const express = require("express");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies
app.use(express.json());

// All API routes are mounted under /api (see routes/index.js)
app.use("/api", routes);

// Fallback handler for any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Resume API is running on http://localhost:${PORT}`);
});

module.exports = app;