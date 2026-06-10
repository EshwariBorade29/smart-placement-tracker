require("dotenv").config();

const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

app.get("/", (req, res) => {
    res.send("Smart Placement Backend Running 🚀");
});

const startServer = async () => {
    try {
        await connectDB();

       const PORT = process.env.PORT || 5000;
          app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
       });

    } catch (error) {
        console.log("Server failed:", error.message);
    }
};

startServer();