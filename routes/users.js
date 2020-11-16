var express = require('express');
var router = express.Router();
var passport = require('passport');
const TimetableStructure = require('../models/timetableStructure');
const Faculty = require('../models/faculty');
const Course = require('../models/course');
const Class = require('../models/class');
const Timetable  = require('../models/timetable');
var Student = require('../models/student');


router.get("/", function(req,res){
  setTimeout(function(){
    res.render("users/login");
  },1000);
});

router.post("/user",passport.authenticate(['localstudent','localfaculty'],{
  successRedirect: '/profile',
  failureRedirect: '/error'
}));

router.get("/user-profile", function(req,res){
  var tt = [];
  Student.findOne({fullName: req.user.fullName}).populate('class').exec().then(student => {
    Class.findOne({name: student.class.name}).populate('courses').exec().then(cls => {
      Timetable.findOne({classID: cls}).populate('slots').then(clsTT =>{
        clsTT.slots.forEach(slot => {
            var ttinstance = {};
            ttinstance.day = slot.day;
            ttinstance.slot = slot.slot;
            ttinstance.faculty = slot.faculty;
            ttinstance.course = slot.course;
            tt.push(ttinstance);
            //console.log(ttinstance);
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
                //console.log(timetable);
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
                    //console.log(timetable);
                    res.render("users/user-profile", {timetable: timetable, courses: cls.courses, student: student});
                }, 2000);
            });
          })
        });
      });
});

router.get("/faculty-profile", function(req,res){
  Faculty.findOne({id: req.user.id}).populate('courses').exec().then(faculty => {
    var fac_name = faculty.fullName;
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
            Class.find({}).populate('courses').populate('department').populate('defaultBuilding').populate('classAdvisor').exec().then(classes => {
                res.render("users/faculty-profile", {faculty: faculty, facultyTT: facTT, courses: cNames});
            });
          },500);
        });
    });
  });
});

router.get("/view", function(req,res){
  if(req.user) {
    setTimeout(function(){
        Class.find({}).populate('courses').populate('department').populate('defaultBuilding').populate('classAdvisor').exec().then(classes => {
            res.render("users/view", {classes: classes});
        });
    },2000);
} else {
    res.redirect("/users");
}
});

router.post("/view/classTT", function(req,res){
  var tt = [];
  var year = req.body.year;
  var section = req.body.section;
          Class.findOne({year: year, section: req.body.section}).exec().then(cls => {
              Timetable.findOne({classID: cls}).populate('slots').then(clsTT =>{
                      clsTT.slots.forEach(slot => {
                          var ttinstance = {};
                          ttinstance.day = slot.day;
                          ttinstance.slot = slot.slot;
                          ttinstance.faculty = slot.faculty;
                          ttinstance.course = slot.course;
                          tt.push(ttinstance);
                          console.log(ttinstance);
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
                      console.log(timetable);
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
                          console.log(timetable);
                          Class.find({}).populate('courses').populate('department').populate('defaultBuilding').populate('classAdvisor').exec().then(classes => {
                              res.render("users/view", {classes: classes, timetable: timetable});
                          });
                      }, 2000);
                  });
              })
          });
});

router.post("/view/facultyTT", function(req,res){
  var fac_name = req.body.name;
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
            Class.find({}).populate('courses').populate('department').populate('defaultBuilding').populate('classAdvisor').exec().then(classes => {
                res.render("users/view", {classes: classes, facultyTT: facTT, courses: cNames});
            });
          },500);
      });
  });
});

router.post("/logout", function(req,res){
  req.logout();
  res.redirect("/users");
});

module.exports = router;
