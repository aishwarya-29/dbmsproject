var facultylist =[];
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
    },1000);


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

$('#btnSearch').click(function(){
    $('#facform').submit();
});
