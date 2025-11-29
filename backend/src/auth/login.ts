import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs"


const app = express();
const PORT = 5000;

// middleware 
app.use(express.json()); 

interface UserInfo { 
    id: number;
    userName: string;
    email: string;
    password: string;
}

const users: UserInfo[] = [];
const login: UserInfo[] = [];

app.post("/users", async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    
    if (!userName || !email || !password) {
        return res.status(400).send({ message: "Missing required fields: userName, email, and password." });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser: UserInfo = {
        id: newId,
        userName,
        email,
        password: hashedPassword,
    };
    
    users.push(newUser);
    
    const { password: _, ...userResponse } = newUser; // Destructure to exclude password
    res.status(201).send(userResponse);
});

app.post("/login", async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email || !password){return res.status(400).send({ message: "Email and password are required." });}

    const user = users.find(u => u.email === email)
    if (!user) {
        return res.status(401).send({ message: "Invalid credentials." });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});