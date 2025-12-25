const asyncHandler = require("express-async-handler");
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const Task = require("../models/Task");

const getClassrooms = asyncHandler(async (req, res) => {
  let classrooms;
  if (req.user.role === "teacher") {
    classrooms = await Classroom.find({ teacher: req.user.id })
      .populate("teacher", "name email")
      .populate("students", "name email");
  } else {
    classrooms = await Classroom.find({ students: req.user.id }).populate(
      "teacher",
      "name email"
    );
  }
  res.status(200).json(classrooms);
});

const createClassroom = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Only teachers can create classrooms");
  }

  const { name, subject } = req.body;

  if (!name || !subject) {
    res.status(400);
    throw new Error("Please add name and subject");
  }

  const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const classroom = await Classroom.create({
    teacher: req.user.id,
    name,
    subject,
    classCode,
  });

  res.status(201).json(classroom);
});

const joinClassroom = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const classroom = await Classroom.findOne({ classCode: code });

  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  if (classroom.students.includes(req.user.id)) {
    res.status(400);
    throw new Error("You are already in this class");
  }

  classroom.students.push(req.user.id);
  await classroom.save();

  res.status(200).json(classroom);
});

const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id)
    .populate("teacher", "name email")
    .populate("students", "name email");

  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  let needsSave = false;
  if (!classroom.classCode) {
    classroom.classCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    needsSave = true;
  }
  if (!classroom.subject) {
    classroom.subject = "General";
    needsSave = true;
  }

  if (needsSave) {
    await classroom.save();
  }

  res.status(200).json(classroom);
});

const removeStudent = asyncHandler(async (req, res) => {
  const { id, studentId } = req.params;

  const classroom = await Classroom.findById(id);

  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  if (classroom.teacher.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to remove students");
  }

  classroom.students = classroom.students.filter(
    (student) => student.toString() !== studentId
  );

  await classroom.save();

  res.status(200).json(classroom);
});

const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  if (classroom.teacher.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Task.deleteMany({ classroom: req.params.id });
  await classroom.deleteOne();

  res.status(200).json({ id: req.params.id });
});

const leaveClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  classroom.students = classroom.students.filter(
    (studentId) => studentId.toString() !== req.user.id
  );

  await classroom.save();

  res.status(200).json({ message: "Left classroom successfully" });
});

module.exports = {
  getClassrooms,
  createClassroom,
  joinClassroom,
  getClassroomById,
  removeStudent,
  deleteClassroom,
  leaveClassroom,
};