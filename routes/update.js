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

router.post("/admin", function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    Admin.findById(req.user._id, function(err, admin){
        if(err)
            console.log(err);
        else {
            if(name != "") {
                admin.name = name;
                req.session.passport.user.name= name;
                req.session.save(function(err) {console.log(err);});
            }
            if(email != "") {
                admin.email = email;
                req.session.passport.user.email= email;
                req.session.save(function(err) {console.log(err);})
            }
            admin.save(); 
        }
    }).exec(function(){
        res.redirect("/admin/profile");
    });
});

router.post("/building", function(req,res){
    console.log(req.body);
    var buildingsID = req.body.builingid;
    var i;
    var names = req.body.name;
    var numOfClassrooms = req.body.numOfClassroom;
    var numOfLabs = req.body.numOfLabs;
    for(i=0;i<buildingsID.length;i++) {
        Building.findByIdAndUpdate(buildingsID[i], {
            name: names[i], 
            numberOfClassrooms: numOfClassrooms[i],
            numberOfLabs: numOfLabs[i],
            departments: []}).exec(function(err, building){
                if(err)
                    console.log(err);
                else {
                    //console.log(building);
                }
            });
    }
    
    buildingsID.forEach(function(id){
        var dep = "dep-"+id;
        var departments = req.body[dep];
        if(Array.isArray(departments)) {
        departments.forEach(function(department){
            Department.findOne({name: department}, function(err, depmt){
                if(err)
                    console.log(err);
                else {
                    Building.findById(id, function(err, building){
                        if(err)
                            console.log(err);
                        else {
                            building.departments.push(depmt);
                            building.save();
                        }
                    });
                }
            });
        });
        } else {
            Department.findOne({name: departments}, function(err, depmt){
                if(err)
                    console.log(err);
                else {
                    Building.findById(id, function(err, building){
                        if(err)
                            console.log(err);
                        else {
                            building.departments.push(depmt);
                            building.save();
                        }
                    });
                }
            });
        }
    });

    var ind = 0;
    if(names.length > buildingsID.length) {
        names.forEach(function(name){
            if(ind >= buildingsID.length) {
            var str = "deps" + (ind+1);
            var depts = req.body[str];
            Building.create({
                name: names[ind],
                numberOfClassrooms: numOfClassrooms[ind],
                numberOfLabs: numOfLabs[ind],
                departments: []
            }).then(function(building){
                    if(Array.isArray(depts)){
                    for(var j=0; j<depts.length; j++) {
                        console.log(j, depts[j]);
                        Department.findOne({name: depts[j]}).exec().then(function(dept){
                                Building.findById(building._id).exec().then(function(b){
                                    b.departments.push(dept);
                                    b.save();
                                });
                        });
                    }
                    } else {
                        Department.findOne({name: depts}).exec().then(function(dept){
                            Building.findById(building._id).exec().then(function(b){
                                b.departments.push(dept);
                                b.save();
                            });
                        });
                    }
            });}
            ind++;
        });
    }

    setTimeout(function(){
        res.redirect("/admin/profile");
    },2000);
    
});

router.post("/class", function(req,res){
    console.log(req.body);
    var formData = req.body;
    var classID = req.body.classid;
    var param = "";
    classID.forEach(classid => {
        param = "department" + classid;
        Department.findOne({name: formData[param]}).then(department => {
            param = "advisor" + classid;
            Faculty.findOne({fullName: formData[param]}).then(faculty => {
                param = "defaultBuilding" + classid;
                Building.findOne({name: formData[param]}).then(building => {
                    var name_param = "name" + classid;
                    var year_param = "year" + classid;
                    var strength_param = "strength" + classid;
                    // console.log(department);
                    // console.log(faculty);
                    // console.log(building);
                    // console.log(classid, formData[name_param], formData[year_param], formData[strength_param]);
                    Class.findByIdAndUpdate(classid, {
                        name: formData[name_param],
                        year: formData[year_param],
                        strength: formData[strength_param],
                        department: department,
                        classAdvisor: faculty,
                        defaultBuilding: building,
                        courses: []
                    }).then(cls => {
                        var courseslist = [];
                        for(var i=0; i<classID.length; i++) {
                            var clist = [];
                            clist.push(classID[i]);
                            var param = 'classcourse' +(i+1);
                            clist.push(formData[param]);
                            courseslist.push(clist);
                        }
                        
                        courseslist.forEach(cl => {
                            for(var i=0; i<cl[1].length; i++) {
                                Course.findOne({name: cl[1][i]}).then(course => {
                                    Class.findById(cl[0]).then(cls => {
                                            cls.courses.push(course);
                                            cls.markModified('courses');
                                            cls.save();
                                    });
                                });
                            }
                        });
                    })
                });
            });
        });
    });

    setTimeout(function(){
        res.redirect("/admin/profile");
    },2000);
});

router.post("/classroom", function(req,res){
    var formData = req.body;
    console.log(req.body);
    var classroomID = formData.classroomid;
    var roomNumber = formData.roomNumber;
    var capacity = formData.capacity;
    var building = formData.building;

    for(var i=0; i<classroomID.length; i++) {
        Classroom.findByIdAndUpdate(classroomID[i],{
            roomNumber: roomNumber[i],
            capacity: capacity[i]
        }).then(croom => {
        });
    }

    var ind = 0;
    classroomID.forEach(function(cid){
        Building.findOne({name: building[ind]}, function(err, build) {
            if(err)
                console.log(err);
            Classroom.findById(cid, function(err, cls){
                if(err)
                    console.log(err);
                else {
                    cls.building = build;
                    cls.save();
                }
            });
        });
        ind++;
    });

    if(capacity.length > classroomID.length) {
        var newClasrooms = [];
        for(var i=classroomID.length; i<capacity.length; i++) {
            var cr = {};
            cr.roomNumber = roomNumber[i];
            cr.capacity = capacity[i];
            cr.building = building[i];
            newClasrooms.push(cr);
        }

        newClasrooms.forEach(function(classroom){
            Building.findOne({name: classroom.building}, function(err, build){
                if(err)
                    console.log(err);
                else {
                    Classroom.create({
                        roomNumber: classroom.roomNumber,
                        capacity: classroom.capacity,
                        building: build
                    }, function(err, newc){
                        if(err)
                            console.log(err);
                        else {
                        }
                    });
                }
            });
        });
    }

    setTimeout(function(){
        res.redirect("/admin/profile");
    },2000);
});

router.post("/course", function(req,res){
    var formData = req.body;
    console.log(formData);

    var courseID = formData.courseid;
    var id = formData.id;
    var name = formData.name;
    var credits = formData.credits;
    var type = formData.type;
    var elective = formData.elective;
    var mentor = formData.mentor;

    var elective2 = [];
    var flag = 1;
    for(var i=0; i<elective.length; i++) {
        if(flag) {
            elective2.push(elective[i]);
        } else {
            flag = 1;
        }
        if(elective[i] == '1')
            flag = 0;
    }
    var courseList = [];
    for(var i=0; i<courseID.length; i++) {
        var course = {};
        course.objectID = courseID[i];
        course.id = id[i];
        course.name = name[i];
        course.credits = credits[i];
        course.type = type[i];
        if(elective2[i] == 1) 
            course.elective = true;
        else 
            course.elective = false;
        course.mentor = mentor[i];
        courseList.push(course);
    }
    courseList.forEach(function(course){
        Faculty.findOne({fullName: course.mentor}, function(err, faculty){
            if(err)
                console.log(err);
            else {
                Course.findByIdAndUpdate(course.objectID,{
                    id: course.id,
                    name: course.name,
                    credits: course.credits,
                    type: course.type,
                    elective: course.elective, 
                    courseMentor: faculty
                }).then(updatedCourse => {  
                    //console.log(updatedCourse);
                })
            }
        });
    });

    if(name.length > courseID.length) {
        var newCourses = [];
        for(var i=courseID.length; i<name.length; i++) {
            var newCourse = {};
            newCourse.id = id[i];
            newCourse.name = name[i];
            newCourse.credits = credits[i];
            newCourse.type = type[i];
            if(elective2[i] == 1)
                newCourse.elective = true;
            else 
                newCourse.elective = false;
            newCourse.mentor = mentor[i];
            newCourses.push(newCourse);
        }

        newCourses.forEach(function(newCourse){
            Faculty.findOne({fullName: newCourse.mentor}, function(err, faculty){
                if(err)
                    console.log(err);
                else {
                    Course.create({
                        id: newCourse.id,
                        name: newCourse.name,
                        credits: newCourse.credits,
                        type: newCourse.type,
                        elective: newCourse.elective,
                        courseMentor: faculty
                    }).then(newc => {
                        //console.log(newc);
                    });
                }
            });
        });
    }

    setTimeout(function(){
        res.redirect("/admin/profile");
    },2000);
});

router.post("/department", function(req,res){
    var formData = req.body;
    console.log(formData);
    var departmentID = formData.departmentid;
    var name = formData.name;
    var head = formData.head;

    var departments = [];
    for(var i=0; i<departmentID.length; i++) {
        var department = {};
        department.objectID = departmentID[i];
        department.name = name[i];
        department.head = head[i];
        departments.push(department);
    }

    departments.forEach(function(dep) {
        Faculty.findOne({fullName: dep.head}, function(err, faculty){
            if(err)
                console.log(err);
            else {
                Department.findByIdAndUpdate(dep.objectID, {
                    name: dep.name,
                    departmentHead: faculty
                }).then(updatedDepartment => {
                    //console.log(updatedDepartment);
                });
            }
        });
    });

    if(name.length > departmentID.length) {
        var newDepartments = [];
        for(var i=departmentID.length; i<name.length; i++) {
            var newDepartment = {};
            newDepartment.name = name[i];
            newDepartment.head = head[i];
            newDepartments.push(newDepartment);
        }

        newDepartments.forEach(newDep => {
            Faculty.findOne({fullName: newDep.head}, function(err, faculty){
                if(err)
                    console.log(err);
                else {
                    Department.create({
                        name: newDep.name,
                        departmentHead: faculty
                    }).then(newDepart => {
                        //console.log(newDepart);
                    });
                }
            });
        });
    }

    setTimeout(function(){
        res.redirect("/admin/profile");
    },2000);
});

module.exports = router;