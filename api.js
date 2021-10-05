const knex = require('./db')

const Student = require('./students-model')

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
    const student = await Student.getStudentByID(id)
    return res.json({ success: true, data: student })
  } catch (error) {
    throw new Error('Error getting student record: ', error)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const { id } = req.params
    const data = await Student.getStudentGrades(id)
    return res.json({ success: true, data })
  } catch (error) {
    throw new Error('Error: ', error.message)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    const data = Student.getCourseGradesStats()
    return res.json({ success: true, data })
  } catch (error) {
    throw new Error('Error: ', error.message)
  }
}
