require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI غير موجودة في .env");
  process.exit(1);
}

// بيانات أول Admin
const firstAdmin = {
  username: "LubnaTurkmani",
  email: "lubnaturk@test.com",
  password: "123456", // 🔥 تقدري تغيريه
  role: "ADMIN",
  factory: null,
};

async function createFirstAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: firstAdmin.email });
    if (existing) {
      console.warn("⚠️ Admin already exists!");
      process.exit(0);
    }

    // 🔐 تشفير الباسورد
    const hashedPassword = await bcrypt.hash(firstAdmin.password, 10);

    const newAdmin = new User({
      username: firstAdmin.username,
      email: firstAdmin.email,
      password: hashedPassword,
      role: "ADMIN",
      factory: null,
      mustChangePassword: false, // 🔥 مهم
    });

    await newAdmin.save();

    console.log("🔥 Admin created successfully!");
    console.log("📧 Email:", firstAdmin.email);
    console.log("🔑 Password:", firstAdmin.password);

    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createFirstAdmin();