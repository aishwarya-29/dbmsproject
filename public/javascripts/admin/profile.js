var currSlide = "Admindetails";

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
            $('#'+ id+'-courselist').append('<span class="course '+id+'-course">'+coursename+'<span class="delete"> <i class="fas fa-times fa-xs"></i></span></span> ')
            $('.delete').click(function(){
                $(this).parent().remove();
            });            
        } 
        else 
            alert("Course name not in course list");
        $(this).val('');
	}

});

$('.link').click(function(){
    $('.link').removeClass('focus');
    var id = $(this).text();
    id = id.split(' ');
    id = id[0];
    $(this).addClass('focus');
    id += "details";
    $('#'+currSlide).toggle();
    $('#'+id).toggle();
    currSlide = id;
});

$('#add-building').click(function(){
    var table = document.getElementById("tb");
    var rowCount = $("#tb tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = '<input type="text" class="form-control form2">';
    cell2.innerHTML = '<input type="number" class="form-control form2">';
    cell3.innerHTML = '<input type="text" class="form-control form2">';
    var str = "";
    for(var i=0; i<departmentList.length;i++){
        str+='<label>'+departmentList[i]+'</label>  <input type="checkbox" class="check">';
    };
    cell4.innerHTML = str;
});

$('.list-item').click(function(){
    $(this).toggleClass('selected-list-item');
});

$('#add-classroom').click(function(){
    var table = document.getElementById("tb3");
    var rowCount = $("#tb3 tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<input class="form-control form2" type="text">';
    cell2.innerHTML = '<input type="number" class="form-control form2">';
    var options = "";
    for(var i=0; i<buildingList.length;i++) {
        options += "<option>"+buildingList[i]+"</option>"
    }
    cell3.innerHTML = '<select class="form-control">'+options+'</select>';
});

$('#add-department').click(function(){
    var table = document.getElementById("tb5");
    var rowCount = $("#tb5 tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = '<input class="form-control form3" type="text">';
    var options = "";
    for(var i=0; i<facultylist.length;i++) {
        options += "<option>"+facultylist[i]+"</option>"
    }
    cell2.innerHTML = '<select class="form-control">'+options+'</select>';
});

$('#add-faculty').click(function(){
    var table = document.getElementById("tb6");
    var rowCount = $("#tb6 tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = '<input class="form-control form2" type="text">';
    cell2.innerHTML = '<input class="form-control form3" type="text">';
    cell3.innerHTML = '<input class="form-control form3" type="text">';
    var options = "";
    for(var i=0; i<courseList.length;i++) {
        options += '<span class="list-item" style="display: inline-block">'+courseList[i]+"</span>"
    }
    cell4.innerHTML = '<div class="lst">' + options + "</div>";
});

$('#add-lab').click(function(){
    var table = document.getElementById("tb7");
    var rowCount = $("#tb7 tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = '<input class="form-control form2" type="text">';
    cell2.innerHTML = '<input class="form-control form2" type="number">';
    var options = "";
    for(var i=0; i<buildingList.length;i++) {
        options += "<option>"+buildingList[i]+"</option>"
    }
    cell3.innerHTML = '<select class="form-control">'+options+'</select>';
    var options2 = "";
    for(var i=0; i<facultylist.length;i++) {
        options2 += "<option>"+facultylist[i]+"</option>";
    }
    cell4.innerHTML = '<select class="form-control">'+options2+'</select>';
});