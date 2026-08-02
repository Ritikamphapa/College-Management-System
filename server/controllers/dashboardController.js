const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const Mark = require("../models/Mark");

const getAdminDashboard = async (req, res) => {
    try {

        const totalStudents = await Student.countDocuments();

        const totalTeachers = await Teacher.countDocuments();

        const totalSubjects = await Subject.countDocuments();

        const totalAttendance = await Attendance.countDocuments();

        const totalMarks = await Mark.countDocuments();

        res.status(200).json({
            totalStudents,
            totalTeachers,
            totalSubjects,
            totalAttendance,
            totalMarks
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    getAdminDashboard
};