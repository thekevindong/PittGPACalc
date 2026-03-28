// Calculations - GPA and stats calculations (S/NC/T aware)

function updateStats() {
  var totalQualityPoints = 0;
  var totalCredits = 0;
  var totalAllCredits = 0; // includes S/NC/T

  courses.forEach(function (course) {
    if (isNonGPAGrade(course.grade)) {
      // S/NC/T: count credits for display but not for GPA
      if (course.grade === "S" || course.grade === "T") {
        totalAllCredits += course.credits;
      }
      // NC doesn't add credits either
    } else {
      totalQualityPoints += course.grade * course.credits;
      totalCredits += course.credits;
      totalAllCredits += course.credits;
    }
  });

  var gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  document.getElementById("currentGPA").textContent = gpa.toFixed(3);
  document.getElementById("totalCredits").textContent = totalAllCredits;
  document.getElementById("courseCount").textContent = courses.length;
  document.getElementById("qualityPoints").textContent = totalQualityPoints.toFixed(2);
}

function showResults() {
  if (courses.length === 0) {
    alert("Please add at least one course!");
    return;
  }

  var totalQualityPoints = 0;
  var totalCredits = 0;
  var totalAllCredits = 0;
  var sncCount = 0;
  var transferCount = 0;

  courses.forEach(function (course) {
    if (isNonGPAGrade(course.grade)) {
      if (course.grade === "S") { sncCount++; totalAllCredits += course.credits; }
      else if (course.grade === "NC") { sncCount++; }
      else if (course.grade === "T") { transferCount++; totalAllCredits += course.credits; }
    } else {
      totalQualityPoints += course.grade * course.credits;
      totalCredits += course.credits;
      totalAllCredits += course.credits;
    }
  });

  var gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  var extraInfo = "";
  if (sncCount > 0 || transferCount > 0) {
    extraInfo = '<div style="margin-top: 15px; color: #aaa; font-size: 0.7rem;">';
    if (sncCount > 0) extraInfo += sncCount + " S/NC course" + (sncCount > 1 ? "s" : "") + " excluded from GPA. ";
    if (transferCount > 0) extraInfo += transferCount + " transfer course" + (transferCount > 1 ? "s" : "") + " excluded from GPA.";
    extraInfo += "</div>";
  }

  var resultsArea = document.getElementById("resultsArea");
  resultsArea.innerHTML =
    '<div class="results-box">' +
    '<div class="results-title">YOUR FINAL GPA</div>' +
    '<div class="gpa-big">' + gpa.toFixed(3) + "</div>" +
    '<div class="gpa-label">Out of 4.000</div>' +
    '<div class="results-grid">' +
    '<div class="result-item">' +
    '<div class="result-label">Credits</div>' +
    '<div class="result-value">' + totalAllCredits + "</div>" +
    "</div>" +
    '<div class="result-item">' +
    '<div class="result-label">Quality Points</div>' +
    '<div class="result-value">' + totalQualityPoints.toFixed(2) + "</div>" +
    "</div>" +
    '<div class="result-item">' +
    '<div class="result-label">Courses</div>' +
    '<div class="result-value">' + courses.length + "</div>" +
    "</div>" +
    "</div>" +
    extraInfo +
    "</div>";

  resultsArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
