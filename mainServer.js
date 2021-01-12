const express = require('express')
const app = express()
const server = require('http').Server(app)
const SQL  = require('sqlite3')

const PORT = 8080;

app.use(express.static('views'))
server.listen(PORT)
