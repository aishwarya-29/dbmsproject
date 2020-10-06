var mongoose = require('mongoose');

var timetableSchema = mongoose.Schema({
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    periods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Period"
    }]
});

module.exports = mongoose.model("Timetable", timetableSchema);