const knex = require('./db')
const _ = require('lodash')

const grades = require('./grades.json')

module.exports = { getStudentByID, getStudentGrades, getCourseGradesStats }

async function getStudentByID (studentId) {
  try {
    return knex('students')
      .select('*')
      .where({ id: studentId })
  } catch (error) {
    throw new Error('Error: ', error.message)
  }
}

function getStudentGrades (studentId) {
  try {
    const student = getStudentByID(studentId)
    if (!student) throw new Error('Student is not found')
    const studentGrades = grades.filter(grade => grade.id.toString() === studentId)
    return studentGrades.map(grade => ({ ...student, ...grade }))
  } catch (error) {
    throw new Error('Error getting grades: ', error.message)
  }
}

function getCourseGradesStats () {
  const courses = _.uniq(grades.map(grade => grade.course))
  const courseStats = {}
  courses.forEach(course => {
    courseStats[course] = {}
    const courseGrades = grades
      .filter(grade => grade.course === course)
      .map(grade => grade.grade)
    courseStats[course].highestGrade = _.max(courseGrades)
    courseStats[course].lowestGrade = _.min(courseGrades)
    courseStats[course].averageGrade =
      courseGrades.reduce((sum, grade) => sum + grade, 0) / courseGrades.length
  })
  return courseStats
}
