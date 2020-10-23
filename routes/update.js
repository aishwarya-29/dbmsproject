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
                                b.save();=
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

module.exports = router;