const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  history: [{ type: Date }],
});

module.exports = mongoose.model("Habit", habitSchema);
