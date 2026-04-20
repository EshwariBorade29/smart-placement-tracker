const User = require("../models/User");
const Job = require("../models/Job");

// ✅ ADD JOB (Company/TNP only)
exports.addJob = async (req, res) => {
    try {
        const { company, role, package, location, eligibility, deadline } = req.body;

        const job = await Job.create({
            company,
            role,
            package,
            location,
            eligibility,
            deadline,
            userId: req.user.id // still needed for delete auth
        });

        res.status(201).json({ message: "Job added", job });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET ALL JOBS (PUBLIC — for students)
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find(); // 🔥 FIX HERE
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ DELETE JOB (only creator can delete)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await job.deleteOne();

        res.json({ message: "Job deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};