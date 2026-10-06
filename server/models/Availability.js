const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
            unique: true,
        },

        isPresent: {
            type: Boolean,
            default: false,
        },

        note: {
            type: String,
            default: "",
            maxlength: 120,
        },

        // Presence switches itself off after this time, so a forgotten toggle never misleads students
        expiresAt: {
            type: Date,
            default: null,
        },

        // Students who asked to be alerted when this teacher comes in
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Availability", availabilitySchema);
