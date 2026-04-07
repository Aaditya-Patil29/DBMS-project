const Log = require('../models/Log');
const Student = require('../models/Student');

const createLog = async (req, res) => {
  const { studentId, actionType } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.status === actionType) {
      return res.status(400).json({ message: `Student is already marked as ${actionType}` });
    }

    const log = await Log.create({
      student: studentId,
      actionType,
    });

    student.status = actionType;
    await student.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({})
      .populate('student', 'name roomNumber')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLog,
  getLogs,
};
