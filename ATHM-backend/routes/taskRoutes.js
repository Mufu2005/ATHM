const express = require("express");
const { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTasksByClassroom,
  toggleTaskCompletion 
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, createTask);

router.get("/classroom/:classroomId", protect, getTasksByClassroom);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

router.patch("/:id/toggle", protect, toggleTaskCompletion);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;