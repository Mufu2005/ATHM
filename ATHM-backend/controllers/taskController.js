const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Classroom = require("../models/Classroom");

const getTasks = asyncHandler(async (req, res) => {
  // 1. Fetch Personal Tasks
  const personalTasks = await Task.find({ user: req.user.id }).populate(
    "subject"
  );

  // 2. Fetch Assignments
  const enrolledClassrooms = await Classroom.find({ students: req.user.id });
  const classroomIds = enrolledClassrooms.map((c) => c._id);

  const assignments = await Task.find({
    classroom: { $in: classroomIds },
    type: "assignment",
  })
    .populate("subject")
    .populate("classroom", "name");

  // 3. Merge and Sort
  const allTasks = [...personalTasks, ...assignments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json(allTasks);
});

const createTask = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add a title");
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    subject: req.body.subject || null,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    user: req.user.id,
    type: req.body.type || "personal",
    classroom: req.body.classroomId || null,
  });

  await task.populate("subject");
  
  if (task.classroom) {
    await task.populate("classroom", "name");
  }

  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate("subject")
    .populate("classroom", "name");

  res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});

const getTasksByClassroom = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ classroom: req.params.classroomId })
    .sort({ createdAt: -1 })
    .populate("completedBy", "name email")
    .populate("subject")
    .populate("classroom", "name");

  res.status(200).json(tasks);
});

const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("subject")
    .populate("classroom", "name");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.type === "personal") {
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }
    task.status = task.status === "Completed" ? "Pending" : "Completed";
    await task.save();
    return res.json(task);
  }

  if (task.type === "assignment") {
    const index = task.completedBy.indexOf(req.user.id);

    if (index === -1) {
      task.completedBy.push(req.user.id);
    } else {
      task.completedBy.splice(index, 1);
    }

    await task.save();
    return res.json(task);
  }
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByClassroom,
  toggleTaskCompletion,
};