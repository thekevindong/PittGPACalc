// Calculations - GPA and stats calculations

function updateStats() {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  courses.forEach(function (course) {
    totalQualityPoints += course.grade * course.credits;
    totalCredits += course.credits;
  });

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  document.getElementById("currentGPA").textContent = gpa.toFixed(3);
  document.getElementById("totalCredits").textContent = totalCredits;
  document.getElementById("courseCount").textContent = courses.length;
  document.getElementById("qualityPoints").textContent =
    totalQualityPoints.toFixed(2);
}

function showResults() {
  if (courses.length === 0) {
    alert("Please add at least one course!");
    return;
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  courses.forEach(function (course) {
    totalQualityPoints += course.grade * course.credits;
    totalCredits += course.credits;
  });

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  const resultsArea = document.getElementById("resultsArea");
  resultsArea.innerHTML =
    '<div class="results-box">' +
    '<div class="results-title">YOUR FINAL GPA</div>' +
    '<div class="gpa-big">' +
    gpa.toFixed(3) +
    "</div>" +
    '<div class="gpa-label">Out of 4.000</div>' +
    '<div class="results-grid">' +
    '<div class="result-item">' +
    '<div class="result-label">Credits</div>' +
    '<div class="result-value">' +
    totalCredits +
    "</div>" +
    "</div>" +
    '<div class="result-item">' +
    '<div class="result-label">Quality Points</div>' +
    '<div class="result-value">' +
    totalQualityPoints.toFixed(2) +
    "</div>" +
    "</div>" +
    '<div class="result-item">' +
    '<div class="result-label">Courses</div>' +
    '<div class="result-value">' +
    courses.length +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  resultsArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
