const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

// init sqlite db
const dbFile = '/data/sqlite.db'
const exists = fs.existsSync(dbFile)
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(dbFile)

// if /data/sqlite.db does not exist, create it
db.serialize(() => {
  if (!exists) {
    db.run(
      'CREATE TABLE response (id INTEGER PRIMARY KEY AUTOINCREMENT, responded INT)'
    )
    console.log('New table response created!')
  } else {
    console.log('Database "response" ready to go!')
  }
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`)
})

// endpoint to add a dream to the database
app.post('/respond', (req, res) => {
  console.log(`add response ${!!req.body.response}`)

  db.run('INSERT INTO response (responded) VALUES (?)', +!!req.body.response, error => {
    if (error) {
      console.log(error)
      res.status(500).send({ message: 'error!' })
    } else {
      console.log('ok')
      res.status(200).send({ message: 'success' })
    }
  })
})

app.get('/summary', (req, res) => {
  console.log('get summary')
  db.get('SELECT COUNT(*) FROM response;', (err, row) => {
    console.log(err)
    if (err) return res.status(500).send()
    const all = row['COUNT(*)']
    db.get('SELECT COUNT(*) FROM response WHERE responded = 0;', (err, yRow) => {
      console.log(err)
      if (err) return res.status(500).send()
      const yes = yRow['COUNT(*)']
      console.log({ yes: yes, no: all - yes, total: all })
      res.status(200).json({ yes: yes, no: all - yes, total: all })
    })
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
