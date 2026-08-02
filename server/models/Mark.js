const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        examType: {
            type: String,
            enum: ["Assignment", "Mid Semester", "End Semester"],
            required: true,
        },

        marksObtained: {
            type: Number,
            required: true,
        },

        totalMarks: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Mark", markSchema);