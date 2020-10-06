var mongoose = require('mongoose');

var buildingSchema = mongoose.Schema({
    id: String,
    name: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    numberOfClassrooms: Number,
    numberOfLabs: Number,
    classrooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom"
    }],
    labs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Labs"
    }]
});

module.exports = mongoose.model("Building", buildingSchema);