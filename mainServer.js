const express = require('express')
const app = express()
const server = require('http').Server(app)
const SQL = require('sqlite3').verbose();

let db = new SQL.Database('./database/database.db');
const PORT = 8080;

app.use(express.static('views'))
server.listen(PORT)

//login standard
app.post('login', function() {

})

//
//signup as standard
app.post('signup', function() {

})