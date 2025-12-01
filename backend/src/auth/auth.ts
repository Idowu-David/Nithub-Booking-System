import express, { Router, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = String(process.env.JWT_SECRET);
const router = Router();
// // --- JWT Verification Middleware ---
// const verifyToken = (
//   req: AuthRequest,
//   res: Response,
//   next: express.NextFunction
// ) => {
//   // 1. Check for the token in the Authorization header
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Get the token part: Bearer <token>

//   if (!token) {
//     return res
//       .status(403)
//       .send({ message: "Access denied. No token provided." });
//   }

//   try {
//     // 2. Verify the token using the secret key
//     const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

//     // 3. Attach the decoded user data to the request object
//     req.user = decoded;

//     // 4. Continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     // If verification fails (e.g., token is expired or invalid signature)
//     return res.status(401).send({ message: "Invalid or expired token." });
//   }
// };

// 📝 Registration Route
router.post("/signup", async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).send({
      message: "Missing required fields: userName, email, and password.",
    });
  }

  // if (users.find((u) => u.email === email)) {
  //   return res
  //     .status(409)
  //     .send({ message: "User with this email already exists." });
  // }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    // const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
			VALUES ($1, $2, $3) RETURNING *`,
      [userName, email, hashedPassword]
    );

    const newUser = result.rows[0];

    const tokenPayload = {
      id: newUser.id,
      username: newUser.username,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(201)
      .json({ message: "User signed up successfully", token: token });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send({
      message: "An internal server error occurred during registration.",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	
	console.log(req.body)

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required." });
  }

  const user = await db.query(
    `SELECT * FROM users
		WHERE email = ($1)`,
    [email]
	);
	
  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User does not exist" });
  }

  try {
    const userData = user.rows[0];
    const userEmail = userData.email;
    const userPassword = userData.password_hash;
    const userName = userData.username;
    const userId = userData.id;

    const isMatch = await bcryptjs.compare(password, userPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = {
      id: userId,
      email: userEmail,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      user: {
        id: userId,
        username: userName,
        email: userEmail,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

// // 🛡️ Protected Route (Requires a Valid JWT)
// app.get("/dashboard", verifyToken, (req: AuthRequest, res: Response) => {
//   // This route handler only executes if verifyToken successfully passed.

//   if (req.user) {
//     res.status(200).send({
//       message: `Welcome to the dashboard, ${req.user.userName}!`,
//       data: {
//         userId: req.user.id,
//         // // Example of protected data accessed after verification
//         // protectedResource: "Here is your protected data using the valid JWT."
//       },
//     });
//   } else {
//     res
//       .status(500)
//       .send({ message: "User data missing from request after verification." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default router;
