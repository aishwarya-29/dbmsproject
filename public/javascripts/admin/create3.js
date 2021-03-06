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


$(document.body).on('keypress','.courseList',function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
        var coursename = $(this).val();
        if(coursename == "" || coursename == null)
            alert("Please enter valid name");
        else if(courseList.includes(coursename)) {
            var id = $(this).attr('id');
            id = id.split("-")[0];
            $('#'+id+'-listofcourses').append('<span class="course course-class-'+id+'">'+coursename+'<span class="delete"> <i class="fas fa-times fa-xs"></i></span></span>');
            $(this).val('');
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
    $('.classlist').append('<div class="containe class" id="class1"><div class="head">Class '+count+'<div style="float: right"><button class="btn btn-sm btn-danger deleteclass">Delete</button></div></div><div class="classinfo"><div class="item"><label>Name/ID</label><input class="form-control" type="text" id="class'+count+'-name"></div><div class="item"><label>Year</label><input class="form-control" type="number" id="class'+count+'-year"></div><div class="item"><label>Section</label><input class="form-control" type="text" id="class'+count+'-section"></div><div class="item"><label>Strength</label><input class="form-control" type="number" id="class'+count+'-strength"></div><div class="item"><label>Department</label><input class="form-control departmentList" type="text" id="class'+count+'-department"></div><div class="item"><label>Default Building</label><input class="form-control buildingList" type="text" id="class'+count+'-building"></div><div class="item"><label>Class Advisor</label><input class="form-control facultyList" type="text" id="class'+count+'-advisor"></div><div class="item class-course"><div class="float-left"><label>Courses</label><input type="text" class="form-control courseList" id="'+count+'-courselist"></div><div class="float-right" id="'+count+'-listofcourses"></div></div></div></div> <br>');
    start();
});


$('.special-btn').click(function(){
    var classes = [];
    for(var i=1;i<=count;i++) {
        var classInfo = {};
        classInfo.name = $('#class'+i+'-name').val();
        classInfo.year = $('#class'+i+'-year').val();
        classInfo.section = $('#class'+i+'-section').val();
        classInfo.strength = $('#class'+i+'-strength').val();
        classInfo.department = $('#class'+i+'-department').val();
        classInfo.build = $('#class'+i+'-building').val();
        classInfo.advisor = $('#class'+i+'-advisor').val();
        classInfo.courses = [];
        $('.course-class-'+i).each(function(){
            var str = $(this).text();
            str = str.substring(0,str.length-1);
            classInfo.courses.push(str);
        });
        classes.push(classInfo);
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/admin/create/step-3',
        data: JSON.stringify(classes),
        success: function (data) {
            alert("success");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
    
});



