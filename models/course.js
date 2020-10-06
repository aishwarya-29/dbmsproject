var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
    id: String,
    name: String,
    credits: Number,
    type: String,
    elective: Boolean,
    courseMentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }
});

module.exports = mongoose.model("Course", courseSchema);