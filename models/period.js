var mongoose = require('mongoose');

var periodSchema = mongoose.Schema({
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    day: String,
    type: String,
    hour: Number,
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom"
    }
});

module.exports = mongoose.model("Period", periodSchema);