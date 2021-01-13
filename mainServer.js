const express = require("express"); //middle wear

const app = express();
const bcrypt = require("bcrypt"); // encrypt passwords
const server = require("http").Server(app); //create server
const SQL = require("sqlite3").verbose(); // interface with db

const PORT = 8080;
let db = new SQL.Database("./database/database.db",function(err){
    if(err) return err;
    console.log("connected to Database")
}); 

app.use(express.static("views"));

//login standard
app.post("login", function () {

});

//signup as standard
app.post("signup", function () {
    
});





server.listen(PORT); // start server on {PORT}