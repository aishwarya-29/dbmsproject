var facultylist = [];
var courseList = [];
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
            $('#'+ id+'-courselist').append('<span class="course">'+coursename+' <span class="delete"><i class="fas fa-times fa-xs"></i></span></span> ')
            $('.delete').click(function(){
                $(this).parent().remove();
            });            
        } 
        else 
            alert("Course name not in course list");
	}

});