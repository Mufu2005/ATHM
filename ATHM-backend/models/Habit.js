const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a habit title'],
    },
    streak: {
      type: Number,
      default: 0,
    },
    completedDates: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);