const e = require('express');
var Admin = require('./models/admin');
const building = require('./models/building');
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

var exp = {};

function generateNewTimetable() {
    console.log("called");

    //-----------------------------------------------------------------------------------//
    var buildings = [];
    Building.find({}).exec().then(buil => {
        buil.forEach(build => {
            buildings.push(build.name);
        });
    });

    var classes = [];
    Class.find({}).populate('courses').populate('defaultBuilding').exec().then(cl => {
        cl.forEach(cla => {
            var thisClass = {};
            thisClass.name = cla.name;
            thisClass.building = cla.defaultBuilding.name;
            thisClass.courses = [];
            cla.courses.forEach(crse => {
                thisClass.courses.push(crse.id);
            });
            classes.push(thisClass);
        });
    });

    var classrooms = [];
    Classroom.find({}).populate('building').exec().then(crooms => {
        crooms.forEach(croom => {
            var thisClassroom = {};
            thisClassroom.name = croom.roomNumber;
            thisClassroom.building = croom.building.name;
            classrooms.push(thisClassroom);
        });
    });

    var course = [];
    Course.find({}).exec().then(crses => {
        crses.forEach(crse => {
            var thisCourse = {};
            thisCourse.name = crse.id;
            thisCourse.credits = crse.credits;
            thisCourse.type = crse.type;
            course.push(thisCourse);
        });
    });

    var faculty = [];
    Faculty.find({}).populate('courses').exec().then(facs => {
        facs.forEach(fac => {
            var thisFaculty = {};
            thisFaculty.name = fac.id;
            thisFaculty.courses = [];
            fac.courses.forEach(crse => {
                thisFaculty.courses.push(crse.id);
            });
            faculty.push(thisFaculty);
        })
    });

    var numOfDays, slots;
    TimetableStructure.findOne({}).exec().then(tt => {
        numOfDays = tt.daysInWeek;
        slots = tt.hoursInDay;
    });

    var final_timetable = [];
    setTimeout(function(){
        //console.log(classes);
        createNewTT();
    }, 2000);
    
    
    function createNewTT() {
        // create faculty list for each course
    var fac_course= [];
    course.forEach(function(c){
        var c1 = {name: c.name, faculty: []};
        faculty.forEach(function(f){
            if(f.courses.includes(c.name))
                c1.faculty.push(f.name);
        });
        fac_course.push(c1);
    });
    
    // create room list for each building
    
    var rooms = [];
    buildings.forEach(function(b){
        var build = {name: b, classrooms: []};
        classrooms.forEach(function(c){
            if(c.building == b)
                build.classrooms.push(c.name);
        });
        rooms.push(build);
    });
    
    function assignFaculty(classes, fac_courses) {
        var index = [];
        var i,j;
        for(i=0;i<fac_courses.length;i++)
            index.push(0);
    
        classes.forEach(function(cl){
            cl.faculty = [];
            var course = cl.courses;
            for(i=0;i<course.length;i++) {
                for(j=0;j<fac_courses.length;j++) {
                    if(fac_courses[j].name == course[i]) {
                        cl.faculty.push(fac_courses[j].faculty[index[j]]);
                        index[j]++;
                        if(index[j] == fac_courses[j].faculty.length)
                            index[j] = 0;
                        break;
                    }
                }
            }
        });
    }
    
    var next_free_slot_track = 0;   
    function generateTimetable(fac_courses, rooms, classes, courses) {
        assignFaculty(classes, fac_courses);
        var count = 0;
        classes.forEach(function(cl){
            var courses1 = cl.courses;
            var faculty = cl.faculty;
    
            var timetable = [];
            for(var i=0; i<numOfDays; i++) {
                var temp = [];
                for(var j=0; j< slots; j++) 
                    temp.push('TBD');
                timetable.push(temp);
            }
            final_timetable.push(timetable);
            
            var credits;
            var cnt = -1;
            courses1.forEach(function(course){
                cnt++;
                for(var k=0;k<courses.length;k++) {
                    if(courses[k].name == course) {
                        credits = courses[k].credits;
                        break;
                    }
                }
    
                for(var k=0; k<credits;k++) {
                    var clash = true;
                    var slot;
                    var dist = 0;
                    var xx;
                    while(clash) {
                        var ind = next_free_slot_track;
                        slot = getNextFreeSlot(count,ind, dist);
                        clash = checkForClash(faculty[cnt], count, slot[0], slot[1], classes);
                        next_free_slot_track = (slot[0]+1)%numOfDays;
                        dist++;
                    }
                    final_timetable[count][slot[0]][slot[1]] = course;
                }
            });
            count++;
        });
    
        //console.log(final_timetable);
    }
    
    generateTimetable(fac_course, rooms, classes, course);
    
    function getNextFreeSlot(index,k, n) {
        var i = k,j,m = 0;
        var cnt = 0;
        while(cnt<numOfDays) {
            for(j=0;j<slots;j++) {
                if(final_timetable[index][i][j] == "TBD") {
                    if(m == n) 
                        return [i,j];
                    else 
                        m++;
                }
            }
            i = (i+1)%numOfDays;
            cnt++;
        }
    }
    
    function checkForClash(faculty, index, m,n, classes) {
        var len = final_timetable.length;
        var clash = false;
        for(var i=0; i<len-1;i++) {
            var course = final_timetable[i][m][n];
            if(course != "TBD") {
                var class_course = classes[i].courses;
            var ind;
            for(var j=0;j<class_course.length;j++) {
                if(class_course[j] == course) {
                    ind = j;
                    break;
                }
            }
            var fac = classes[i].faculty[ind];
            if(fac == faculty) {
                clash = true;
                return clash;
            }
            }
        }
        return clash;
    }
    
    var len = final_timetable.length;
    var final_fac = [];
    for(var i=0; i<len;i++) {
        var cl = classes[i];
        var cour = cl.courses;
        var fac = cl.faculty;
        var v1 = [];
        for(var j=0; j<numOfDays; j++) {
            var v2 = [];
            for(var k=0; k<slots; k++) {
                var c = final_timetable[i][j][k];
                if(c == "TBD")
                    v2.push('TBD');
                else {
                for(var l =0; l<cour.length; l++) {
                    if(cour[l] == c) {
                        v2.push(fac[l]);
                        break;
                    }
                }
                }
            }
            v1.push(v2);
        }
        final_fac.push(v1);
    }
    
    //console.log(final_fac);
    var csh = [];
    for(var i=0; i<numOfDays; i++) {
        for(var j=0; j<slots;j++) {
            var cs = [];
            for(var k=0; k<final_fac.length; k++) {
                cs.push(final_fac[k][i][j]);
            }
            //console.log(cs);
        }
    }
    
    var labs = [];
    
    classes.forEach(function(cl){
        var cr = cl.courses;
        var lb = [];
        for(var i=0; i<cr.length; i++) {
            course.forEach(function(crse){
                if(crse.name == cr[i]) {
                    if(crse.type == "Both")
                        lb.push(crse.name);
                }
            });
        }
        labs.push(lb);
    });
    
    //console.log(labs);
    
    function find2slots(index, faculty) {
        for(var i=0; i<numOfDays; i++) {
            for(var j=0; j<slots-1; j++) {
                if(final_timetable[index][i][j] == "TBD" && final_timetable[index][i][j+1] == "TBD") {
                    var available = true;
                    for(var l=0; l<len; l++) {
                        if(final_fac[l][i][j] != faculty && final_fac[l][i][j+1] != faculty) 
                            available = true;
                        else {
                            available = false;
                            break;
                        }
                    }
                    if(available) {
                        return [i,j];
                    } 
                }
            }
        }
    }
    
    //console.log(labs);
    
    for(var i=0; i<len; i++) {
        for(var j=0; j<labs[i].length;j++) {
            var fac;
            for(var k=0; k<classes[i].courses.length; k++){
                if(classes[i].courses[k] == labs[i][j]) {
                    fac = classes[i].faculty[k];
                    break;
                }
            }
            var ss = find2slots(i, fac);
            if(ss) {
                final_timetable[i][ss[0]][ss[1]] = "Lab " + labs[i][j];
                final_timetable[i][ss[0]][ss[1]+1] = "Lab " + labs[i][j];
            }
        }
    }
    // console.log('------------------------------------------------------');
    //console.log(final_timetable);
    
    var final_fac = [];
    
    for(var i=0; i<len;i++) {
        var cl = classes[i];
        var cour = cl.courses;
        var fac = cl.faculty;
        var v1 = [];
        for(var j=0; j<numOfDays; j++) {
            var v2 = [];
            for(var k=0; k<slots; k++) {
                var c = final_timetable[i][j][k];
                if(c == "TBD")
                    v2.push('TBD');
                else {
                    var flag_found = false;
                    for(var l =0; l<cour.length; l++) {
                        if(cour[l] == c) {
                            v2.push(fac[l]);
                            flag_found = true;
                            break;
                        }
                    }
                    if(!flag_found) {
                        var lb_name = c.split(' ')[1];
                        for(var l=0; l<cour.length; l++) {
                            if(cour[l] == lb_name) {
                                v2.push(fac[l]);
                                break;
                            }
                        }
                    }
                }
            }
            v1.push(v2);
        }
        final_fac.push(v1);
    }
    
    for(var i=0; i<numOfDays; i++) {
        for(var j=0; j<slots;j++) {
            var cs = [];
            for(var k=0; k<final_fac.length; k++) {
                cs.push(final_fac[k][i][j]);
            }
            //console.log(cs);
        }
    }
    
    
    //console.log(final_fac);
    
    var faculty_timetable = [];
    
    for(var i=0; i<faculty.length; i++) {
        var v1 = [];
        for(var j=0; j<numOfDays; j++) {
            var v2 = []
            for(var k=0; k<slots; k++) {
                v2.push('');
            }
            v1.push(v2);
        }
        faculty_timetable.push(v1);
    }
    
    for(var i=0; i<final_fac.length; i++) {
        for(var j=0; j<final_fac[i].length; j++) {
            for(var k=0; k<final_fac[i][j].length; k++) {
                for(var l=0; l<faculty.length; l++) {
                    if(faculty[l].name == final_fac[i][j][k]) {
                        faculty_timetable[l][j][k] = [classes[i].name, final_timetable[i][j][k]];
                        break;
                    }
                }
            }
        }
    }
    
    exp.facultyTT = faculty_timetable;
        console.log(faculty_timetable);
        TimetableStructure.findOne({}, function(err, obj){
            if(err)
                console.log(err);
            else {
                obj.facultyTT = faculty_timetable;
                obj.save();
                console.log(obj);
            }
        });
    
        var daysName = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
        var classTT = [];
        for(var i=0; i<final_timetable.length; i++) {
            var days = [];
            for(var j=0; j<final_timetable[i].length; j++) {
            var slotss = [];
            for(var k=0; k<final_timetable[i][j].length; k++) {
                    if(final_timetable[i][j][k] == 'TBD') {
                        var slot = {}
                        slot.class ="TBD";
                    } else {
                        var cc = final_timetable[i][j][k];
                        if(cc.split(' ')[1]) {
                            var slot = {};
                            slot.class = classes[i].name;
                            slot.day = daysName[j];
                            slot.type = "Lab";
                            slot.slot = (k+1);
                            slot.faculty = final_fac[i][j][k];
                            slot.course = cc.split(' ')[1];
                        } else {
                            var slot = {};
                            slot.class = classes[i].name;
                            slot.day = daysName[j];
                            slot.type = "Theory";
                            slot.slot = (k+1);
                            slot.faculty = final_fac[i][j][k];
                            slot.course = cc;
                        }
                    }
                    slotss.push(slot);
                }
                days.push(slotss);
            }
            classTT.push(days);
        }
    
        // for(var i=15; i<classTT.length; i++) {
        //     console.log(classes[i].name);
        //     console.log("------------------------------------");
        //     for(var j=0; j<classTT[i].length; j++) {
        //         console.log("Day " + (j+1));
        //         console.log("------------------------------------");
        //         for(var k=0; k<classTT[i][j].length; k++) {
        //             console.log(classTT[i][j][k]);
        //         }
        //     }
        // }
    
        //console.log(classTT);
    
        var slot_list = [];
    
        for(var i=0; i<classTT.length; i++) {
            for(var j=0; j<classTT[i].length; j++) {
                for(var k=0; k<classTT[i][j].length; k++) {
                    slot_list.push(classTT[i][j][k]);
                }
            }
        }
    
        //console.log(slot_list);
    
        Slot.deleteMany({}).exec().then(console.log("deleted all"));
    
        slot_list.forEach(thisSlot => {
            if(thisSlot.class != "TBD") {
                Class.findOne({name: thisSlot.class}, function(err, cls){
                    if(err)
                        console.log(err);
                    else {
                        Faculty.findOne({id: thisSlot.faculty}, function(err, fac){
                            if(err)
                                console.log(err);
                            else {
                                Course.findOne({id: thisSlot.course}, function(err, course){
                                    if(err)
                                        console.log(err);
                                    else {
                                        Slot.create({
                                            classID: cls,
                                            day: thisSlot.day,
                                            type: thisSlot.type,
                                            slot: thisSlot.slot,
                                            faculty: fac,
                                            course: course
                                        }, function(err, createdSlot){
                                            if(err)
                                                console.log(err);
                                            else {
                                                //console.log(createdSlot);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
        
        setTimeout(function(){
            Timetable.deleteMany({}).exec().then(console.log("deleted all timetable"));
    
        Class.find({}, function(err, classes){
            if(err)
                console.log(err);
            else {
                classes.forEach(cls => {
                    Timetable.create({classID: cls, slots: []}, function(err, newTT){
                        if(err)
                            console.log(err);
                        else {
                            //console.log(newTT);
                        }
                    });
                });
            }
        });
        
        setTimeout(function(){
            Class.find({}, function(err,classes){
                if(err)
                    console.log(err);
                else {
                    classes.forEach(cls => {
                        Slot.find({classID: cls}, function(err, slots){
                            if(err)
                                console.log(err);
                            else {
                                //console.log(slots);
                                slots.forEach(slt => {
                                    Timetable.findOne({classID: cls},function(err, foundTT){
                                        if(err)
                                            console.log(err);
                                        else {
                                            foundTT.slots.push(slt);
                                            foundTT.save();
                                            //console.log(foundTT);
                                        }
                                    });
                                })
                            }
                        });
                    });
                }
            }); 
        }, 3000);
        
        },3000);
        
    
    }
    
}

exp.fun = generateNewTimetable;

module.exports = exp;

