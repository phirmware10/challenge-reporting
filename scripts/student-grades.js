const https = require('https')
const fs = require('fs')

const jsonStream = require('JSONStream')

module.exports = fetchStudentGrades

function fetchStudentGrades () {
  let initial = 0
  let limit = 0

  let totalGrade = 0
  let numberOfGrades = 0

  let maxGrade = 0
  let minGrade = 100

  const url = 'https://outlier-coding-test-data.netlify.app/grades.json'

  https.get(url, response => {
    let ws
    const stream = response.pipe(jsonStream.parse('*'))
    stream.on('data', grade => {
      minGrade = checkMin(minGrade, grade)
      maxGrade = checkMax(maxGrade, grade)
      totalGrade = getCurrentTotal(totalGrade, grade)
      numberOfGrades = numberOfGrades + 1

      if (grade.id <= limit) {
        if (ws) ws.write(',' + '\n' + JSON.stringify(grade))
      }
      if (grade.id > limit) {
        initial = incrementInitial(limit)
        limit = incrementLimit(limit)
        if (ws) ws.write(']')
        ws = createGradesFile(initial, limit)
        if (ws) ws.write(JSON.stringify(grade))
      }
    })

    stream.on('end', () => {
      const average = Math.floor(totalGrade / numberOfGrades)
      const stats = {
        minimumGrade: minGrade,
        maxmimumGrade: maxGrade,
        average
      }
      fs.writeFile('./grades/stats.json', JSON.stringify(stats), err => {
        if (err) throw Error(err)
      })
    })
  })
}

function incrementLimit (limit) {
  const newLimit = limit + 5000
  return newLimit
}

function incrementInitial (limit) {
  const newInitial = limit + 1
  return newInitial
}

function checkMin (minGrade, grade) {
  return minGrade < grade.grade ? minGrade : grade.grade
}

function getCurrentTotal (totalGrade, grade) {
  return totalGrade + grade.grade
}

function checkMax (maxGrade, grade) {
  return maxGrade > grade.grade ? maxGrade : grade.grade
}

function createGradesFile (initial, limit) {
  const fileName = `./grades/${initial}-${limit}.grades.json`
  const ws = fs.createWriteStream(fileName, { flags: 'a' })
  ws.write('[')
  return ws
}
