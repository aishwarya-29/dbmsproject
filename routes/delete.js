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


router.post("/building", function(req,res){
    Building.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });

    res.send("done");
});

router.post("/class", function(req,res){
    Class.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

router.post("/classroom", function(req,res){
    Classroom.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

router.post("/course", function(req,res){
    Course.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

router.post("/department", function(req,res){
    Department.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

router.post("/faculty", function(req,res){
    Faculty.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

router.post("/lab", function(req,res){
    Lab.findByIdAndDelete(req.body.id, function(err, deletedObj){
        if(err)
            console.log(err);
        else {
            //console.log("deleted!");
        }
    });


    res.send("done");
});

module.exports = router;