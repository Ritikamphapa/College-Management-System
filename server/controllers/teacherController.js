const Teacher = require("../models/Teacher");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= CREATE TEACHER =================

const createTeacher = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            employeeId,
            department,
            designation,
            qualification,
            phone,
            address,
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !employeeId ||
            !department ||
            !designation ||
            !qualification
        ) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const teacherExists = await Teacher.findOne({ employeeId });

        if (teacherExists) {
            return res.status(400).json({
                message: "Employee ID already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
            department,
        });

        const teacher = await Teacher.create({
            user: user._id,
            employeeId,
            department,
            designation,
            qualification,
            phone,
            address,
        });

        res.status(201).json({
            message: "Teacher created successfully",
            teacher,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET ALL TEACHERS =================

const getAllTeachers = async (req, res) => {
    try {

        const teachers = await Teacher.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: teachers.length,
            teachers,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET TEACHER BY ID =================

const getTeacherById = async (req, res) => {
    try {

        const teacher = await Teacher.findById(req.params.id)
            .populate("user", "-password");

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found",
            });
        }

        res.status(200).json(teacher);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= GET TEACHER PROFILE =================

const getTeacherProfile = async (req, res) => {
    try {

        const teacher = await Teacher.findOne({
            user: req.user._id,
        }).populate("user", "-password");

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found",
            });
        }

        res.status(200).json(teacher);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ================= UPDATE TEACHER PROFILE =================

const updateTeacherProfile = async (req, res) => {
    try {

        const {
            department,
            designation,
            qualification,
            phone,
            address,
        } = req.body;

        const teacher = await Teacher.findOne({
            user: req.user._id,
        });

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found",
            });
        }

        teacher.department = department || teacher.department;
        teacher.designation = designation || teacher.designation;
        teacher.qualification =
            qualification || teacher.qualification;
        teacher.phone = phone || teacher.phone;
        teacher.address = address || teacher.address;

        await teacher.save();

        res.status(200).json({
            message: "Teacher profile updated successfully",
            teacher,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
// ================= UPDATE TEACHER (ADMIN) =================

const updateTeacher = async (req, res) => {
    try {

        const {
            department,
            designation,
            qualification,
            phone,
            address
        } = req.body;

        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        teacher.department = department || teacher.department;
        teacher.designation = designation || teacher.designation;
        teacher.qualification = qualification || teacher.qualification;
        teacher.phone = phone || teacher.phone;
        teacher.address = address || teacher.address;

        await teacher.save();

        res.status(200).json({
            message: "Teacher updated successfully",
            teacher
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    getTeacherProfile,
    updateTeacherProfile,
};