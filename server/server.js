const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

console.log("Auth routes loaded");
console.log("Student routes loaded");
console.log("Teacher routes loaded");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("College Management System API is Running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});