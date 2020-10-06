var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var Admin = require('./models/admin');
var Building = require('./models/building');
var Class = require('./models/class');
var Classroom = require('./models/classroom');
var Course = require('./models/course');
var Department = require('./models/department');
var Faculty = require('./models/faculty');
var Lab = require('./models/lab');
var Period = require('./models/period');
var Student = require('./models/student');
var Timetable = require('./models/timetable');
var TimetableStructure = require('./models/timetableStructure');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
  secret: config.SECRET_KEY,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local');
passport.serializeUser(function(user,done){
    done(null,user._id);
});
passport.deserializeUser(async (id,done) => {
  const user = await Admin.findById(id);
  done(null, user)
})
passport.use("local", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    function(email,password,done) {
      Admin.findOne({email:email}, function(err,user){
        if(err)
          done(err);
        Admin.comparePassword(password,user.password,function(err, isMatch){
          if(err) {
              done(err);
          }
          if(isMatch) {
              done(null,user);
          } else {
              done(null, false);
          }
      });
      });
    }
  ))

app.use(function (req, res, next) {
  if(req.user) 
    res.locals.username = req.user.name;
  else
    res.locals.username = null;
  next();
});

var mongoURI = config.MONGO_URI;
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(err);
});
var conn = mongoose.connection;

app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);


app.get("/view", function(req,res){
  res.render("view/index");
});

app.post("/login", function(req,res){
  res.redirect("/view");
});

app.post("/api/faculty", function(req,res){
  Faculty.find({}, function(err, faculties){
    if(err) {
      console.log(err);
    } else {
      return res.send(faculties);
    }
  });
});

app.post("/api/course", function(req,res){
  Course.find({}, function(err, courses){
    if(err)
      console.log(err);
    else 
      return res.send(courses);
  })
});

app.post("/api/department", function(req,res){
  Department.find({}, function(err, departments){
    if(err)
      console.log(err);
    else 
      return res.send(departments);
  })
});

app.post("/api/building", function(req,res){
  Building.find({}, function(err, buildings){
    if(err)
      console.log(err);
    else
      return res.send(buildings);
  });
});

var newAdmin = new Admin({
  name: "Albus Dumbledore",
  email: "admin@hogwarts.edu",
  password: "ilovehp"
});


module.exports = app;
