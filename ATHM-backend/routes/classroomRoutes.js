const express = require("express");
const router = express.Router();
const {
  getClassrooms,
  createClassroom,
  joinClassroom,
  getClassroomById,
  removeStudent,
  deleteClassroom,
  leaveClassroom,
} = require("../controllers/classroomController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getClassrooms)
  .post(protect, createClassroom);

router.post("/join", protect, joinClassroom);

router
  .route("/:id")
  .get(protect, getClassroomById)
  .delete(protect, deleteClassroom);

router.post("/:id/leave", protect, leaveClassroom);

router.delete("/:id/students/:studentId", protect, removeStudent);

module.exports = router;