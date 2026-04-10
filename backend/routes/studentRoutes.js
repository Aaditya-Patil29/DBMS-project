const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentCount,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

router.route('/').get(getStudents).post(addStudent);
router.route('/count').get(getStudentCount);
router.route('/:id').put(updateStudent).delete(deleteStudent);

module.exports = router;
