/* NodeJS JavaScript - Moment 2 - DT162G, JavaScript-baserad webbutveckling 
Skapad av Frida Lazzari */

/* bibliotek som ska importeras */
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var jsonfile = require("jsonfile");

/* läsa in data från JSON-fil */
var file = "courses.json";
var courses = [];

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        // test så att det fungerar
        // console.log(obj),
        courses = obj;
    }
});

/* skapar instans av express biblioteket */
var app = express();


/* body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* skapar statisk sökväg */
app.use(express.static(path.join(__dirname, 'public')));

/* REST-api för kurser */
// alla kurser
app.get("/courses", function(req, res) {
    res.send(courses);
});

// en specifik kurs
app.get("/courses/:id", function(req, res) {
    var Id = req.params.id;

    // hitta vilken kurs som motsvarar id
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].id == Id) {
            res.send(courses[i]);
        }
    }
});

// lägga till en ny kurs 
//* mest för egen del (testa lägga till och radera på ett enkelt sätt!)
app.post("/courses/add", function(req, res) {
    //hämta nytt id (nästa id)
    var newId = getNextId(courses);

    // skapar nytt objekt
    var newCourse = {
            id: newId,
            courseId: req.body.courseId,
            courseName: req.body.courseName,
            coursePeriod: req.body.coursePeriod,
        }
        // lägga till objekt i arrayen 
    courses.push(newCourse);

    // anropa funktionen spara fil efter förändring
    saveFile();

    res.redirect("/consume_courses.html");
});

// hitta högsta id (vilket är nästa?)
function getNextId(arr) {
    var max = 0;

    for (var i = 0; i < arr.length; i++) {
        var current = parseInt(arr[i].id);
        if (current > max) { max = current; }
    }
    return max + 1;
};

// ta bort en specifik kurs
app.delete("/courses/delete/:id", function(req, res) {
    var deleteId = req.params.id;

    // hitta vilken kurs som motsvarar id
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].id == deleteId) {
            courses.splice(i, 1);
        }
    }
    // anropa funktionen spara fil efter förändring
    saveFile();

    res.send({ "message": "Raderar kurs med id " + deleteId });
});

// spara JSON-fil 
function saveFile() {
    jsonfile.writeFile(file, courses, function(err) {
        console.log(err);
    })
};

// kurser hårdkodade i JSON (eget test initialt)
/*var courses = [{
        "id": 1,
        "courseId": "DT173G",
        "courseName": "Webbutveckling III",
        "coursePeriod": 1
    },
    {
        "id": 2,
        "courseId": "IK060G",
        "courseName": "Projektledning",
        "coursePeriod": 1
    },
    {
        "id": 3,
        "courseId": "DT071G",
        "courseName": "Programmering i C#.NET",
        "coursePeriod": 2
    },
    {
        "id": 4,
        "courseId": "DT068G",
        "courseName": "Webbanvändbarhet",
        "coursePeriod": 2
    },
    {
        "id": 5,
        "courseId": "DT102G",
        "courseName": "ASP.NET med C#",
        "coursePeriod": 3
    },
    {
        "id": 6,
        "courseId": "IG021G",
        "courseName": "Affärsplaner och kommersialisering",
        "coursePeriod": 3
    },
    {
        "id": 7,
        "courseId": "DT080G",
        "courseName": "Självständigt arbete",
        "coursePeriod": 4
    },
    {
        "id": 8,
        "courseId": "DT148G",
        "courseName": "Webbutveckling för mobila enheter",
        "coursePeriod": "4"
    }
]*/

// anslutningsport
var port = 3000;

// starta server
app.listen(port, function() {
    console.log("Servern är startad på port 3000");
});