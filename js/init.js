// Initialization - Event listeners and startup

// Initialize on page load
displayCourses();
updateStats();

// Enter key to add course
document
  .getElementById("courseName")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addCourse();
    }
  });
