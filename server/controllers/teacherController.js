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
            address
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
                message: "Please fill all required fields"
            });
        }

        const employeeExists = await Teacher.findOne({ employeeId });

        if (employeeExists) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {

            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: "teacher",
                department
            });

        } else {

            if (user.role !== "teacher") {
                return res.status(400).json({
                    message: "This email belongs to another user role"
                });
            }

        }

        const teacherExists = await Teacher.findOne({
            user: user._id
        });

        if (teacherExists) {
            return res.status(400).json({
                message: "Teacher profile already exists"
            });
        }

        const teacher = await Teacher.create({
            user: user._id,
            employeeId,
            department,
            designation,
            qualification,
            phone,
            address
        });

        res.status(201).json({
            message: "Teacher created successfully",
            teacher
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
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
            teachers
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
    getAllTeachers
};