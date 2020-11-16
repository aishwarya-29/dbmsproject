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