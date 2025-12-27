// Display Functions - Render courses by semester

function displayCourses() {
  const container = document.getElementById("coursesContainer");

  if (courses.length === 0) {
    container.innerHTML =
      '<div class="semester-section"><p style="color: #666; text-align: center;">No courses added yet</p></div>';
    return;
  }

  // Group courses by semester
  const semesterGroups = {};
  courses.forEach(function (course, index) {
    const sem = course.semester || "Courses";
    if (!semesterGroups[sem]) {
      semesterGroups[sem] = [];
    }
    semesterGroups[sem].push({ course: course, index: index });
  });

  let html = "";

  // Display each semester group
  Object.keys(semesterGroups)
    .sort()
    .forEach(function (semester) {
      const group = semesterGroups[semester];

      // Calculate semester stats
      let semCredits = 0;
      let semQP = 0;
      group.forEach(function (item) {
        semCredits += item.course.credits;
        semQP += item.course.grade * item.course.credits;
      });
      const semGPA = semCredits > 0 ? (semQP / semCredits).toFixed(3) : "0.000";

      html += '<div class="semester-section">';
      html += '<div class="semester-header">';
      html += '<div class="semester-title">' + semester + "</div>";
      html += '<div class="semester-stats">';
      html +=
        '<div class="semester-stat">GPA: <span>' + semGPA + "</span></div>";
      html +=
        '<div class="semester-stat">Credits: <span>' +
        semCredits +
        "</span></div>";
      html +=
        '<div class="semester-stat">QP: <span>' +
        semQP.toFixed(2) +
        "</span></div>";
      html += "</div>";
      html += "</div>";

      group.forEach(function (item) {
        const course = item.course;
        const index = item.index;
        html += '<div class="course-item">';
        html += '<div class="course-info">';
        html += "<h3>" + course.name + "</h3>";
        html +=
          "<p>" +
          course.credits +
          " credits • Quality Points: " +
          (course.grade * course.credits).toFixed(2) +
          "</p>";
        html += "</div>";
        html += '<div style="display: flex; align-items: center;">';
        html += '<span class="course-grade">' + course.gradeLabel + "</span>";
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
