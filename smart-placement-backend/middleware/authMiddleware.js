const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // ❌ No header
        if (!authHeader) {
            return res.status(401).json({ message: "No token, access denied" });
        }

        // ✅ Extract token
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // ❌ Invalid format
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Attach user data
        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message); // 🔥 Debug line
        res.status(401).json({ message: "Invalid token" });
    }
};