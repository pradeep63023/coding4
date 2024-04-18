const express = require('express')

const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
let db = null
const dbpath = path.join(__dirname, 'cricketTeam.db')
const app = express()
app.use(express.json())
const instalisation = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
instalisation()

const convertDbObject = dbObject => {
  return {
    palyerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const a = `SELECT * FROM cricket_team;`
  const b = await db.all(a)
  response.send(b.map(i => convertDbObject(i)))
})

app.post('/players/', async (request, response) => {
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  const api2 = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES ("${playerName}",${jerseyNumber},"${role}");`
  const b = await db.run(api2)
  response.send('player Added to team')
})
app.get('/players/:playersId/', async (request, response) => {
  const {playerId} = request.params
  const getquery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`
  const player = await db.get(getquery)
  response.send(convertDbObject(player))
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  const api4 = `UPDATE 
    cricket_team 
  SET 
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}',
    role = '${role}'
  WHERE 
    player_id = ${playerId};`
  await db.run(api4)
  response.send('player Details Updated')
})
app.delete('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const api5 = `DELETE FROM cricket_team WHERE player_id = ${playerId};`
  await db.run(api5)
  response.send('player Removed')
})
module.exports = app
