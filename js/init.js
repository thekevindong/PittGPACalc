// Initialization - Event listeners and startup

// Toolbar toggle
function toggleToolbar() {
  var toolbar = document.getElementById("toolbar");
  var toggle = document.getElementById("toolbarToggle");
  toolbar.classList.toggle("collapsed");
  toggle.textContent = toolbar.classList.contains("collapsed")
    ? "☰ Menu"
    : "✕ Close";
}

// Start collapsed so it doesn't clutter the screen
document.getElementById("toolbar").classList.add("collapsed");

// Render profile tabs
renderProfileTabs();

// Initialize display
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

// Enter key in profile modal
document
  .getElementById("profileNameInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveProfile();
    }
  });
