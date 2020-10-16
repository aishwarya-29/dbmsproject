var express = require('express');
var passport = require('passport');
var router = express.Router();
var Admin = require('../models/admin');
const TimetableStructure = require('../models/timetableStructure');
const Department = require('../models/department');
const Building = require('../models/building');
const Faculty = require('../models/faculty');
const Course = require('../models/course');
const Class = require('../models/class');


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
    var object = {
        something: "doneee"
    };
    // TimetableStructure.create({
    //     daysInWeek: formData.daysInWeek,
    //     hoursInDay: formData.hoursInDay,
    //     lunchBreakStart: formData.lunchBreakStart,
    //     lunchBreakEnd: formData.lunchBreakEnd,
    //     numOfDepartments: formData.numOfDepartments,
    //     numOfBuildings: formData.numOfBuildings,
    //     numOfClassrooms: formData.numOfClassrooms,
    //     numOfLabs: formData.numOfLabs,
    //     admin: req.user._id
    // }, function(err, obj){
    //     if(err)
    //         console.log(err);
    //     else {
    //         console.log("created!");
    //         object = obj;
    //     }
    // });
    // var departments = formData.departments;
    // for(var i=0;i<departments.length;i++) {
    //     Department.create({name: departments[i]});
    // }
    // var buildings = formData.buildings;
    // for(var i=0;i<buildings.length;i++) {
    //     Building.create({name: buildings[i]});
    // }

    // var faculties = formData.facultyInformation;
    // faculties.forEach(faculty => {
    //     Faculty.create({
    //         id: faculty.id,
    //         fullName: faculty.name,
    //         emailID: faculty.email
    //     });
    // });

    // var courses = formData.courseInformation;
    // courses.forEach(course => {
    //     Course.create({
    //         id: course.id,
    //         name: course.name,
    //         credits: course.credits,
    //         type: course.theoryorlab,
    //         elective: course.elective
    //     });
    // });
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
    
    // var buildingInfo = formData.buildingInfo;
    // buildingInfo.forEach(function(buildInfo){
    //     for(var i=0; i<buildInfo.departments.length;i++) {
    //         var name = buildInfo.departments[i];
    //         Department.findOne({name: name}, function(err, department){
    //             if(err)
    //                 console.log(err);
    //             else {
    //                 Building.findOne({name:buildInfo.name}, function(err, build){
    //                     if(err)
    //                         console.log(err);
    //                     else {
    //                         build.departments.push(department);
    //                         build.save();
    //                     }
    //                 });
    //             }
    //         });
    //     }

    //     Building.findOne({name:buildInfo.name}, function(err,build){
    //         if(err)
    //             console.log(err);
    //         else {
    //             build.numberOfClassrooms = buildInfo.numOfClassroom;
    //             build.numberOfLabs = buildInfo.numOfLab;
    //             build.save();
    //         }
    //     });
    // });

    // var departmentHeads = formData.departmentHeads;
    // for(var i=0;i<departmentHeads.length;i++) {
    //     var depName = departmentHeads[i][0];
    //     var facName = departmentHeads[i][1];
    //     Department.findOne({name: depName}, function(err, department){
    //         if(err)
    //             console.log(err);
    //         else {
    //             for(var j = 0; j< departmentHeads.length;j++)
    //                 if(departmentHeads[j][0] == department.name)
    //                     facName = departmentHeads[j][1];
    //             console.log(facName);
    //             Faculty.findOne({fullName: facName}, function(err, faculty){
    //                 if(err)
    //                     console.log(err);
    //                 else {
    //                     department.departmentHead = faculty;
    //                     department.save();
    //                 }
    //             });
    //         }
    //     });
    // }

    // var courseMentor = formData.courseMentor;
    // for(var i=0;i<courseMentor.length;i++) {
    //     var courseName = courseMentor[i][0];
    //     var mentorName = courseMentor[i][1];
    //     Course.findOne({name: courseName}, function(err, course){
    //         if(err)
    //             console.log(err);
    //         else {
    //             for(var j=0;j<courseMentor.length;j++) {
    //                 if(courseMentor[j][0] == course.name)
    //                     mentorName = courseMentor[j][1];
    //             }
    //             Faculty.findOne({fullName: mentorName}, function(err, mentor){
    //                 if(err)
    //                     console.log(err);
    //                 else {
    //                     course.courseMentor = mentor;
    //                     course.save();
    //                 }
    //             });
    //         }
    //     });
    // }

    // var facultyCourses = formData.facultyCourses;
    // facultyCourses.forEach(function(facCourse){
    //     for(var i=0; i<facCourse.courses.length; i++) {
    //         var cname = facCourse.courses[i];
    //         Course.findOne({name: cname}, function(err, course){
    //             if(err)
    //                 console.log(err);
    //             else {
    //                 console.log(facCourse.id);
    //                 Faculty.findOne({id: facCourse.id}, function(err, faculty){
    //                     if(err)
    //                         console.log(err);
    //                     else {
    //                         faculty.courses.push(course);
    //                         faculty.save();
    //                     }
    //                 })
    //             }
    //         });
    //     }
    // });

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

router.post("/create/step-3", function(req,res){
    var formData = req.body;
    // formData.forEach(function(classInfo){
    //     Class.create({
    //         name: classInfo.name,
    //         year: classInfo.year,
    //         section: classInfo.section,
    //         strength: classInfo.strength,
    //     }, function(err, newClass){
    //         if(err)
    //             console.log(err);
    //     });

    //     Department.findOne({name: classInfo.department}, function(err,department){
    //         if(err)
    //             console.log(err);
    //         else {
    //             Class.findOne({name: classInfo.name}, function(err,foundClass){
    //                 if(err)
    //                     console.log(err);
    //                 else {
    //                     foundClass.department = department;
    //                     foundClass.save();
    //                 }
    //             });
    //         }   
    //     });

    //     Building.findOne({name: classInfo.build}, function(err,building){
    //         if(err)
    //             console.log(err);
    //         else {
    //             Class.findOne({name: classInfo.name}, function(err,foundClass){
    //                 if(err)
    //                     console.log(err);
    //                 else {
    //                     foundClass.defaultBuilding = building;
    //                     foundClass.save();
    //                 }
    //             });
    //         }   
    //     });

    //     Faculty.findOne({fullName: classInfo.advisor}, function(err,faculty){
    //         if(err)
    //             console.log(err);
    //         else {
    //             Class.findOne({name: classInfo.name}, function(err,foundClass){
    //                 if(err)
    //                     console.log(err);
    //                 else {
    //                     foundClass.classAdvisor = faculty;
    //                     foundClass.save();
    //                 }
    //             });
    //         }   
    //     });

    //     var courses = classInfo.courses;
    //     for(var j = 0; j< courses.length; j++) {
    //         Course.findOne({name: courses[j]}, function(err, course){
    //             if(err)
    //                 console.log(err);
    //             else {
    //                 Class.findOne({name: classInfo.name}, function(err, foundClass){
    //                     if(err)
    //                         console.log(err);
    //                     else 
    //                         foundClass.courses.push(course);
    //                         foundClass.save();
    //                 });
    //             }
    //         });
    //     }
    // });

    return res.send(formData);
});

module.exports = router;
