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
        alert("Error!")
        console.log("ERROR: ", e);
    }
});


$('#search').click(function(){
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
            alert("Error!")
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

        var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        $('.slots').append('<br><br><br><h5> Compatible Slots </h5>');
        for(i=0; i<freeslots.length; i++) {
            var day = days[freeslots[i][0]];
            var slot = freeslots[i][1];
            $('.slots').append('<span class="gradient">' + day + ', slot ' + slot + '</span>');
        }
        
    }

});