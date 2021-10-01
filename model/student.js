const knex = require('../db')
const studentMocks = require('../mocks/student.mocks.json')

const IS_TEST = process.env.NODE_ENV === 'test'

module.exports = { findStudent }

async function findStudent (id) {
  if (!id) return null

  if (IS_TEST) return findStudentTest(id)

  const [student] = await knex('students').where('id', id)
  return student
}

function findStudentTest (id) {
  if (!id) return null

  id = typeof id === 'number' ? id : Number(id)
  const student = studentMocks.find(student => student.id === id)

  // avoid mutation
  return student ? { ...student } : undefined
}
