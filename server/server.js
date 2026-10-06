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
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const markRoutes = require("./routes/markRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/availability", availabilityRoutes);


console.log("Auth routes loaded");
console.log("Student routes loaded");
console.log("Teacher routes loaded");
console.log("Subject routes loaded");
console.log("Attendance routes loaded");
console.log("Mark routes loaded");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("College Management System API is Running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});