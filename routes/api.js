var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Admin = require('../models/admin');
var Building = require('../models/building');
var Class = require('../models/class');
var Classroom = require('../models/classroom');
var Course = require('../models/course');
var Department = require('../models/department');
var Faculty = require('../models/faculty');
var Lab = require('../models/lab');
var Period = require('../models/period');
var Student = require('../models/student');
var Timetable = require('../models/timetable');
var TimetableStructure = require('../models/timetableStructure');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get("/faculty", function(req,res){
    Faculty.find({}, function(err, faculties){
        if(err) {
          console.log(err);
        } else {
          return res.send(faculties);
        }
      });
});

router.post("/faculty", function(req,res){
    Faculty.find({}, function(err, faculties){
        if(err) {
          console.log(err);
        } else {
          return res.send(faculties);
        }
      });
});

router.get("/course", function(req,res){
    Course.find({}, function(err, courses){
      if(err)
        console.log(err);
      else 
        return res.send(courses);
    })
  });

router.post("/course", function(req,res){
  Course.find({}, function(err, courses){
    if(err)
      console.log(err);
    else 
      return res.send(courses);
  })
});

router.get("/department", function(req,res){
    Department.find({}, function(err, departments){
      if(err)
        console.log(err);
      else 
        return res.send(departments);
    })
  });

router.post("/department", function(req,res){
  Department.find({}, function(err, departments){
    if(err)
      console.log(err);
    else 
      return res.send(departments);
  })
});

router.get("/building", function(req,res){
    Building.find({}, function(err, buildings){
      if(err)
        console.log(err);
      else
        return res.send(buildings);
    });
  });

router.post("/building", function(req,res){
  Building.find({}, function(err, buildings){
    if(err)
      console.log(err);
    else
      return res.send(buildings);
  });
});

module.exports = router;