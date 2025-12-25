const mongoose = require('mongoose');

const classroomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a classroom name'],
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    day: String,
    time: String,
    room: String,

    classCode: {
        type: String,
        required: false 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Classroom', classroomSchema);