const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= CREATE STUDENT =================

const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            rollNumber,
            semester,
            branch,
            section,
            phone,
            address,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !email ||
            !password ||
            !rollNumber ||
            !semester ||
            !branch ||
            !section
        ) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        // Check if roll number already exists
        const rollExists = await Student.findOne({ rollNumber });

        if (rollExists) {
            return res.status(400).json({
                message: "Roll number already exists",
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: "student",
            });
        } else {
            // Existing user must be a student
            if (user.role !== "student") {
                return res.status(400).json({
                    message: "This email belongs to a non-student user",
                });
            }
        }

        // Check if student profile already exists
        const studentExists = await Student.findOne({
            user: user._id,
        });

        if (studentExists) {
            return res.status(400).json({
                message: "Student profile already exists",
            });
        }

        // Create Student Profile
        const student = await Student.create({
            user: user._id,
            rollNumber,
            semester,
            branch,
            section,
            phone,
            address,
        });

        res.status(201).json({
            message: "Student created successfully",
            student,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET STUDENT PROFILE =================

const getStudentProfile = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user._id,
        }).populate("user", "-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json(student);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= UPDATE STUDENT PROFILE =================

const updateStudentProfile = async (req, res) => {
    try {

        const {
            semester,
            branch,
            section,
            phone,
            address,
        } = req.body;

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        student.semester = semester || student.semester;
        student.branch = branch || student.branch;
        student.section = section || student.section;
        student.phone = phone || student.phone;
        student.address = address || student.address;

        await student.save();

        res.status(200).json({
            message: "Student profile updated successfully",
            student,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
// ================= GET ALL STUDENTS (ADMIN) =================

const getAllStudents = async (req, res) => {
    try {

        const students = await Student.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: students.length,
            students
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= GET STUDENT BY ID (ADMIN) =================

const getStudentById = async (req, res) => {
    try {

        const student = await Student.findById(req.params.id)
            .populate("user", "-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= UPDATE STUDENT BY ID (ADMIN) =================

const updateStudentById = async (req, res) => {
    try {

        const {
            semester,
            branch,
            section,
            phone,
            address
        } = req.body;

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        student.semester = semester || student.semester;
        student.branch = branch || student.branch;
        student.section = section || student.section;
        student.phone = phone || student.phone;
        student.address = address || student.address;

        await student.save();

        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
// ================= DELETE STUDENT (ADMIN) =================

const deleteStudent = async (req, res) => {
    try {

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Delete the linked user account
        await User.findByIdAndDelete(student.user);

        // Delete the student profile
        await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
module.exports = {
    createStudent,
    getStudentProfile,
    updateStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
    deleteStudent
};