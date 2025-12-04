"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const JWT_SECRET = String(process.env.JWT_SECRET);
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({
            message: "Missing required fields: username, email, and password.",
        });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        const result = await db_1.default.query(`INSERT INTO users (name, email, password_hash)
			VALUES ($1, $2, $3) RETURNING *`, [username, email, hashedPassword]);
        const newUser = result.rows[0];
        const tokenPayload = {
            id: newUser.id,
            username: newUser.username,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
        res
            .status(201)
            .json({ message: "User signed up successfully", token: token });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).send({
            message: "An internal server error occurred during registration.",
        });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("LOGIN", req.body);
    if (!email || !password) {
        return res
            .status(400)
            .send({ message: "Email and password are required." });
    }
    const user = await db_1.default.query(`SELECT * FROM users
		WHERE email = ($1)`, [email]);
    if (user.rows.length === 0) {
        return res.status(404).json({ message: "User does not exist" });
    }
    try {
        const userData = user.rows[0];
        const userEmail = userData.email;
        const userPassword = userData.password_hash;
        const username = userData.name;
        const userId = userData.id;
        const isMatch = await bcryptjs_1.default.compare(password, userPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const tokenPayload = {
            id: userId,
            email: userEmail,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            user: {
                id: userId,
                username: username,
                email: userEmail,
            },
            token: token,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "SERVER ERROR" });
    }
});
exports.default = router;
