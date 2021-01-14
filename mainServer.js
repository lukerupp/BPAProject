const express = require("express"); //middle wear
const app = express();
const bcrypt = require("bcrypt"); // encrypt passwords
const server = require("http").Server(app); //create server
const SQL = require("sqlite3").verbose(); // interface with db

app.use(express.urlencoded());
app.use(express.json());

const PORT = 8080;
let db = new SQL.Database("./database/database.db",function(err){
    if(err) return err;
    console.log("connected to Database")
}); 

app.use(express.static("views"));

//login standard
app.post("/login", function (req,res) {
    console.log("login request")
    console.log(req.body)
});

//signup as standard
app.post("/signup", function (req,res) {
    console.log("signup request")
    console.log(req.body);
});





server.listen(PORT); // start server on {PORT}