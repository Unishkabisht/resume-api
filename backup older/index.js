const express = require("express");
const app = express();
const PORT = 3000;

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const documentRoutes = require("./routes/documents");
const templateRoutes = require("./routes/templates");
const aiRoutes = require("./routes/ai");
const applicationRoutes = require("./routes/applications");

app.use(express.json());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/applications", applicationRoutes);

// ================= SERVER =================

app.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});