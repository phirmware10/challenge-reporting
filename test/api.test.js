const tape = require('tape')
const sinon = require('sinon')

const api = require('../api')

tape('getStudent should return student with correct Id', async function (t) {
  const req = { params: { id: '1' } }
  const res = {
    json: sinon.fake()
  }
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

  await api.getStudent(req, res)
  t.equal(res.json.called, true)
  t.equal(res.json.calledWith(expectedStudent), true)
  t.end()
})

tape('getStudent should return 404 if student is not found', async function (t) {
  const req = { params: { id: '100' } }
  const res = {
    json: sinon.fake()
  }
  const expectedResponse = { message: `Student with id ${req.params.id} not found` }
  res.status = sinon.fake.returns(res)
  await api.getStudent(req, res)

  t.equal(res.status.calledWith(404), true)
  t.equal(res.json.calledWith(expectedResponse), true)
  t.end()
})

tape('getStudentGradesReport should return students data and grade report', async function (t) {
  const req = { params: { id: '1' } }
  const res = { json: sinon.fake() }
  const expected = {
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
    ip_address: '2.137.18.155',
    grades: [
      { id: 1, course: 'Microeconomics', grade: 43 },
      { id: 1, course: 'Statistics', grade: 50 },
      { id: 1, course: 'Astronomy', grade: 63 }
    ]
  }

  await api.getStudentGradesReport(req, res)

  t.equal(res.json.calledWith(expected), true)
  t.end()
})

tape('getCourseGradesReport should return correct stats', async function (t) {
  const req = sinon.fake()
  const res = {
    json: sinon.fake()
  }

  const expected = {
    minimumGrade: 0,
    maxmimumGrade: 100,
    average: 49
  }

  api.getCourseGradesReport(req, res)

  t.equal(res.json.calledWith(expected), true)
  t.end()
})
