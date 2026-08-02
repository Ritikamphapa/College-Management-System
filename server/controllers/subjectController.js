const Subject = require("../models/Subject");

// ================= CREATE SUBJECT =================

const createSubject = async (req, res) => {
    try {
        const {
            subjectCode,
            subjectName,
            department,
            semester,
            credits,
        } = req.body;

        if (
            !subjectCode ||
            !subjectName ||
            !department ||
            !semester ||
            !credits
        ) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const existingSubject = await Subject.findOne({ subjectCode });

        if (existingSubject) {
            return res.status(400).json({
                message: "Subject code already exists",
            });
        }

        const subject = await Subject.create({
            subjectCode,
            subjectName,
            department,
            semester,
            credits,
        });

        res.status(201).json({
            message: "Subject created successfully",
            subject,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET ALL SUBJECTS =================

const getAllSubjects = async (req, res) => {
    try {

        const subjects = await Subject.find()
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: subjects.length,
            subjects,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET SUBJECT BY ID =================

const getSubjectById = async (req, res) => {
    try {

        const subject = await Subject.findById(req.params.id)
            .populate({
                path: "teacher",
                populate: {
                    path: "user",
                    select: "-password",
                },
            });

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found",
            });
        }

        res.status(200).json(subject);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
// ================= UPDATE SUBJECT =================

const updateSubject = async (req, res) => {
    try {

        const {
            subjectName,
            department,
            semester,
            credits
        } = req.body;

        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        subject.subjectName = subjectName || subject.subjectName;
        subject.department = department || subject.department;
        subject.semester = semester || subject.semester;
        subject.credits = credits || subject.credits;

        await subject.save();

        res.status(200).json({
            message: "Subject updated successfully",
            subject
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= DELETE SUBJECT =================

const deleteSubject = async (req, res) => {
    try {

        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        await Subject.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Subject deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= ASSIGN TEACHER =================

const Teacher = require("../models/Teacher");

const assignTeacher = async (req, res) => {
    try {

        const { teacherId } = req.body;

        const subject = await Subject.findById(req.params.id);

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

        subject.teacher = teacher._id;

        await subject.save();

        res.status(200).json({
            message: "Teacher assigned successfully",
            subject
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    assignTeacher,
    updateSubject,
    deleteSubject,
};