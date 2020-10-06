var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    rollNumber: String,
    name: String,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    email: String,
    password: String
});

module.exports = mongoose.model("Student", studentSchema);