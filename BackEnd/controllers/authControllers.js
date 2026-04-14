const User = require("../models/user");
const Factory = require("../models/factory");
const paginate = require("../utils/paginate"); // helper اللي عملتيه
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("node:console");



// ================= REGISTER (ADMIN ONLY) =================
const register = async (req, res) => {
  try {
    const { username, email, password, role, workerID, factoryName } = req.body;
    

    // 🔴 تحقق
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, password are required" });
    }

    // 🔴 فقط الادمن
    if (!req.user.role || !["ADMIN", "FACTORY_MANAGER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Only admin or manager can create users" });
    }

    // إذا المستخدم Manager
     if (req.user.role === "FACTORY_MANAGER" && role === "ADMIN") {
      return res.status(403).json({ error: "Manager cannot create admin" });
    }

      // ✅ التحقق من صحة الدور
    const validRoles = ["ADMIN", "FACTORY_MANAGER", "SECURITY", "SAFETY"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ التعديل الجديد
let factoryId = null;

if (role === "FACTORY_MANAGER") {
  const nameToUse = factoryName || `${username}'s Factory`;

  let factory = await Factory.findOne({
  name: { $regex: `^${nameToUse.trim()}$`, $options: "i" }
});

  if (!factory) {
    factory = new Factory({
      name: nameToUse,
      createdBy: req.user._id,
      zones: [],
      isConfigured: false,
      manager: null,
    });
    await factory.save();
  }

  factoryId = factory._id;
}

    const newUser = new User({
      username: username.trim(),
      email,
      password: hashedPassword,
      role: role || "SECURITY", // default
      workerID: workerID || null,
      factory: role === "FACTORY_MANAGER" ? factoryId : req.user.factory || null,
      mustChangePassword: true,
    });
    await newUser.save();

    // بعد حفظ المستخدم نحدث المصنع ليكون المدير نفسه
    if (role === "FACTORY_MANAGER") {
      const factory = await Factory.findById(factoryId);
      factory.manager = newUser._id;
      await factory.save();
    }

    res.status(201).json({
      message: "User created successfully",
    });

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔥 أول مرة
    if (user.mustChangePassword) {
      const tempToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "You must change your password first",
        tempToken,
      });
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
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {
    const { token ,newPassword } = req.body;

    if ( !token || !newPassword) {
      return res.status(400).json({ error: "Token and New password required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found"});
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();

    const newToken= jwt.sign(
      { id: user._id, role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:"1h"}
    );

    res.json({ message: "Password updated successfully", token:newToken });

  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


// ================= GET ME =================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= GET USERS =================
const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req);

    let query = {};
    if (req.user.role === "FACTORY_MANAGER") {
      query.factory = req.user.factory;
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments(query);
    res.status(200).json({
      users,
      totalUsers: total,        // العدد الكلي
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  getUsers
};