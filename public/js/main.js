/* Egen JavaScript - Moment 2 - DT162G, JavaScript-baserad webbutveckling 
Skapad av Frida Lazzari */

// när sidan hämtas laddar funktionen (hämta kurser) 
window.onload = loadCourses();

// använder AJAX anrop & jQuery för att läsa in kurser från JSON
function loadCourses() {
    $.getJSON("http://localhost:3000/courses", function(data) {

        // rensa listan 
        $("#courselist").html("");

        //loop genom hela listan som sen skrivs ut till id courselist
        for (var i = 0; i < data.length; i++) {
            $("#courselist").append("<tr><td>" + data[i].id + "</td><td>" + data[i].courseId + "</td><td>" + data[i].courseName + "</td><td>(" + data[i].coursePeriod + ")</td><td><span onclick='deleteCourse(" + data[i].id + ")'>Radera</span></td></tr>");
        }
    });

}

// AJAX anrop för att radera en specifik kurs genom id 
function deleteCourse(id) {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/courses/delete/" + id
    }).done(function(response) {
        console.log(response);

        //ladda om listan 
        loadCourses();
    });
}