var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var studentSchema = mongoose.Schema({
    rollNumber: String,
    fullName: String,
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

module.exports.createUser = function(newUser, callback) {
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