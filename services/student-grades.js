const fs = require('fs')

module.exports = {
  findStudentsGradeFile
}

function findStudentsGradeFile (studentId) {
  return new Promise((resolve, reject) => {
    fs.readdir('./grades', (err, files) => {
      if (err) return reject(Error('No grade files present'))

      const studentFile = files.find(file => {
        const fileName = file.split('.')[0]
        const [initial, limit] = fileName.split('-')
        if (Number(initial) <= studentId && studentId <= Number(limit)) return true
        return false
      })
      resolve(studentFile)
    })
  })
}
