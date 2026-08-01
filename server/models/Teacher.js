const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        employeeId: {
            type: String,
            required: true,
            unique: true,
        },

        department: {
            type: String,
            required: true,
        },

        designation: {
            type: String,
            required: true,
        },

        qualification: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
        },

        address: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Teacher", teacherSchema);