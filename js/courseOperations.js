// Course Operations - Add, Edit, Remove, Clear (S/NC/T aware)

function addCourse() {
  var courseName = document.getElementById("courseName").value.trim();
  var credits = parseInt(document.getElementById("credits").value);
  var gradeSelect = document.getElementById("grade");
  var rawValue = gradeSelect.value;
  var gradeLabel = gradeSelect.options[gradeSelect.selectedIndex].text;
  var semester = document.getElementById("semester").value.trim();

  if (!courseName) {
    alert("Please enter a course name!");
    return;
  }

  if (!credits || credits < 1) {
    alert("Please enter valid credits!");
    return;
  }

  // Handle S/NC/T as string grades, others as numeric
  var gradeValue;
  if (rawValue === "S" || rawValue === "NC" || rawValue === "T") {
    gradeValue = rawValue;
  } else {
    gradeValue = parseFloat(rawValue);
  }

  var course = {
    name: courseName,
    credits: credits,
    grade: gradeValue,
    gradeLabel: gradeLabel,
    semester: semester || "Courses",
  };

  // Check if we're editing an existing course
  if (window.editingIndex !== undefined) {
    courses[window.editingIndex] = course;
    window.editingIndex = undefined;

    var addBtn = document.querySelector(".btn-add");
    addBtn.textContent = "+ Add Course";
    addBtn.style.background = "#4ecca3";
  } else {
    courses.push(course);
  }

  displayCourses();
  updateStats();
  saveCourses();

  document.getElementById("courseName").value = "";
  document.getElementById("credits").value = "3";
  document.getElementById("grade").selectedIndex = 0;
  document.getElementById("semester").value = "";
}

function removeCourse(index) {
  courses.splice(index, 1);
  displayCourses();
  updateStats();
  saveCourses();
}

function editCourse(index) {
  var course = courses[index];
  document.getElementById("courseName").value = course.name;
  document.getElementById("credits").value = course.credits;
  document.getElementById("semester").value =
    course.semester === "Courses" ? "" : course.semester;

  // Set the grade select to match
  var gradeSelect = document.getElementById("grade");
  for (var i = 0; i < gradeSelect.options.length; i++) {
    var optVal = gradeSelect.options[i].value;
    var optText = gradeSelect.options[i].text;

    if (isNonGPAGrade(course.grade)) {
      // Match string grades by value
      if (optVal === course.grade) {
        gradeSelect.selectedIndex = i;
        break;
      }
    } else {
      // Match numeric grades by value + label
      if (parseFloat(optVal) === course.grade && optText === course.gradeLabel) {
        gradeSelect.selectedIndex = i;
        break;
      }
    }
  }

  window.editingIndex = index;

  var addBtn = document.querySelector(".btn-add");
  addBtn.textContent = "💾 Save Changes";
  addBtn.style.background = "#FFB81C";

  document.getElementById("courseName").focus();
}

function clearAllCourses() {
  if (courses.length === 0) {
    alert("No courses to clear!");
    return;
  }

  if (confirm("Are you sure you want to remove all " + courses.length + " courses?")) {
    courses.splice(0, courses.length);
    displayCourses();
    updateStats();
    saveCourses();
    document.getElementById("resultsArea").innerHTML = "";
  }
}
