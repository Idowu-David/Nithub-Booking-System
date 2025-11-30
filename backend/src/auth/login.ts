import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5000;

// Use environment variable in real app!
const JWT_SECRET = "secret";

// In-memory users (you’ll replace with PostgreSQL later)
interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

const users: User[] = [];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend
    credentials: true, // Allow cookies
  })
);

// Type for protected routes
interface AuthRequest extends Request {
  user?: { id: number; fullname: string };
}

// JWT Middleware - reads from httpOnly cookie
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; fullname: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// REGISTER (matches your frontend)
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (users.find(u => u.email === email.toLowerCase())) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: users.length + 1,
    fullname,
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, fullname: newUser.fullname },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

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
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create token
  const token = jwt.sign(
    { id: user.id, fullname: user.fullname },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

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
app.get("/api/auth/me", verifyToken, (req: AuthRequest, res: Response) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// Logout
app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Protected route example
app.get("/api/dashboard", verifyToken, (req: AuthRequest, res: Response) => {
  res.json({ message: `Welcome back, ${req.user?.fullname}!` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Login → POST http://localhost:${PORT}/api/auth/login`);
});