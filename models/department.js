var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema({
    id: String,
    name: String,
    employeeCount: Number,
    departmentHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    faculties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }]
});

module.exports = mongoose.model("Department", departmentSchema);