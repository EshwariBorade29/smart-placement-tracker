const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/placement_tracker");

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("DB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;