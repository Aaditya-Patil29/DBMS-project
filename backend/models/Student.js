const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    feesStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    status: {
      type: String,
      required: true,
      enum: ['IN', 'OUT'],
      default: 'IN',
    }
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
