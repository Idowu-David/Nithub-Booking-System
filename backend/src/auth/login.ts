import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs" // Using bcryptjs

const app = express();
const PORT = 5000;

// middleware 
app.use(express.json()); 

interface UserInfo { 
    id: number;
    userName: string;
    email: string;
    password: string; // Stores the HASHED password
}

const users: UserInfo[] = []; 
// const login: UserInfo[] = []; // Removed: This array is not needed for the current logic

app.post("/users", async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    
    if (!userName || !email || !password) {
        return res.status(400).send({ message: "Missing required fields: userName, email, and password." });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(409).send({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser: UserInfo = {
        id: newId,
        userName,
        email,
        password: hashedPassword,
    };
    
    users.push(newUser);
    
    const { password: _, ...userResponse } = newUser;
    res.status(201).send(userResponse);
});

// --- COMPLETED Login Route ---
app.post("/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).send({ message: "Email and password are required." });
    }

    // 1. Find the user
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).send({ message: "Invalid credentials." });
    }

    try {
        // 2. Compare the provided password with the stored HASH
        const isMatch = await bcryptjs.compare(password, user.password);

        if (isMatch) {
            // Login Successful
            const { password: _, ...userResponse } = user;
            return res.status(200).send({ 
                message: "Login successful!", 
                user: userResponse
                // JWT Token generation goes here!
            });
        } else {
            // Passwords don't match
            return res.status(401).send({ message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return res.status(500).send({ message: "An internal server error occurred." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});