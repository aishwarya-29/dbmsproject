var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var adminSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

var Admin = module.exports = mongoose.model("Admin", adminSchema);

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

module.exports.changePassword = function(user, password,callback) {
    bcrypt.genSalt(5, function(err,salt){
        if(err)
            console.log(err);
        else {
            bcrypt.hash(password, salt, function(err, hash){
                user.password = hash;
                user.save(callback);
            });
        }
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(err,isMatch);
    });
}