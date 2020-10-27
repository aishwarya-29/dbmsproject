var mongoose = require('mongoose');

var slotSchema = mongoose.Schema({
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    day: String,
    type: String,
    slot: Number,
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom"
    }
});

module.exports = mongoose.model("Slot", slotSchema);