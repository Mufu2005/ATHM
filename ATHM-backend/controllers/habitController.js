const Habit = require("../models/Habit");

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHabit = async (req, res) => {
  const { title } = req.body;
  try {
    const habit = await Habit.create({ user: req.user.id, title });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      habit.lastCompletedDate &&
      new Date(habit.lastCompletedDate).setHours(0, 0, 0, 0) === today.getTime()
    ) {
      return res.status(400).json({ message: "Habit already completed today" });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      habit.lastCompletedDate &&
      new Date(habit.lastCompletedDate).setHours(0, 0, 0, 0) ===
        yesterday.getTime()
    ) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }

    habit.lastCompletedDate = new Date();
    habit.history.push(new Date());

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHabits, createHabit, completeHabit };
