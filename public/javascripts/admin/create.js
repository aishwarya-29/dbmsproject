$('#numofdepartments').change(function(){
    var num = $('#numofdepartments').val();
    $('#departments').html('');
    for(var i=0;i<num;i++) {
        $('#departments').append(
            '<input class="form-control dep" placeholder="Enter Name of Department '+(i+1)+'" id="department'+(i+1)+ '" name="department' + (i+1) + '" type="text"> <br>'
        );
    }
});

$('#numofbuildings').change(function(){
    var num = $('#numofbuildings').val();
    $('#buildings').html('');
    for(var i=0;i<num;i++) {
        $('#buildings').append(
            '<input class="form-control build" placeholder="Enter Name of Building '+(i+1)+'" id="building'+(i+1)+ '" name="building' + (i+1) + '" type="text"> <br>'
        );
    }
});

$('#add-teacher').click(function(){
    var table = document.getElementById("table");
    var rowCount = $("#table tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<input type="text" class="form-control teacher-id" placeholder="Faculty ID">';
    cell2.innerHTML = '<input type="text" class="form-control teacher-name" placeholder="Faculty Name">';
    cell3.innerHTML = '<input type="text" style="width: 350px !important" class="form-control teacher-email" placeholder="Email ID">';
});

$('#add-course').click(function(){
    var table = document.getElementById("table2");
    var rowCount = $("#table2 tr").length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = '<input type="text" class="form-control course-id" placeholder="Course ID">';
    cell2.innerHTML = '<input type="text" class="form-control course-name" placeholder="Name">';
    cell3.innerHTML = '<input type="number" class="form-control course-credits" min="1" max="9">';
    cell4.innerHTML = '<select class="form-control course-theory-or-lab" name="course-theoryorlab" id="course-theoryorlab"><option value="theory">Theory</option><option value="lab">Lab</option><option value="both">Both</option></select>';
    cell5.innerHTML = '<label class="checkbox form-control-lg"><input type="checkbox" class="check" value=""></label>';
});

$('#submit-btn').click(function(){
    var departments = $('.dep');
    var dep = [];
    departments.each(function(){
        dep.push($(this).val());
    });
    var buildings = [];
    $('.build').each(function(){
        buildings.push($(this).val());
    });

    var facultyInformation = [];
    $('.teacher-id').each(function() {
        facultyInformation.push({id: $(this).val()});
    });
    var i = 0;
    $('.teacher-name').each(function(){
        facultyInformation[i].name = $(this).val();
        i++;
    });
    i = 0;
    $('.teacher-email').each(function(){
        facultyInformation[i].email = $(this).val();
        i++;
    });
    
    var courseInformation = [];
    $('.course-id').each(function(){
        courseInformation.push({id: $(this).val()});
    });
    i = 0;
    $('.course-name').each(function(){
        courseInformation[i].name = $(this).val();
        i++;
    });
    i = 0;
    $('.course-credits').each(function(){
        courseInformation[i].credits = $(this).val();
        i++;
    });
    i = 0;
    $('.course-theory-or-lab').each(function(){
        courseInformation[i].theoryorlab = $(this).val();
        i++;
    });
    i = 0;
    $('.course-theory-or-lab').each(function(){
        courseInformation[i].theoryorlab = $(this).val();
        i++;
    });
    i = 0;
    $('.check').each(function(){
        if($(this).prop('checked')) 
            courseInformation[i].elective = true;
        else
            courseInformation[i].elective = false;
        i++;
    });
    var formData = {
        daysInWeek: $('#daysinweek').val(),
        hoursInDay: $('#hoursinday').val(),
        lunchBreakStart: $('#lunchstart').val(),
        lunchBreakEnd: $('#lunchend').val(),
        theoryOrLab: $('#theoryorlab').val(),
        numOfDepartments: $('#numofdepartments').val(),
        numOfBuildings: $('#numofbuildings').val(),
        numOfClassrooms: $('#numofclassrooms').val(),
        numOfLabs: $('#numoflabs').val(),
        departments: dep,
        buildings: buildings,
        facultyInformation: facultyInformation,
        courseInformation: courseInformation
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/admin/create',
        data: JSON.stringify(formData),
        success: function (data) {
        },
        error: function (e) {
            alert("Error!")
            console.log("ERROR: ", e);
        }
    });
    
});