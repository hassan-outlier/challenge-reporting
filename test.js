const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

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

tape('get student by ID', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}`
  try {
    const { data } = await jsonist.get(url)
    const expectedData = [
      {
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
    ]
    t.deepEqual(data.data, expectedData, 'should get student by ID')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student grades', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}/grades`
  try {
    const { data } = await jsonist.get(url)
    const expectedData = [
      { id: 1, course: 'Calculus', grade: 50 },
      { id: 1, course: 'Microeconomics', grade: 43 },
      { id: 1, course: 'Statistics', grade: 50 },
      { id: 1, course: 'Astronomy', grade: 63 }
    ]
    t.deepEqual(data.data, expectedData, 'should get student by ID')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get course statistics', async function (t) {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data } = await jsonist.get(url)
    const expectedData = {
      Calculus: {
        highestGrade: 100,
        lowestGrade: 0,
        averageGrade: 50.09270747689165
      },
      Microeconomics: {
        highestGrade: 100,
        lowestGrade: 0,
        averageGrade: 49.81138092966023
      },
      Statistics: {
        highestGrade: 100,
        lowestGrade: 0,
        averageGrade: 50.017376820961566
      },
      Astronomy: {
        highestGrade: 100,
        lowestGrade: 0,
        averageGrade: 50.03889013536759
      },
      Philosophy: {
        highestGrade: 100,
        lowestGrade: 0,
        averageGrade: 50.01606355689488
      }
    }
    t.deepEqual(data.data, expectedData, 'should get student by ID')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
