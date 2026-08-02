const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        subjectCode: {
            type: String,
            required: true,
            unique: true,
        },

        subjectName: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            required: true,
        },

        semester: {
            type: Number,
            required: true,
        },

        credits: {
            type: Number,
            required: true,
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Subject", subjectSchema);