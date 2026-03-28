// Profile Management - Tabs, switching, CRUD

var profileModalMode = "add"; // "add" or "edit"
var editingProfileId = null;

function renderProfileTabs() {
  var profiles = getProfiles() || [];
  var activeId = getActiveProfileId();
  var container = document.getElementById("profileTabs");
  var html = "";

  profiles.forEach(function (p) {
    var activeClass = p.id === activeId ? " active" : "";
    html += '<div class="profile-tab' + activeClass + '" data-id="' + p.id + '" onclick="switchProfile(\'' + p.id + '\')">';
    html += '<span class="profile-tab-name">' + p.name + '</span>';
    html += '<span class="edit-icon" onclick="event.stopPropagation(); openProfileModal(\'edit\', \'' + p.id + '\')">✏️</span>';
    html += '</div>';
  });

  container.innerHTML = html;
}

function switchProfile(profileId) {
  // Save current courses before switching
  saveCourses();

  // Cancel any in-progress edit
  if (window.editingIndex !== undefined) {
    window.editingIndex = undefined;
    var addBtn = document.querySelector(".btn-add");
    if (addBtn) {
      addBtn.textContent = "+ Add Course";
      addBtn.style.background = "#4ecca3";
    }
  }

  setActiveProfileId(profileId);
  courses = loadCourses();
  renderProfileTabs();
  displayCourses();
  updateStats();
  document.getElementById("resultsArea").innerHTML = "";
}

function openProfileModal(mode, profileId) {
  profileModalMode = mode;
  editingProfileId = profileId || null;

  var titleEl = document.getElementById("profileModalTitle");
  var input = document.getElementById("profileNameInput");
  var btn = document.getElementById("profileModalBtn");
  var delBtn = document.getElementById("profileDeleteBtn");

  if (mode === "edit") {
    var profiles = getProfiles() || [];
    var profile = profiles.find(function (p) { return p.id === profileId; });
    titleEl.textContent = "Edit Profile";
    input.value = profile ? profile.name : "";
    btn.textContent = "Save";
    delBtn.style.display = "inline-block";
  } else {
    titleEl.textContent = "New Profile";
    input.value = "";
    btn.textContent = "Create";
    delBtn.style.display = "none";
  }

  document.getElementById("profileModal").style.display = "block";
  input.focus();
}

function closeProfileModal() {
  document.getElementById("profileModal").style.display = "none";
  editingProfileId = null;
}

function saveProfile() {
  var name = document.getElementById("profileNameInput").value.trim();
  if (!name) {
    alert("Please enter a profile name!");
    return;
  }

  var profiles = getProfiles() || [];

  if (profileModalMode === "edit" && editingProfileId) {
    // Update existing profile name
    profiles = profiles.map(function (p) {
      if (p.id === editingProfileId) {
        return { id: p.id, name: name };
      }
      return p;
    });
    saveProfiles(profiles);
  } else {
    // Create new profile
    var newId = "profile_" + Date.now();
    profiles.push({ id: newId, name: name });
    saveProfiles(profiles);
    // Save current profile first, then switch to new empty one
    saveCourses();
    setActiveProfileId(newId);
    localStorage.setItem(getCoursesKey(newId), JSON.stringify([]));
    courses = [];
  }

  closeProfileModal();
  renderProfileTabs();
  displayCourses();
  updateStats();
  document.getElementById("resultsArea").innerHTML = "";
}

function deleteProfile() {
  if (!editingProfileId) return;

  var profiles = getProfiles() || [];
  if (profiles.length <= 1) {
    alert("You can't delete your only profile!");
    return;
  }

  var profile = profiles.find(function (p) { return p.id === editingProfileId; });
  if (!confirm('Delete profile "' + profile.name + '" and all its courses?')) return;

  // Remove the profile's course data
  localStorage.removeItem(getCoursesKey(editingProfileId));

  // Remove from profiles list
  profiles = profiles.filter(function (p) { return p.id !== editingProfileId; });
  saveProfiles(profiles);

  // Switch to another profile if we deleted the active one
  if (getActiveProfileId() === editingProfileId) {
    setActiveProfileId(profiles[0].id);
    courses = loadCourses();
  }

  closeProfileModal();
  renderProfileTabs();
  displayCourses();
  updateStats();
  document.getElementById("resultsArea").innerHTML = "";
}
