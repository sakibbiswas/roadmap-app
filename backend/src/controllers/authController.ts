// import { Request, Response } from "express";
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const register = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password are required" });

//   try {
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser)
//       return res.status(400).json({ error: "User with this email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       email: email.toLowerCase(),
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error during registration" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password are required" });

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
//       expiresIn: "1d",
//     });

//     return res.json({ token, email: user.email });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error during login" });
//   }
// };




// controllers/authController.ts

// import { Request, Response } from "express";
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const register = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password are required" });

//   try {
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser)
//       return res.status(400).json({ error: "User with this email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       email: email.toLowerCase(),
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET!, {
//       expiresIn: "1d",
//     });

//     return res.status(201).json({ token, email: newUser.email });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error during registration" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password are required" });

//   try {
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
//       expiresIn: "1d",
//     });

//     return res.json({ token, email: user.email });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error during login" });
//   }
// };






import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ error: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Return token so frontend can login immediately
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.status(201).json({ token, email: newUser.email });
  } catch (error) {
    return res.status(500).json({ error: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.json({ token, email: user.email });
  } catch (error) {
    return res.status(500).json({ error: "Server error during login" });
  }
};
