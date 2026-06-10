const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    package: {
        type: Number
    },

    location: {
        type: String
    },

    eligibility: {
        type: Number
    },

    deadline: {
        type: Date
    },

    // ✅ ADD THIS
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);