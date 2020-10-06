var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    name: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    section: String,
    classAdvisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom"
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    timetable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Timetable"
    }
});

module.exports = mongoose.model("Class", classSchema);