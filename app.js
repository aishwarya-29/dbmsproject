var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');

var indexRouter  = require('./routes/index');
var usersRouter  = require('./routes/users');
var adminRouter  = require('./routes/admin');
var apiRouter    = require('./routes/api');
var updateRouter = require('./routes/update');
var deleteRouter = require('./routes/delete');

var Admin = require('./models/admin');
var Building = require('./models/building');
var Class = require('./models/class');
var Classroom = require('./models/classroom');
var Course = require('./models/course');
var Department = require('./models/department');
var Faculty = require('./models/faculty');
var Lab = require('./models/lab');
var Slot = require('./models/slot');
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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: config.SECRET_KEY,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local');
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
  ));

passport.use("localstudent", new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    Student.findOne({email: email}, function(err, user){
      if(err)
        done(err);
      if(!user) {
        done(err);
      } else {
      Student.comparePassword(password, user.password, function(err, isMatch){
        if(err) {
          done(err);
        } 
        if(isMatch) {
            done(null,user);
        } else {
            done(null, false);
        }
      }); }
    }); 
  }
));

passport.use("localfaculty", new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    Faculty.findOne({emailID: email}, function(err, user){
      if(err)
        done(err);
        if(!user) {
          done(err);
        } else {
      Faculty.comparePassword(password, user.password, function(err, isMatch){
        if(err) {
          done(err);
        } 
        if(isMatch) {
            done(null,user);
        } else {
            done(null, false);
        }
      }); }
    })
  }
));

passport.serializeUser(function(user,done){
  done(null,user);
});
passport.deserializeUser(function(user,done){
  if(user != null)
    done(null,user);
});


app.use(function (req, res, next) {
  if(req.user) {
    if(req.user.name)
      res.locals.username = req.user.name;
    else
      res.locals.username = req.user.fullName;
  }
  else
    res.locals.username = null;
  next();
});

app.use(function (req,res,next){
  if(req.user)
    res.locals.user = req.user;
  else 
    res.locals.user = null;
  next();
});

var mongoURI = config.MONGO_URI;
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => {
  console.log('DB Connected!');
})
.catch(err => {
console.log(err);
});
var conn = mongoose.connection;

app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);
app.use('/api', apiRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);

app.get("/view", function(req,res){
  if(req.user ){
    if(req.user.id) {
      res.redirect("/users/view");
    } 
    else if(req.user.fullName) {
      res.redirect("/users/view");
    }
    else {
      res.redirect("/users");
    }
  } else{
    res.redirect("/users");
  }
  
});


app.get("/profile", function(req,res){
  if(req.user) {
  if(req.user.rollNumber) {
    res.redirect("/users/user-profile");
  } else if(req.user.fullName) {
    res.redirect("/users/faculty-profile");
  } else {
    res.redirect("/admin/profile");
  }} else {
    res.redirect("/users");
  }
});

app.post("/form", function(req,res){
  console.log(req.body);
});

var student = new Student({
  rollNumber: '18304',
  fullName: 'Aishwarya',
  email: 'aishwaryababu1212@gmail.com',
  password: 'password'
});

// Student.createUser(student, function(err, newStud){
//   if(err)
//     console.log(err);
//   else 
//     console.log(newStud);
// });

var admin = new Admin({
  name: "Albus Dumbledore",
  email: "admin@hogwarts.edu",
  password: "ilovehp"
});

var admin2 = new Admin({
  name: "Aishu",
  email: "test@hogwarts.edu",
  password: "password",
  detailsFilled: false
})

// Faculty.findOne({id: 'f002'}, function(err, fac){
//   if(err)
//     console.log(err);
//   else {
//     fac.password = "password";
//     Faculty.savePassword(fac, function(err, fac2){
//       if(err)
//         console.log(err);
//       else {
//         console.log(fac2);
//       }
//     });
//   }
// });

module.exports = app;
