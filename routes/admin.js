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

router.post("/create/step-2", function(req,res){
    var formData = req.body;
    console.log(formData);
    
    var buildingInfo = formData.buildingInfo;
    buildingInfo.forEach(function(buildInfo){
        Building.findOneAndUpdate({name:buildInfo.name}, function(err,build){
            if(err)
                console.log(err);
            else {
                build.departments = [];
                for(var i=0; i<buildInfo.departments.length; i++) {
                    Department.find({name: buildInfo.departments[i]}, function(err, department){
                        if(err)
                            console.log(err);
                        else 
                            build.departments.push(department._id);
                    });
                }
                build.numberOfClassrooms = buildInfo.numOfClassroom;
                build.numberOfLabs = buildInfo.numOfLab;
            }
        });
    });

    var departmentHeads = formData.departmentHeads;
    for(var i=0;i<departmentHeads.length;i++) {
        var depName = departmentHeads[i][0];
        var facName = departmentHeads[i][1];
        Department.findOneAndUpdate({name: depName}, function(err, department){
            if(err)
                console.log(err);
            else {
                Faculty.find({fullName: facName}, function(err,faculty){
                    if(err)
                        console.log(err);
                    else {
                        department.departmentHead = faculty._id;
                    }
                });
            }
        });
    }

    var courseMentor = formData.courseMentor;
    for(var i=0; i<courseMentor.length; i++) {
        var courseName = courseMentor[i][0];
        var facName = courseMentor[i][1];
        Course.findOneAndUpdate({name: courseName}, function(err, course){
            if(err)
                console.log(err);
            else {
                Faculty.find({name: facName}, function(err, faculty){
                    if(err)
                        console.log(err);
                    else {
                        course.courseMentor = faculty._id;
                    }
                });
            }
        });
    }

    var facultyCourses = formData.facultyCourses;
    facultyCourses.forEach(function(facCourse){
        Faculty.findOneAndUpdate({id:facCourse.id}, function(err, faculty){
            if(err)
                console.log(err);
            else {
                faculty.courses = [];
                for(var i=0; i<facCourse.courses.length;i++) {
                    var cname = facCourse.courses[i];
                    Course.find({name: cname}, function(err, course){
                        if(err)
                            console.log(err);
                        else {
                            faculty.courses.push(course._id);
                            faculty.save(function(){});
                        }
                    });
                }
            }
        });
    });

    return res.send(formData);
});

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
