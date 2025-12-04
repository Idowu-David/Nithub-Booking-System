"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = 5000;
// Use environment variable in real app!
const JWT_SECRET = "secret";
const users = [];
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Your Next.js frontend
    credentials: true, // Allow cookies
}));
// JWT Middleware - reads from httpOnly cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
// REGISTER (matches your frontend)
app.post("/api/auth/register", async (req, res) => {
    const { fullname, email, phone, password } = req.body;
    if (!fullname || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    if (users.find(u => u.email === email.toLowerCase())) {
        return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        fullname,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
    };
    users.push(newUser);
    const token = jsonwebtoken_1.default.sign({ id: newUser.id, fullname: newUser.fullname }, JWT_SECRET, { expiresIn: "7d" });
    // Set secure httpOnly cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json({ message: "Registered!", user: userWithoutPass });
});
// LOGIN - THIS IS WHAT YOUR FRONTEND USES
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // Create token
    const token = jsonwebtoken_1.default.sign({ id: user.id, fullname: user.fullname }, JWT_SECRET, { expiresIn: "7d" });
    // Set httpOnly cookie (frontend doesn't see token - super secure)
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...safeUser } = user;
    return res.json({
        message: "Login successful!",
        user: safeUser,
    });
});
// Get current user (for dashboard)
app.get("/api/auth/me", verifyToken, (req, res) => {
    const user = users.find(u => u.id === req.user?.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
});
// Logout
app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
// Protected route example
app.get("/api/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Welcome back, ${req.user?.fullname}!` });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Login → POST http://localhost:${PORT}/api/auth/login`);
});
