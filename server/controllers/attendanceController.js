const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");

// ================= MARK ATTENDANCE =================

const markAttendance = async (req, res) => {
    try {

        const {
            studentId,
            subjectId,
            teacherId,
            date,
            status
        } = req.body;

        if (
            !studentId ||
            !subjectId ||
            !teacherId ||
            !date ||
            !status
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        const attendance = await Attendance.create({
            student: studentId,
            subject: subjectId,
            teacher: teacherId,
            date,
            status
        });

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

// ================= GET ALL ATTENDANCE =================

const getAllAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.find()
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "-password"
                }
            })
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password"
                }
            })
            .populate("subject")
            .sort({ date: -1 });

        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

// ================= GET ATTENDANCE BY ID =================

const getAttendanceById = async (req, res) => {
    try {

        const attendance = await Attendance.findById(req.params.id)
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "-password"
                }
            })
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password"
                }
            })
            .populate("subject");

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json(attendance);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= UPDATE ATTENDANCE =================

const updateAttendance = async (req, res) => {
    try {

        const { date, status } = req.body;

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        attendance.date = date || attendance.date;
        attendance.status = status || attendance.status;

        await attendance.save();

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= DELETE ATTENDANCE =================

const deleteAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        await Attendance.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= GET STUDENT ATTENDANCE =================

const getStudentAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.find({
            student: req.params.studentId
        })
            .populate("subject")
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password"
                }
            })
            .sort({ date: -1 });

        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= ATTENDANCE PERCENTAGE =================

const getAttendancePercentage = async (req, res) => {
    try {

        const total = await Attendance.countDocuments({
            student: req.params.studentId
        });

        const present = await Attendance.countDocuments({
            student: req.params.studentId,
            status: "Present"
        });

        const percentage =
            total === 0 ? 0 : ((present / total) * 100).toFixed(2);

        res.status(200).json({
            totalClasses: total,
            presentClasses: present,
            attendancePercentage: `${percentage}%`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
module.exports = {
    markAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    getAttendancePercentage,
    getStudentAttendance,
    deleteAttendance
};