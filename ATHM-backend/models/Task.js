const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", 
    },
    title: { type: String, required: true },
    description: { type: String },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["personal", "assignment"],
      default: "personal",
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
    completedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);