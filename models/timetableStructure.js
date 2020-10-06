var mongoose = require('mongoose');

var timetableStructureSchema = mongoose.Schema({
    daysInWeek: Number,
    hoursInDay: Number,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    lunchBreakStart: String,
    lunchBreakEnd: String,
    numOfDepartments: Number,
    numOfBuildings: Number,
    numOfClassrooms: Number,
    numOfLabs: Number
});

module.exports = mongoose.model("TimetableStructure", timetableStructureSchema);