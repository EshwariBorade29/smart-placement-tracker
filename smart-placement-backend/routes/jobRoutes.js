const express = require("express");
const router = express.Router();

const { addJob, getJobs, deleteJob } = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected routes
router.post("/", authMiddleware, addJob);
router.get("/", getJobs); // ✅ PUBLIC NOW
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;