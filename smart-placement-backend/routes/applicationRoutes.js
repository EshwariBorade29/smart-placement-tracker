const express = require("express");
const router = express.Router();
const appController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

// All application routes require authentication
router.post("/apply", authMiddleware, appController.applyJob);

// /applications/my — student fetches their own applications (uses req.user.id from token)
router.get("/my", authMiddleware, appController.getUserApplications);

// /applications — admin fetches all applications
router.get("/", authMiddleware, appController.getApplications);

router.put("/status/:id", authMiddleware, appController.updateStatus);

module.exports = router;
