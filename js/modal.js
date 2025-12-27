// Modal Functions - Grade scale modal

function openGradeScale() {
  document.getElementById("gradeModal").style.display = "block";
}

function closeGradeScale() {
  document.getElementById("gradeModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
  var modal = document.getElementById("gradeModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
