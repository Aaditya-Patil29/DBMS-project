const Student = require('../models/Student');


const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addStudent = async (req, res) => {
  const { name, email, roomNumber, feesStatus } = req.body;

  try {
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = await Student.create({
      name,
      email,
      roomNumber,
      feesStatus,
      status: 'IN'
    });

    if (student) {
      res.status(201).json(student);
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.deleteOne({ _id: student._id });
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentCount,
  addStudent,
  deleteStudent,
};
