var facultylist = [];
var courseList = [];
var departmentList = [];
var buildingList = [];

function start() {
    facultylist = [];
    courseList = [];
    departmentList = [];
    buildingList = [];
    var formData = {

    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/faculty',
        data: JSON.stringify(formData),
        dataType:"JSON",
        success: function (data) {
            data.forEach(function(faculty){
                facultylist.push(faculty.fullName);
            });
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });
    setTimeout(function(){
        $(".facultyList").autocomplete({
            source: facultylist,
            messages: {
                noResults: 'no results',
                results: function(amount) {
                    return amount + 'results.'
                }
            }
        });
    },2000);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/course',
        data: JSON.stringify(formData),
        dataType:"JSON",
        success: function (data) {
            data.forEach(function(course){
                courseList.push(course.name);
            });
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });
    
    setTimeout(function(){
        $(".courseList").autocomplete({
            source: courseList,
            messages: {
                noResults: 'no results',
                results: function(amount) {
                    return amount + 'results.'
                }
            }
        });
    },2000);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/department',
        data: JSON.stringify(formData),
        dataType:"JSON",
        success: function (data) {
            data.forEach(function(department){
                departmentList.push(department.name);
            });
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });

    setTimeout(function(){
        $(".departmentList").autocomplete({
            source: departmentList,
            messages: {
                noResults: 'no results',
                results: function(amount) {
                    return amount + 'results.'
                }
            }
        });
    },2000);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/building',
        data: JSON.stringify(formData),
        dataType:"JSON",
        success: function (data) {
            data.forEach(function(building){
                buildingList.push(building.name);
            });
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });

    setTimeout(function(){
        $(".buildingList").autocomplete({
            source: buildingList,
            messages: {
                noResults: 'no results',
                results: function(amount) {
                    return amount + 'results.'
                }
            }
        });
    },2000);
}

$(document).ready(function(){
    start();
});

$('.courseList').keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
        var coursename = $(this).val();
        if(coursename == "" || coursename == null)
            alert("Please enter valid name");
        else if(courseList.includes(coursename)) {
            var id = $(this).attr('id');
            id = id.split("-")[0];
            $('#'+id+'-listofcourses').append('<span class="course">'+coursename+' <span class="delete"><i class="fas fa-times fa-xs"></i></span></span>')
            $('.delete').click(function(){
                $(this).parent().remove();
            });     
        } 
        else 
            alert("Course name not in course list");
	}

});

var count = 1;

$('#addbtn').click(function(){
    count++;
    $('.classlist').append('<div class="containe class" id="class1"><div class="head">Class '+count+'<div style="float: right"><button class="btn btn-sm btn-danger deleteclass">Delete</button></div></div><div class="classinfo"><div class="item"><label>Name/ID</label><input class="form-control" type="text"></div><div class="item"><label>Year</label><input class="form-control" type="number"></div><div class="item"><label>Section</label><input class="form-control" type="text"></div><div class="item"><label>Strength</label><input class="form-control" type="number"></div><div class="item"><label>Department</label><input class="form-control departmentList" type="text"></div><div class="item"><label>Default Building</label><input class="form-control buildingList" type="text"></div><div class="item"><label>Class Advisor</label><input class="form-control facultyList" type="text"></div><div class="item class-course"><div class="float-left"><label>Courses</label><input type="text" class="form-control courseList" id="1-courselist"></div><div class="float-right" id="1-listofcourses"></div></div></div></div> <br>');
    start();
});


