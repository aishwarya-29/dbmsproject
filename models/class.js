var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    name: String,
    year: Number,
    section: String,
    strength: Number,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    defaultBuilding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building"
    },
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