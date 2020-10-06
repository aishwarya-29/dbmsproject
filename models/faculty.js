var mongoose = require('mongoose');

var facultySchema = mongoose.Schema({
    id: String,
    fullName: String,
    emailID: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    profilePicture: String,
    password: String
});

module.exports = mongoose.model("Faculty", facultySchema);