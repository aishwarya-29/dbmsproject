var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

module.exports.savePassword = function(newUser, callback) {
    bcrypt.genSalt(5,function(err,salt){
        if(err)
            console.log(err);
        else {
            bcrypt.hash(newUser.password, salt, function(err, hash){
                newUser.password = hash;
                newUser.save(callback);
            });
        }
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(err,isMatch);
    });
}