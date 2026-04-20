const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Apply for job
router.post("/apply", async (req, res) => {
  const { userId, jobId } = req.body;

  const existing = await Application.findOne({ userId, jobId });
  if (existing) {
    return res.json({ message: "Already applied" });
  }

  const app = new Application({ userId, jobId });
  await app.save();

  res.json({ message: "Applied successfully" });
});

// Get applications of user
router.get("/:userId", async (req, res) => {
  const apps = await Application.find({ userId: req.params.userId });
  res.json(apps);
});

// 🔥 NEW: Get all applications (for TNP)
router.get("/", async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
});

// 🔥 NEW: Update status
router.put("/status/:id", async (req, res) => {
  const { status } = req.body;

  await Application.findByIdAndUpdate(req.params.id, { status });

  res.json({ message: "Status updated" });
});

module.exports = router;