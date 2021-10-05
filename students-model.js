const knex = require('./db')

module.exports = { getStudentByID }

async function getStudentByID (studentId) {
  try {
    return knex('students')
      .select('*')
      .where({ id: studentId })
  } catch (error) {
    throw new Error('Error: ', error)
  }
}
