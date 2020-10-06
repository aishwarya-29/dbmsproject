var mongoose = require('mongoose');

var classroomSchema = mongoose.Schema({
    roomNumber: String,
    capacity: Number,
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building"
    }
});

module.exports = mongoose.model("Classroom", classroomSchema);