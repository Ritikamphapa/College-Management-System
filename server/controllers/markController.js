const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");

// ================= ADD MARK =================

const addMark = async (req, res) => {
    try {

        const {
            studentId,
            subjectId,
            teacherId,
            examType,
            marksObtained,
            totalMarks
        } = req.body;

        if (
            !studentId ||
            !subjectId ||
            !teacherId ||
            !examType ||
            marksObtained === undefined ||
            totalMarks === undefined
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

        const mark = await Mark.create({
            student: studentId,
            subject: subjectId,
            teacher: teacherId,
            examType,
            marksObtained,
            totalMarks,
        });

        res.status(201).json({
            message: "Marks added successfully",
            mark,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
};

// ================= GET ALL MARKS =================

const getAllMarks = async (req, res) => {
    try {

        const marks = await Mark.find()
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "-password",
                },
            })
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password",
                },
            })
            .populate("subject")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: marks.length,
            marks,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
};
// ================= GET STUDENT MARKS =================

const getStudentMarks = async (req, res) => {
    try {

        const marks = await Mark.find({
            student: req.params.studentId
        })
            .populate("subject")
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password"
                }
            });

        res.status(200).json({
            count: marks.length,
            marks
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= UPDATE MARK =================

const updateMark = async (req, res) => {
    try {

        const {
            marksObtained,
            totalMarks,
            examType
        } = req.body;

        const mark = await Mark.findById(req.params.id);

        if (!mark) {
            return res.status(404).json({
                message: "Mark not found"
            });
        }

        mark.marksObtained = marksObtained ?? mark.marksObtained;
        mark.totalMarks = totalMarks ?? mark.totalMarks;
        mark.examType = examType || mark.examType;

        await mark.save();

        res.status(200).json({
            message: "Marks updated successfully",
            mark
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= DELETE MARK =================

const deleteMark = async (req, res) => {
    try {

        const mark = await Mark.findById(req.params.id);

        if (!mark) {
            return res.status(404).json({
                message: "Mark not found"
            });
        }

        await Mark.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Mark deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
module.exports = {
    addMark,
    getAllMarks,
    getStudentMarks,
    updateMark,
    deleteMark
};