var express = require('express');
var passport = require('passport');
var router = express.Router();
var Admin = require('../models/admin');
const TimetableStructure = require('../models/timetableStructure');
const Department = require('../models/department');
const Building = require('../models/building');
const Faculty = require('../models/faculty');
const Course = require('../models/course');


router.get("/login", function(req,res){
    res.render("users/adminLogin");
});

router.post("/",passport.authenticate('local',{
    successRedirect: '/admin/create',
    failureRedirect: '/error'
}));

router.get("/create", function(req,res){
    res.render("admin/create");
});

router.post("/create", function(req,res){
    var formData = req.body;
    console.log(formData);
    var object = {
        something: "doneee"
    };
    TimetableStructure.create({
        daysInWeek: formData.daysInWeek,
        hoursInDay: formData.hoursInDay,
        lunchBreakStart: formData.lunchBreakStart,
        lunchBreakEnd: formData.lunchBreakEnd,
        numOfDepartments: formData.numOfDepartments,
        numOfBuildings: formData.numOfBuildings,
        numOfClassrooms: formData.numOfClassrooms,
        numOfLabs: formData.numOfLabs,
        admin: req.user._id
    }, function(err, obj){
        if(err)
            console.log(err);
        else {
            console.log("created!");
            object = obj;
        }
    });
    var departments = formData.departments;
    for(var i=0;i<departments.length;i++) {
        Department.create({name: departments[i]});
    }
    var buildings = formData.buildings;
    for(var i=0;i<buildings.length;i++) {
        Building.create({name: buildings[i]});
    }

    var faculties = formData.facultyInformation;
    faculties.forEach(faculty => {
        Faculty.create({
            id: faculty.id,
            fullName: faculty.name,
            emailID: faculty.email
        });
    });

    var courses = formData.courseInformation;
    courses.forEach(course => {
        Course.create({
            id: course.id,
            name: course.name,
            credits: course.credits,
            type: course.theoryorlab,
            elective: course.elective
        });
    });
    return res.send(object);
});

router.get("/create/step-2", function(req,res){
    var departments, buildings;
    Department.find({}, function(err, allDepartments){
        if(err)
            console.log(err);
        else {
            Building.find({}, function(err,allBuildings){
                if(err)
                    console.log(err);
                else 
                    Faculty.find({}, function(err, allFaculty) {
                        if(err)
                            console.log(err);
                        else {
                            Course.find({}, function(err, allCourse) {
                                if(err)
                                    console.log(err);
                                else
                                res.render("admin/create2",{departments: allDepartments, buildings: allBuildings, faculties: allFaculty, courses: allCourse});
                            });
                        }
                    });
            });
        }
    });
  
})

router.get("/create/step-3", function(req,res){
    var departments, buildings;
    Department.find({}, function(err, allDepartments){
        if(err)
            console.log(err);
        else {
            Building.find({}, function(err,allBuildings){
                if(err)
                    console.log(err);
                else 
                    Faculty.find({}, function(err, allFaculty) {
                        if(err)
                            console.log(err);
                        else {
                            Course.find({}, function(err, allCourse) {
                                if(err)
                                    console.log(err);
                                else
                                res.render("admin/create3",{departments: allDepartments, buildings: allBuildings, faculties: allFaculty, courses: allCourse});
                            });
                        }
                    });
            });
        }
    });
  
});

module.exports = router;
