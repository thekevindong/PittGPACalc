// Modal Functions - Grade scale modal + profile modal + weighted calc modal

function openGradeScale() {
  document.getElementById("gradeModal").style.display = "block";
}

function closeGradeScale() {
  document.getElementById("gradeModal").style.display = "none";
}

// Close modals when clicking outside
window.onclick = function (event) {
  var gradeModal = document.getElementById("gradeModal");
  var profileModal = document.getElementById("profileModal");
  var weightedModal = document.getElementById("weightedModal");
  if (event.target === gradeModal) {
    gradeModal.style.display = "none";
  }
  if (event.target === profileModal) {
    profileModal.style.display = "none";
  }
  if (event.target === weightedModal) {
    weightedModal.style.display = "none";
  }
};
