const express = require("express");
const {
  getHabits,
  createHabit,
  completeHabit,
} = require("../controllers/habitController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getHabits).post(protect, createHabit);
router.route("/:id/complete").put(protect, completeHabit);

module.exports = router;
