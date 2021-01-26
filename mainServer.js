const express = require("express"); //middle wear
const app = express();
const bcrypt = require("bcrypt"); // encrypt passwords
const saltRounds = 10; //how many times to salt password
const secureServer = require("https"); //create server
const server = require("http").createServer(app);
const fs = require("fs"); //read filesystem for HTTPS key and cert file
const SQL = require("sqlite3").verbose(); // interface with db
const sanitizer = require("./serverScripts/sanitizer.js"); //sanitize user inputs
const converter = require("./serverScripts/timeConverter.js");

  const options = {
    //make json for HTTPS files
    key: fs.readFileSync("key.pem", "utf-8"),
    cert: fs.readFileSync("cert.pem", "utf-8"),
  };


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
app.use(express.static("reservations"));

//login standard
app.post("/login", function (req, res) {
  console.log("login request");
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  var check = req.body.checkdata;
  console.log(check);

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
        if (check == "true") {
          res.send(name);
          res.end();
          return;
        }
        res.send("login successful");
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
  var passwordR = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g; //password requirements
  if (!password.match(passwordR)) {
    console.log(password)
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

app.get("/getRidesRestaurants", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  db = openDatabase();
  var SQL_Restaurants = "SELECT * FROM restaurantsTimes";
  var SQL_rides = "SELECT * FROM rideTimes";
  //return all restaurants
  db.all(SQL_Restaurants, [], function (err, response) {
    if (err) throw err;
    response.forEach(function (element) {
      var restaurant_string = `{"name":"${element.name}", "time":${element.time}, "type":"${element.type}"}`;
      res.write(String(restaurant_string));
    });
  });
  //return all rides
  db.all(SQL_rides, [], function (err, response) {
    if (err) throw err;
    response.forEach(function (element) {
      var ride_string = `{"name":"${element.name}", "time":${element.time}, "type":"${element.type}"}`;
      res.write(String(ride_string));
    });
    res.end();
  });
  db.close();
});
app.post("/makeReservations", function (req, res) {
  var name = req.body.name;
  var reservationName = req.body.resName
  var time = req.body.time;
  console.log(time)
  var SQL_getRes = `SELECT * FROM reservations WHERE guestName = "${name}"`
  var SQL_insertRes = `INSERT INTO reservations(guestName,rideRestaurantsName,time) VALUES("${name}","${reservationName}",${converter.timeConverter(time)})`
  db = openDatabase();
  db.all(SQL_getRes,[],function(err,response){
    if(err) throw err;
    if(response.length==0){ //add reservations - no reservations found
      db.run(SQL_insertRes,[],function(err2){
        if(err2) throw(err2);
      })
      res.send("reservations made")
      return;  
    }
    //check time
    var conflict = false;
    for(var i = 0; i<=response.length-1;i++){
      var responseTime = response[i].time
      var newTime = converter.timeConverter(time)
      console.log(`${responseTime}, ${newTime}`)
      if(Math.abs(responseTime-newTime) <.5){
        conflict = true;
      }
    }
     if(!conflict){ //if time is at least 30 mins before or after already scheduled times
      res.send("reservation made")
      db.run(SQL_insertRes,[],function(err2){
        if(err2) throw(err2);
      })
    }
    else{
      res.send("reservation not made")
    }
  })
  console.log('---------------')
});
try {
  var httpsServer = secureServer.createServer(options, app); // start server on {PORT}
  httpsServer.listen(PORT);
} catch (error) {}

server.listen(8080);
