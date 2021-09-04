const knex = require('./db')
const https = require('https')
const jsonStream = require('JSONStream')
const { Transform } = require('stream')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

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
    const [student] = await knex('students').where('id', id)
    res.json(student)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'something went wrong' })
  }
}

async function getStudentGradesReport (req, response, next) {
  const studentId = req.params.id
  const url = 'https://outlier-coding-test-data.netlify.app/grades.json'
  const studentGrade = []

  const [student] = await knex('students').where('id', studentId)
  https.get(url, (res) => {
    res.pipe(jsonStream.parse('*'))
      .pipe(new Transform({
        objectMode: true,
        transform (chunck, enc, cb) {
          if (chunck.id !== Number(studentId)) return cb()
          studentGrade.push(chunck)
          cb()
        }
      }))
      .on('finish', () => {
        student.grades = studentGrade
        response.json(student)
      })
      .on('error', (err) => {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
      })
  })
}

async function getCourseGradesReport (req, res, next) {
  const coursetrack = []
  const courseStats = {}
  const url = 'https://outlier-coding-test-data.netlify.app/grades.json'
  https.get(url, (res) => {
    res.pipe(jsonStream.parse('*'))
      .pipe(new Transform({
        objectMode: true,
        transform (chunck, enc, cb) {
          if (!coursetrack.includes(chunck.course)) coursetrack.push(chunck.course)
          const currentStats = courseStats[chunck.course]
          const obj = {
            lowestgrade: chunck.grade,
            highestGrade: chunck.grade,
            count: currentStats.count++,
            total: currentStats.total + chunck.grade
          }
          obj.average = obj.total / obj.count
          courseStats[chunck.course] = obj
          cb()
        }
      }))
      .on('finish', () => {
        student.grades = studentGrade
        response.json(student)
      })
      .on('error', (err) => {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
      })
  })
}
