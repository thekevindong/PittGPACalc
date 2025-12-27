// Course Operations - Add, Edit, Remove, Clear

function addCourse() {
  const courseName = document.getElementById("courseName").value.trim();
  const credits = parseInt(document.getElementById("credits").value);
  const gradeSelect = document.getElementById("grade");
  const gradeValue = parseFloat(gradeSelect.value);
  const gradeLabel = gradeSelect.options[gradeSelect.selectedIndex].text;
  const semester = document.getElementById("semester").value.trim();

  if (!courseName) {
    alert("Please enter a course name!");
    return;
  }

  if (!credits || credits < 1) {
    alert("Please enter valid credits!");
    return;
  }

  const course = {
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

    // Reset the button
    const addBtn = document.querySelector(".btn-add");
    addBtn.textContent = "+ Add Course";
    addBtn.style.background = "#4ecca3";
  } else {
    courses.push(course);
  }

  displayCourses();
  updateStats();

  document.getElementById("courseName").value = "";
  document.getElementById("credits").value = "3";
  document.getElementById("grade").selectedIndex = 0;
  document.getElementById("semester").value = "";
}

function removeCourse(index) {
  courses.splice(index, 1);
  displayCourses();
  updateStats();
}

function editCourse(index) {
  const course = courses[index];
  document.getElementById("courseName").value = course.name;
  document.getElementById("credits").value = course.credits;
  document.getElementById("semester").value =
    course.semester === "Courses" ? "" : course.semester;

  // Set the grade select to match the grade value
  const gradeSelect = document.getElementById("grade");
  for (let i = 0; i < gradeSelect.options.length; i++) {
    if (
      parseFloat(gradeSelect.options[i].value) === course.grade &&
      gradeSelect.options[i].text === course.gradeLabel
    ) {
      gradeSelect.selectedIndex = i;
      break;
    }
  }

  // Store the index being edited
  window.editingIndex = index;

  // Change the Add button to Save
  const addBtn = document.querySelector(".btn-add");
  addBtn.textContent = "💾 Save Changes";
  addBtn.style.background = "#FFB81C";

  // Scroll to input
  document.getElementById("courseName").focus();
}

function clearAllCourses() {
  if (courses.length === 0) {
    alert("No courses to clear!");
    return;
  }

  if (
    confirm(
      "Are you sure you want to remove all " + courses.length + " courses?"
    )
  ) {
    courses.splice(0, courses.length);
    displayCourses();
    updateStats();
    document.getElementById("resultsArea").innerHTML = "";
  }
}
