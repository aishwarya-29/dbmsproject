var mongoose = require('mongoose');

var timetableSchema = mongoose.Schema({
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    slots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot"
    }]
});

module.exports = mongoose.model("Timetable", timetableSchema);