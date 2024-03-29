const knex = require('./db')
const Student = require('./model/student')
const fetchgradeScript = require('./scripts/student-grades')
const { findStudentsGradeFile } = require('./services/student-grades')

const studentsGradesMock = require('./mocks/student-grades.mock.json')
const mockStats = require('./mocks/grades-stats.mocks.json')

const IS_TEST = process.env.NODE_ENV === 'test'

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getStudentGradeFromFile,
  getCourseGradesReport
}

// fetch large grade files
if (!IS_TEST) fetchgradeScript()

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const { id } = req.params
    const student = await Student.findStudent(Number(id))

    if (!student) return res.status(404).json({ message: `Student with id ${id} not found` })
    res.json(student)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

async function getStudentGradesReport (req, res, next) {
  const studentId = req.params.id
  const student = await Student.findStudent(studentId)

  const studentGradeFile = await findStudentsGradeFile(Number(studentId))
  const grades = getStudentGradeFromFile(studentGradeFile)
  student.grades = grades.filter(grade => grade.id === Number(studentId))
  res.json(student)
}

async function getCourseGradesReport (req, res, next) {
  const stats = getCourseStats()
  res.json(stats)
}

function getStudentGradeFromFile (fileName) {
  if (IS_TEST) return getStudentGradeTest()

  return require(`./grades/${fileName}`)
}

function getCourseStats () {
  if (IS_TEST) return mockStats

  return require('./grades/stats.json')
}

function getStudentGradeTest () {
  return studentsGradesMock
}
