$(document).ready(function(){
    var colours = ["accent-pink-gradient","accent-orange-gradient","accent-green-gradient","accent-blue-gradient","accent-purple-gradient","accent-cyan-gradient"];
    var courseID = [];
    $('.courseid').each(function(){
        courseID.push($(this).text());
    });

    var ind = 0;
    for(var i=0; i<courseID.length; i++) {
        var x = courseID[i].trim();
        $('.'+x).addClass(colours[ind]);
        ind++;
    }
});

var classTT;
var facultyTT;
var facname = $('#facname').text();
$.ajax({
    type: "GET",
    contentType: "application/json",
    url: '/api/facultyTT?name='+facname,
    dataType:"JSON",
    success: function (data) {
        facultyTT = data;
    },
    error: function (e) {
        console.log("ERROR: ", e);
    }
});

var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

$('#search').click(function(){
    $('.slots').html('');
    var clID = $('#class').val();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: '/api/classTT?id='+clID,
        dataType:"JSON",
        success: function (data) {
            classTT = data;
            checkFree();
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });

    function checkFree() {
        var freeslotsforclass = [];
        var i = 0, j = 0;
        classTT.forEach(tt => {
            j = 0;
            tt.forEach(tt2 => {
                if(!tt2.day) {
                    freeslotsforclass.push([i,j]);
                }
                j++;
            });
            i++;
        });

        //alert(freeslotsforclass);

        var freeslotsforfaculty = [];
        var i=0, j=0;

        facultyTT.forEach(tt => {
            j = 0;
            tt.forEach(tt2 => {
                if(!tt2) {
                    freeslotsforfaculty.push([i,j]);
                }
                j++;
            });
            i++;
        });

        //alert(freeslotsforfaculty);

        var freeslots = [];

        for(i=0; i<freeslotsforclass.length; i++) {
            for(j=0; j<freeslotsforfaculty.length; j++) {
                if(freeslotsforclass[i][0] == freeslotsforfaculty[j][0] && freeslotsforclass[i][1] == freeslotsforfaculty[j][1]) {
                    freeslots.push([freeslotsforclass[i][0],freeslotsforfaculty[j][1]]);
                }
            }
        }

        

        $('.slots').append('<br><br><br><h5> Compatible Slots </h5>');
        for(i=0; i<freeslots.length; i++) {
            var day = days[freeslots[i][0]];
            var slot = freeslots[i][1];
            $('.slots').append('<span class="gradient">' + day + ', slot ' + slot + '</span>');
        }
        
    }

});

$('#search2').click(function(){
    var substitutes = [];
    $('.substitute').html('');
    var formData = {};
    formData.id = $('#class').val();
    formData.day = days.indexOf($('#day').val());
    formData.slot = $('#slot').val()-1;
    formData.name = $('#course').val();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/api/substitute',
        data: JSON.stringify(formData),
        success: function (data) {
            //alert(data);
            substitutes = data;
            setSubstitute();
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });

    function setSubstitute() {
        $('.substitute').append('<br><br><br><h5> Compatible Substitute Teachers </h5>');
        for(var i=0; i<substitutes.length; i++) {
            $('.substitute').append('<span class="gradient">' + substitutes[i] + '</span> <br>');
        }
    }
});