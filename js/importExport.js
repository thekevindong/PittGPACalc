// Import/Export - .txt file parsing and generation

// Grade label to grade value mapping
var GRADE_MAP = {
  "A+": 4.00, "A": 4.00, "A-": 3.75,
  "B+": 3.25, "B": 3.00, "B-": 2.75,
  "C+": 2.25, "C": 2.00, "C-": 1.75,
  "D+": 1.25, "D": 1.00, "D-": 0.75,
  "F": 0.00, "S": "S", "NC": "NC", "T": "T"
};

/**
 * Export format:
 * === Profile: Kevin's Grades ===
 *
 * --- (3) Fall 2025 - Sophomore ---
 * CS 0441 - Discrete Structures for CS | 3 credits | A
 * CS 1501 - Algorithms and Data Structures II | 3 credits | A
 * ...
 */
function exportTxt() {
  if (courses.length === 0) {
    alert("No courses to export!");
    return;
  }

  var profiles = getProfiles() || [];
  var activeId = getActiveProfileId();
  var profile = profiles.find(function (p) { return p.id === activeId; });
  var profileName = profile ? profile.name : "My Grades";

  // Group by semester
  var semesterGroups = {};
  courses.forEach(function (course) {
    var sem = course.semester || "Courses";
    if (!semesterGroups[sem]) semesterGroups[sem] = [];
    semesterGroups[sem].push(course);
  });

  var lines = [];
  lines.push("=== Profile: " + profileName + " ===");
  lines.push("");

  Object.keys(semesterGroups).sort().forEach(function (semester) {
    lines.push("--- " + semester + " ---");
    semesterGroups[semester].forEach(function (course) {
      lines.push(course.name + " | " + course.credits + " credits | " + course.gradeLabel);
    });
    lines.push("");
  });

  // Create and download file
  var blob = new Blob([lines.join("\n")], { type: "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = profileName.replace(/[^a-zA-Z0-9]/g, "_") + "_grades.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import .txt file
 * Supports the export format above:
 *   --- Semester Name ---
 *   Course Name | Credits credits | Grade
 *
 * Also supports simpler formats:
 *   Course Name | Credits | Grade
 *   Course Name, Credits, Grade
 */
function importTxt(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function (e) {
    var text = e.target.result;
    var lines = text.split("\n");
    var imported = [];
    var currentSemester = "Courses";

    lines.forEach(function (line) {
      line = line.trim();
      if (!line) return;

      // Skip profile header
      if (line.match(/^===.*===$/)) return;

      // Semester header: --- Semester Name ---
      var semMatch = line.match(/^---\s*(.+?)\s*---$/);
      if (semMatch) {
        currentSemester = semMatch[1];
        return;
      }

      // Course line: Name | Credits credits | Grade
      // or: Name | Credits | Grade
      // or: Name, Credits, Grade
      var parts;
      if (line.indexOf("|") !== -1) {
        parts = line.split("|").map(function (s) { return s.trim(); });
      } else if (line.indexOf(",") !== -1) {
        parts = line.split(",").map(function (s) { return s.trim(); });
      } else {
        return; // skip unrecognized lines
      }

      if (parts.length < 3) return;

      var name = parts[0];
      var creditsStr = parts[1].replace(/[^0-9]/g, "");
      var credits = parseInt(creditsStr);
      var gradeLabel = parts[2].trim();

      if (!name || !credits || credits < 1) return;

      // Look up grade value
      var gradeValue = GRADE_MAP[gradeLabel];
      if (gradeValue === undefined) {
        // Try case-insensitive
        var upperLabel = gradeLabel.toUpperCase();
        gradeValue = GRADE_MAP[upperLabel];
        if (gradeValue !== undefined) gradeLabel = upperLabel;
      }
      if (gradeValue === undefined) return; // skip unrecognized grades

      imported.push({
        name: name,
        credits: credits,
        grade: gradeValue,
        gradeLabel: gradeLabel,
        semester: currentSemester
      });
    });

    if (imported.length === 0) {
      alert("No valid courses found in the file. Make sure the format is:\nCourse Name | Credits credits | Grade\n\nGrouped under semester headers like:\n--- Fall 2025 ---");
      event.target.value = "";
      return;
    }

    var action = confirm(
      "Found " + imported.length + " courses.\n\n" +
      "OK = Replace all current courses\n" +
      "Cancel = Add to existing courses"
    );

    if (action) {
      // Replace
      courses.splice(0, courses.length);
      imported.forEach(function (c) { courses.push(c); });
    } else {
      // Append
      imported.forEach(function (c) { courses.push(c); });
    }

    displayCourses();
    updateStats();
    saveCourses();

    alert("Successfully imported " + imported.length + " courses!");
    event.target.value = ""; // reset file input
  };

  reader.readAsText(file);
}
