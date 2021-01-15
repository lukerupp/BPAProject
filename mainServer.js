const express = require("express"); //middle wear
const app = express();
const bcrypt = require("bcrypt"); // encrypt passwords
const server = require("http").Server(app); //create server
const SQL = require("sqlite3").verbose(); // interface with db
const sanitizer = require("./serverScripts/sanitizer.js");

app.use(express.urlencoded());
app.use(express.json());

const PORT = 8080;
function openDatabase(){ //opens a new database connection
    let dataBase = new SQL.Database("./database/database.db", function (err) {
        if (err) return err;
        console.log("connected to Database");
      });
    return dataBase;
}

app.use(express.static("views"));

//login standard
app.post("/login", function (req, res) {
  console.log("login request");
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  res.end();
});

//signup as standard
app.post("/signup", function (req, res) {
  console.log("signup request");
 // console.log(req.body);
  var firstName = sanitizer.sanitize(req.body.firstname);
  var lastName = sanitizer.sanitize( req.body.lastname);
  var email = sanitizer.sanitize(req.body.email);
  var password = req.body.password;
  res.end();





    //check if person exists already
     db = openDatabase();
    var SQL_find = `SELECT * FROM profiles WHERE email = '${email}'`; //expression to check if email is already in the data base
    db.all(SQL_find,[],function(err,results){if(err) throw err;
    console.log(results.length);
    if(results.length == 0 ){ //check if user exists
        var SQL_insert = `INSERT INTO profiles(first_name,last_name,email,password,is_admin)
        VALUES('${firstName}','${lastName}','${email}','${password}',0);`
        db.run(SQL_insert,[],function(err2){
            if (err2) throw err2;
        })
    }
 })

  
  db.close()
});






server.listen(PORT); // start server on {PORT}
