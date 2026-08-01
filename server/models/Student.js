const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rollNumber: {
        type: String,
        required: true,
        unique: true
    },

    semester: {
        type: Number,
        required: true
    },

    branch: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    address: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);