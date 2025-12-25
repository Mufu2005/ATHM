const asyncHandler = require("express-async-handler");
const Habit = require("../models/Habit");

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });
  res.status(200).json(habits);
});

const createHabit = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add a title");
  }

  const habit = await Habit.create({
    user: req.user.id,
    title: req.body.title,
  });

  res.status(201).json(habit);
});

const toggleHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (!habit.completedDates) {
    habit.completedDates = [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toISOString().split("T")[0];

  const index = habit.completedDates.findIndex(
    (date) => new Date(date).toISOString().split("T")[0] === todayStr
  );

  if (index !== -1) {
    habit.completedDates.splice(index, 1);
    if (habit.streak > 0) habit.streak -= 1;
  } else {
    habit.completedDates.push(today);
    habit.streak += 1;
  }

  await habit.save();
  res.status(200).json(habit);
});

const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await habit.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
};