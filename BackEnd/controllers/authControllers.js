const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { username, email, role, workerID } = req.body;

    if (!username || !email ) {
      return res.status(400).json({ error: "Username, email, are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username.trim(),
      email,
      //password: hashedPassword,
      role,
      workerID: workerID || null,
      factory: req.user?.factory || null, // حماية إذا ما في req.user
    });
    
    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = token;
    newUser.verificationTokenExpires = Date.now() + 3600000;

    await newUser.save();

    res.status(201).json({ message: "User registered successfully",verificationToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔴 مهم: إذا المستخدم لسا ما حط باسورد
    if (!user.password) {
      return res.status(403).json({ error: "Please set your password first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        workerID: user.workerID,
        factory: user.factory,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        workerID: user.workerID,
        factory: user.factory,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ME =================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= SET PASSWORD (🔥 الجديد) =================
const setPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  register,
  login,
  getMe,
  setPasswordController, 
};