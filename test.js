const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const StudentModel = require('./model/student')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('should fetch student by id', async function (t) {
  const studentId = 1
  const expectedStudent = {
    id: 1,
    first_name: 'Scotty',
    last_name: 'Quigley',
    email: 'Scotty79@hotmail.com',
    is_registered: 1,
    is_approved: 1,
    password_hash: '657907e1fd8e48e2be2aa59031ff8e0f0ecf8694',
    address: '241 Denesik Knolls Apt. 955',
    city: 'Buffalo',
    state: 'ME',
    zip: '04710',
    phone: '1-503-560-6954',
    created: '1628767983203.0',
    last_login: '1628770445749.0',
    ip_address: '2.137.18.155'
  }

  const actual = await StudentModel.findStudent(studentId)
  t.deepEqual(actual, expectedStudent, 'should be the same')
  t.end()
})

tape('return null if no id is passed to StudentModel.findStudent', async function (t) {
  const result = await StudentModel.findStudent()

  t.equal(result, null, 'should be null')
  t.end()
})

tape('handle invalid student id', async function (t) {
  const studentId = 5
  const result = await StudentModel.findStudent(studentId)

  t.equal(result, undefined)
  t.end()
})

tape('should call the get student endpoint correctly', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}`

  const expectedStudent = {
    id: 1,
    first_name: 'Scotty',
    last_name: 'Quigley',
    email: 'Scotty79@hotmail.com',
    is_registered: 1,
    is_approved: 1,
    password_hash: '657907e1fd8e48e2be2aa59031ff8e0f0ecf8694',
    address: '241 Denesik Knolls Apt. 955',
    city: 'Buffalo',
    state: 'ME',
    zip: '04710',
    phone: '1-503-560-6954',
    created: '1628767983203.0',
    last_login: '1628770445749.0',
    ip_address: '2.137.18.155'
  }
  const { data } = await jsonist.get(url)
  t.deepEqual(data, expectedStudent)
  t.end()
})

tape('invalid id with get student endpoint should be handled correctly', async function (t) {
  const studentId = 5
  const url = `${endpoint}/student/${studentId}`
  const expected = { message: `Student with id ${studentId} not found` }

  const { data, response } = await jsonist.get(url)
  t.deepEqual(data, expected, 'should handle when student not found')
  t.equal(response.statusCode, 404, 'should return correct status code')
  t.end()
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
