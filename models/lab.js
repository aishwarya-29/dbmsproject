var mongoose = require('mongoose');

var labSchema = mongoose.Schema({
    labID: String,
    capacity: Number,
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building"
    },
    labIncharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
});

module.exports = mongoose.model("Lab", labSchema);