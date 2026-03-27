const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true, // 🟢 صار إجباري
    },

    role: {
      type: String,
      enum: ["ADMIN","FACTORY_MANAGER", "SECURITY", "SAFETY"],
      default: "SECURITY", // 🟢 default آمن
    },

    workerID: {
      type: String,
      default: null,
    },

    factory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factory",
      default: null,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);