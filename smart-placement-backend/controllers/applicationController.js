const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");

// ✅ APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    // 🔒 Prevent duplicate application
    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user || !job) {
      return res.status(404).json({ message: "User or Job not found" });
    }

    // 🎯 CGPA eligibility check
    if (user.cgpa < job.eligibility) {
      return res.status(400).json({ message: "CGPA not sufficient" });
    }

    const application = await Application.create({
      userId,
      jobId,
      status: "Applied"
    });

    res.status(201).json({ message: "Applied successfully", application });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ GET ALL APPLICATIONS (ADMIN)
exports.getApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const applications = await Application.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email cgpa")
      .populate("jobId", "company role location package eligibility deadline");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ GET STUDENT APPLICATIONS (FIXED WITH POPULATE)
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("jobId", "company role location package")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ UPDATE STATUS (ADMIN)
exports.updateStatus = async (req, res) => {
  try {
    const allowed = ["Applied", "Interview", "Selected", "Rejected"];

    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated", application });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};