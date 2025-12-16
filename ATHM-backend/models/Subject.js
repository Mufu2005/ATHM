const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  color: { type: String, default: "#000000" },
});

module.exports = mongoose.model("Subject", subjectSchema);
