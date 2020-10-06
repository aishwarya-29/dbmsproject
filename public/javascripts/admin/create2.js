var facultylist = [];
var courseList = [];
var departmentList = [];
var buildingList = [];
var faculties = [];
var courses = [];
var departments = [];
var buildings = [];

$(document).ready(function(){
    var formData = {

    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/faculty',
        data: JSON.stringify(formData),
        dataType:"JSON",
        success: function (data) {
            faculties = data;
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
            courses = data;
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
            departments = data;
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
            buildings = data;   
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
            $('#'+ id+'-courselist').append('<span class="course '+id+'-course">'+coursename+' <span class="delete"><i class="fas fa-times fa-xs"></i></span></span> ')
            $('.delete').click(function(){
                $(this).parent().remove();
            });            
        } 
        else 
            alert("Course name not in course list");
        $(this).val('');
	}

});


$('.special-btn').click(function(){
    var buildingInfo = [];
    buildings.forEach(function(building){
        var buildInfo = {};
        buildInfo.name = building.name;
        buildInfo.departments = [];
        buildInfo.numOfClassroom = $('#'+building.name+'-numOfClassroom').val();
        buildInfo.numOfLab = $('#'+building.name+'-numOfLab').val();
        departments.forEach(function(department){
            if($('#'+building.name+'-'+department.name).prop('checked')) {
                buildInfo.departments.push(department.name);
            }
        });
        buildingInfo.push(buildInfo);
    });

    var departmentHeads = [];
    departments.forEach(function(department) {
        var name = department.name;
        departmentHeads.push([name,$('#'+name+'-head').val()]);
    });
    
    var courseMentor = [];
    courses.forEach(function(course){
        var name = course.name;
        courseMentor.push([name,$('#'+name+'-mentor').val()]);
    });

    var facultyCourses = [];
    faculties.forEach(function(faculty){
        var id = faculty.id;
        var facultyCourse = {};
        facultyCourse.id = id;
        facultyCourse.courses = [];
        $('.'+id+'-course').each(function(){
            facultyCourse.courses.push($(this).text());
        });
        facultyCourses.push(facultyCourse);
    });

    var formData = {
        buildingInfo: buildingInfo,
        departmentHeads: departmentHeads,
        courseMentor: courseMentor,
        facultyCourses: facultyCourses
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/admin/create/step-2',
        data: JSON.stringify(formData),
        success: function (data) {
            alert("sucess");
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });

});