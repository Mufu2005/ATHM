const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate(
      "subject",
      "name color"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, subject, dueDate, priority } = req.body;
  try {
    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      subject,
      dueDate,
      priority,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
