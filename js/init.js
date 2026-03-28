// Initialization - Event listeners and startup

// Render profile tabs
renderProfileTabs();

// Initialize display
displayCourses();
updateStats();

// Enter key to add course
document.getElementById("courseName").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addCourse();
  }
});

// Enter key in profile modal
document.getElementById("profileNameInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    saveProfile();
  }
});
