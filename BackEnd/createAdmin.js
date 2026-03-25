require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("./models/user");
const nodemailer = require("nodemailer");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartvest";

// بيانات أول أدمن بدون باسورد
const firstAdmin = {
  username: "admin_main",
  email: "admin@factory.com",
  role: "ADMIN",
  factory: null, // لو عندك مصنع محدد
};

async function createFirstAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const existing = await User.findOne({ email: firstAdmin.email });
    if (existing) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // إنشاء رمز تحقق مؤقت
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 60; // صلاحية ساعة

    const newAdmin = new User({
      ...firstAdmin,
      verificationToken: token,
      verificationTokenExpires: tokenExpires,
    });

    await newAdmin.save();

    // إعداد البريد
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io", //  صالح SMTP استخدمي
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verificationUrl = `https://your-frontend.com/set-password?token=${token}`;

    await transporter.sendMail({
      from: '"SmartVest" <no-reply@smartvest.com>',
      to: firstAdmin.email,
      subject: "Activate your Admin account",
      html: `<p>Welcome! Click the link below to set your password and activate your Admin account:</p>
             <a href="${verificationUrl}">Set Password</a>
             <p>This link expires in 1 hour.</p>`,
    });

    console.log("First Admin created and email sent!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createFirstAdmin();