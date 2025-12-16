const Subject = require("../models/Subject");

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  const { name, color } = req.body;
  try {
    const subject = await Subject.create({
      user: req.user.id,
      name,
      color,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject || subject.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.deleteOne();
    res.json({ message: "Subject removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubjects, createSubject, deleteSubject };
