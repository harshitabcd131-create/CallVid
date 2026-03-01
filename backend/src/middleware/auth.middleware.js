export const protectRoute = (req, res, next) => {
    try {
        // Passport.js: req.isAuthenticated()
        if (typeof req.isAuthenticated === "function") {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ message: "Unauthorized - you must be logged in" });
            }
            return next();
        }
        // Clerk: req.auth() returns object with userId
        if (typeof req.auth === "function") {
            const authResult = req.auth();
            if (!authResult || !(authResult.isAuthenticated || authResult.userId || authResult.sessionId)) {
                return res.status(401).json({ message: "Unauthorized - you must be logged in" });
            }
            return next();
        }
        // express-jwt or other: req.auth is object
        if (typeof req.auth === "object" && req.auth !== null) {
            if (!(req.auth.isAuthenticated || req.auth.userId || req.auth.sessionId)) {
                return res.status(401).json({ message: "Unauthorized - you must be logged in" });
            }
            return next();
        }
        // Fallback: unauthenticated
        return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    } catch (error) {
        console.error("Error in protectRoute middleware", error);
        return res.status(401).json({ message: "Unauthorized - error in authentication" });
    }
};