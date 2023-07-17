var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var db=require('./database'); //path of database.js
 
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({ 
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
app.use(flash());

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Register' });
  });
//create api to insert data in students table of school database

app.post('/insert',function(req,res){
    const name = req.body.name;
    const marks = req.body.marks;
    console.log(name);
    console.log(marks)
    var sql = `INSERT INTO students (name, marks) VALUES ("${name}", "${marks}")`;

    db.query(sql, function(err, result) {
     if(!err){
      console.log("Record Inserted");
    //   res.send("Student Registered.");
      res.redirect('/show'); // Redirect to /show route after successful insertion
     }else{
      console.error(`Error inserting record ${err}`);
      res.send(`Please try again, we are getting error ${err}`);
     }
    });
})


app.get('/show',function(req,res){

    var sql = `Select *from students`;

    db.query(sql, function(err, result) {
     if(!err){
    //    res.send(result);
       res.render('show', { students: result }); 
     }else{
      console.error(`Error inserting record ${err}`);
      res.send(`Please try again, we are getting error ${err}`);
     }
    });
})


// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;

