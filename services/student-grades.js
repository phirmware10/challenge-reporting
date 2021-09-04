const https = require('https')
const { promisify } = require('util')
const httpsGetAsync = promisify(https.get)

module.exports = {
  getStudentGradeStream
}

function getStudentGradeStream () {
  const url = 'https://outlier-coding-test-data.netlify.app/grades.json'

  return httpsGetAsync(url)
}
