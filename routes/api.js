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
var Slot = require('../models/slot');
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

router.post("/student", function(req,res){
  var students= req.body;
  for(var i=0;i<students.length;i++)
 {
   var rno= students[i].rollnumber;
   var name= students[i].fullName;
   var class_id= students[i].Class_id;
   var email= students[i].email;
   var password= students[i].password;
   Class.findOne({name: class_id},function(error,cls){
     if(error)
     {
       console.log(error);
     }
     else{
        var student = new Student({
        rollNumber:rno, fullName:fname, class: cls, email:email, password:pwd
        });
        Student.createUser(student,function(error,newstd){
          if(error)
          {
            console.log(error);
          }
          else{
            console.log(newstd);
          }
        })
     }
   })
 }
})
router.get("/classTT", function(req,res){
  var tt = [];
  var classID = req.query.id;
  Class.findOne({name: classID}).exec().then(cls => {
    Timetable.findOne({classID: cls}).populate('slots').then(clsTT =>{
            clsTT.slots.forEach(slot => {
                var ttinstance = {};
                ttinstance.day = slot.day;
                ttinstance.slot = slot.slot;
                ttinstance.faculty = slot.faculty;
                ttinstance.course = slot.course;
                tt.push(ttinstance);
            });
    }).then(x => {
        var timetable = [];
        var numOfDays, hours;
        TimetableStructure.findOne({}).then(ttstructure => {
            numOfDays = ttstructure.daysInWeek;
            hours = ttstructure.hoursInDay;
        }).then(ttstructure => {
            for(var i=0; i<numOfDays; i++) {
                timetable.push([]);
                for(var j=0; j<hours; j++) {
                    timetable[i].push({});
                }
            }
            var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            tt.forEach(ttc => {
                var dayIndex = days.indexOf(ttc.day);
                var slotIndex = ttc.slot-1;
                timetable[dayIndex][slotIndex].day = dayIndex+1;
                timetable[dayIndex][slotIndex].slot = ttc.slot;
                Course.findById(ttc.course).exec().then(crse => {
                    timetable[dayIndex][slotIndex].course = crse;
                }).then(x => {
                    Faculty.findById(ttc.faculty).exec().then(fac => {
                        timetable[dayIndex][slotIndex].faculty = fac;
                    });
                });
            });
            setTimeout(function(){
                return res.send(timetable);
            }, 1000);
        });
    })
});
});

router.get("/facultyTT", function(req,res){
  var fac_name = req.query.name;
  fac_name = fac_name.trim();
  TimetableStructure.findOne({}).exec().then(tt => {
      Faculty.find({}).exec().then(faculties => {
          var index = 0, flag = true;
          faculties.forEach(fac => {
              if(fac.fullName == fac_name) {
                  flag = false;
              }
              if(flag)
                  index++;
          });

          var facTT = tt.facultyTT[index];
          var cList = new Set();
          for(var i=0; i<facTT.length; i++) {
              for(var j=0; j<facTT[i].length; j++) {
                  var x = facTT[i][j][1];
                  if(x) {
                  var x2 = x.split(' ');
                  if(x2.length > 1) 
                    cList.add(x2[1])
                  else 
                    cList.add(x2[0]);
                  }
                    
              }
          }
          var cNames = {};
          cList.forEach(c => {
            Course.findOne({id: c}).then(course => {
                cNames[course.id] = course.name
            });
          });
          setTimeout(function(){
            return res.send(facTT);
          },500);
      });
  });
});

router.post("/substitute", function(req,res){
  var classID = req.body.id;
  var day = req.body.day;
  var slot = req.body.slot;
  var courseName = req.body.name;

  var facs = [];
  var substitutes = [];
  var facTT;
  Course.findOne({name: courseName}).then(course => {
    Faculty.find({}).then(faculties => {
      faculties.forEach(faculty => {
        faculty.courses.forEach(fac_course => {
          if(fac_course.equals(course._id)) {
            facs.push(faculty.fullName);
          }
        });
      });
    }).then(xx => {
      facs.forEach(fac => {
        
        var index = 0;
        TimetableStructure.findOne({}).exec().then(tt => {
            Faculty.find({}).exec().then(faculties => {
                var flag = true;
                index = 0;
                faculties.forEach(facul => {
                    if(facul.fullName == fac) {
                        flag = false;
                    }
                    if(flag)
                        index++;
                });
            }).then(x => {
                facTT = tt.facultyTT[index];
                var i=0,j=0;
                facTT.forEach(tt => {
                    j = 0;
                    tt.forEach(tt2 => {
                        if(!tt2 && i == day && j == slot) {
                            substitutes.push(fac);
                        }
                        j++;
                    });
                    i++;
                });
        });
        });
      });
  });
  });

  setTimeout(function(){
    return res.send(substitutes);
  },2000);

});

function getFacTT(fac_name) {
  fac_name = fac_name.trim();
  var index = 0;
  TimetableStructure.findOne({}).exec().then(tt => {
      Faculty.find({}).exec().then(faculties => {
          var flag = true;
          index = 0;
          faculties.forEach(fac => {
              if(fac.fullName == fac_name) {
                  flag = false;
              }
              if(flag)
                  index++;
          });
      }).then(x => {
          var facTT = tt.facultyTT[index];
          console.log(facTT);
          return facTT;
  });
  });
}


module.exports = router;