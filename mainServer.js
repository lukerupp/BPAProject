const express = require("express"); //middle wear
const app = express();
const bcrypt = require("bcrypt"); // encrypt passwords
const saltRounds = 10; //how many times to salt password
const secureServer = require("https"); //create server
const server = require("http").createServer(app);
const fs = require("fs"); //read filesystem for HTTPS key and cert file
const SQL = require("sqlite3").verbose(); // interface with db
const sanitizer = require("./serverScripts/sanitizer.js"); //sanitize user inputs

try {
  const options = {
    //make json for HTTPS files
    key: fs.readFileSync("key.pem", "utf-8"),
    cert: fs.readFileSync("cert.pem", "utf-8"),
  };
} catch (error) {}

app.use(express.urlencoded());
app.use(express.json());

const PORT = 443;
function openDatabase() {
  //opens a new database connection
  let dataBase = new SQL.Database("./database/database.db", function (err) {
    if (err) return err;
    console.log("connected to Database");
  });
  return dataBase;
}

app.use(express.static("home")); //send initial html to client
app.use(express.static("login"));
app.use(express.static("reusables"));
app.use(express.static("admin"));

//login standard
app.post("/login", function (req, res) {
  console.log("login request");
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  var check = req.body.checkdata;
  console.log(check)

  var db = openDatabase();
  var SQL_find = `SELECT * FROM profiles WHERE email = '${email}'`;
  db.all(SQL_find, [], function (err, results) {
    if (results.length == 0) {
      res.send("login unsuccessful");
      res.end();
      return;
    }
    var hash = results[0].password;
    var name = results[0].first_name;
    if (err) throw err;
    bcrypt.compare(password, hash).then(function (result) {
      if (result) {
        if(check == 'true'){
            console.log('sening name')
            res.send(name);
            res.end();
            return;
        }
        res.send('login successful');
        res.end();
      } else {
        res.send("login unsuccessful");
        res.end();
      }
    });
  });
});

//signup as standard
app.post("/signup", function (req, res) {
  console.log("signup request");
  // console.log(req.body);
  var firstName = sanitizer.sanitize(req.body.firstname);
  var lastName = sanitizer.sanitize(req.body.lastname);
  var email = sanitizer.sanitize(req.body.email);
  var password = req.body.password;
  //check if password meets standards
  var passwordR = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}"; //password requirements
  if (!password.match(passwordR)) {
    res.send("illegal password");
    res.end();
    return;
  }
  //check if person exists already
  db = openDatabase();
  var SQL_find = `SELECT * FROM profiles WHERE email = '${email}'`; //expression to check if email is already in the data base
  db.all(SQL_find, [], function (err, results) {
    if (err) throw err;
    console.log(results.length);
    if (results.length == 0) {
      //add user to database
      res.send("User registered");
      res.end();
      bcrypt.hash(password, saltRounds).then(function (hash) {
        console.log("done hashing password");
        var SQL_insert = `INSERT INTO profiles(first_name,last_name,email,password,is_admin) VALUES('${firstName}','${lastName}','${email}','${hash}',0);`;
        db.run(SQL_insert, [], function (err2) {
          if (err2) throw err2;
        });
        db.close();
      });
    } else {
      res.send("user already exists");
      res.end();
      db.close();
    }
  });
});


try {
  var httpsServer = secureServer.createServer(options, app); // start server on {PORT}
  httpsServer.listen(PORT);
} catch (error) {}

server.listen(8080);
