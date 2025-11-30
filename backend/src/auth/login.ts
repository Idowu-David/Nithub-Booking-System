import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;

// 🔒 CRITICAL: A secret key used to sign the JWTs. 
// In a real application, this MUST be stored in an environment variable!
const JWT_SECRET = "YOUR_SUPER_SECURE_SECRET_KEY_123"; 

interface UserInfo { 
    id: number;
    userName: string;
    email: string;
    password: string; 
}

interface UserPayload {
    id: number;
    userName: string;
}

interface AuthRequest extends Request {
    user?: UserPayload;
}
const users: UserInfo[] = []; 

app.use(express.json()); 

// --- JWT Verification Middleware ---
const verifyToken = (req: AuthRequest, res: Response, next: express.NextFunction) => {
    // 1. Check for the token in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token part: Bearer <token>

    if (!token) {
        return res.status(403).send({ message: "Access denied. No token provided." });
    }

    try {
        // 2. Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        
        // 3. Attach the decoded user data to the request object
        req.user = decoded; 
        
        // 4. Continue to the next middleware or route handler
        next();
    } catch (error) {
        // If verification fails (e.g., token is expired or invalid signature)
        return res.status(401).send({ message: "Invalid or expired token." });
    }
};

// 📝 Registration Route
app.post("/users", async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    
    if (!userName || !email || !password) {
        return res.status(400).send({ message: "Missing required fields: userName, email, and password." });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(409).send({ message: "User with this email already exists." });
    }

    try {
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
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).send({ message: "An internal server error occurred during registration." });
    }
});

app.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required." });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).send({ message: "Invalid credentials." });
    }

    try {
        const isMatch = await bcryptjs.compare(password, user.password);

        if (isMatch) {
            // Define the JWT payload (data to store in the token)
            const payload: UserPayload = { 
                id: user.id, 
                userName: user.userName 
            };
            
            // Generate the token
            const token = jwt.sign(
                payload, 
                JWT_SECRET, 
                { expiresIn: '1h' } // Token expires in 1 hour
            );
            
            // Login Successful: Send the token back to the client
            const { password: _, ...userResponse } = user;
            return res.status(200).send({ 
                message: "Login successful!", 
                user: userResponse,
                token: token // Client stores this token
            });
        } else {
            return res.status(401).send({ message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return res.status(500).send({ message: "An internal server error occurred." });
    }
});

// 🛡️ Protected Route (Requires a Valid JWT)
app.get("/dashboard", verifyToken, (req: AuthRequest, res: Response) => {
    // This route handler only executes if verifyToken successfully passed.
    
    if (req.user) {
        res.status(200).send({
            message: `Welcome to the dashboard, ${req.user.userName}!`,
            data: { 
                userId: req.user.id,
                // // Example of protected data accessed after verification
                // protectedResource: "Here is your protected data using the valid JWT."
            }
        });
    } else {
        res.status(500).send({ message: "User data missing from request after verification." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});