// Display Functions - Render courses by semester (S/NC/T aware)

function displayCourses() {
  var container = document.getElementById("coursesContainer");

  if (courses.length === 0) {
    container.innerHTML =
      '<div class="semester-section"><p style="color: #666; text-align: center;">No courses added yet</p></div>';
    return;
  }

  // Group courses by semester
  var semesterGroups = {};
  courses.forEach(function (course, index) {
    var sem = course.semester || "Courses";
    if (!semesterGroups[sem]) {
      semesterGroups[sem] = [];
    }
    semesterGroups[sem].push({ course: course, index: index });
  });

  var html = "";

  Object.keys(semesterGroups)
    .sort()
    .forEach(function (semester) {
      var group = semesterGroups[semester];

      // Calculate semester stats (exclude S/NC/T from GPA but count S/T credits)
      var semGPACredits = 0;
      var semAllCredits = 0;
      var semQP = 0;
      group.forEach(function (item) {
        if (isNonGPAGrade(item.course.grade)) {
          if (item.course.grade === "S" || item.course.grade === "T") {
            semAllCredits += item.course.credits;
          }
        } else {
          semGPACredits += item.course.credits;
          semAllCredits += item.course.credits;
          semQP += item.course.grade * item.course.credits;
        }
      });
      var semGPA =
        semGPACredits > 0 ? (semQP / semGPACredits).toFixed(3) : "N/A";

      html += '<div class="semester-section">';
      html += '<div class="semester-header">';
      html += '<div class="semester-title">' + semester + "</div>";
      html += '<div class="semester-stats">';
      html +=
        '<div class="semester-stat">GPA: <span>' + semGPA + "</span></div>";
      html +=
        '<div class="semester-stat">Credits: <span>' +
        semAllCredits +
        "</span></div>";
      html +=
        '<div class="semester-stat">QP: <span>' +
        semQP.toFixed(2) +
        "</span></div>";
      html += "</div>";
      html += "</div>";

      group.forEach(function (item) {
        var course = item.course;
        var index = item.index;
        var isNoGPA = isNonGPAGrade(course.grade);
        var qpDisplay = isNoGPA
          ? "0.00"
          : (course.grade * course.credits).toFixed(2);
        var gradeClass = isNoGPA ? "course-grade-noweight" : "course-grade";

        html += '<div class="course-item">';
        html += '<div class="course-info">';
        html += "<h3>" + course.name + "</h3>";
        html +=
          "<p>" +
          course.credits +
          " credits • Quality Points: " +
          qpDisplay +
          "</p>";
        html += "</div>";
        html += '<div style="display: flex; align-items: center;">';
        html +=
          '<span class="' + gradeClass + '">' + course.gradeLabel + "</span>";
        html +=
          '<button class="btn btn-edit" onclick="editCourse(' +
          index +
          ')">Edit</button>';
        html +=
          '<button class="btn btn-remove" onclick="removeCourse(' +
          index +
          ')">Remove</button>';
        html += "</div>";
        html += "</div>";
      });

      html += "</div>";
    });

  container.innerHTML = html;
}
