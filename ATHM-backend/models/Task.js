const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
