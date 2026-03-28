// Data Management - Profile-aware course storage

// Grade mapping for non-numeric grades
var NON_GPA_GRADES = ["S", "NC", "T"];

function isNonGPAGrade(grade) {
  return typeof grade === "string" && NON_GPA_GRADES.indexOf(grade) !== -1;
}

// Default courses for brand new users (first profile only)
var defaultCourses = [
  { name: "CMPINF 0401 - Intermediate Programming", credits: 4, grade: 4.0, gradeLabel: "A+", semester: "Fall 2024" },
  { name: "CS 0441 - Discrete Structures for CS", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Fall 2024" },
  { name: "CS 0445 - Data Structures and Algorithms I", credits: 3, grade: 4.0, gradeLabel: "A+", semester: "Spring 2025" },
  { name: "CS 0447 - Computer Organization and Assembly Language", credits: 3, grade: 3.75, gradeLabel: "A-", semester: "Spring 2025" },
  { name: "CS 1501 - Data Structures and Algorithms II", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Fall 2025" },
  { name: "CS 1520 - Programming Languages for Web Applications", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Fall 2025" },
  { name: "CS 1530 - Software Engineering", credits: 3, grade: 4.0, gradeLabel: "A+", semester: "Fall 2025" },
  { name: "CS 0007 - Introduction to Computer Programming", credits: 3, grade: 4.0, gradeLabel: "A+", semester: "Courses" },
  { name: "CS 0012 - Introduction to Computing for Humanities", credits: 4, grade: 4.0, gradeLabel: "A", semester: "Courses" },
  { name: "CS 0134 - Introduction to Website Design & Development", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Courses" },
  { name: "CS 0334 - Intermediate Website Design & Development", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Courses" },
  { name: "CS 0590 - Social Implications of Computing Technology", credits: 3, grade: 4.0, gradeLabel: "A", semester: "Spring 2025" },
  { name: "CMPINF 0010 - Big Ideas in Computing & Information", credits: 4, grade: 4.0, gradeLabel: "A+", semester: "Fall 2024" },
];

// Profile management
function getProfiles() {
  return JSON.parse(localStorage.getItem("pittGPA_profiles")) || null;
}

function saveProfiles(profiles) {
  localStorage.setItem("pittGPA_profiles", JSON.stringify(profiles));
}

function getActiveProfileId() {
  return localStorage.getItem("pittGPA_activeProfile") || null;
}

function setActiveProfileId(id) {
  localStorage.setItem("pittGPA_activeProfile", id);
}

function getCoursesKey(profileId) {
  return "pittGPA_courses_" + profileId;
}

// Initialize profiles system - migrate old data if needed
function initProfiles() {
  var profiles = getProfiles();

  if (!profiles) {
    // First time or migration needed
    profiles = [];
    var profileId = "profile_" + Date.now();

    // Check for old localStorage key (migration from old version)
    var oldData = localStorage.getItem("pittGPACalc_courses");
    var initialCourses;

    if (oldData) {
      initialCourses = JSON.parse(oldData);
    } else {
      initialCourses = defaultCourses;
    }

    profiles.push({ id: profileId, name: "My Grades" });
    saveProfiles(profiles);
    setActiveProfileId(profileId);
    localStorage.setItem(getCoursesKey(profileId), JSON.stringify(initialCourses));

    // Keep old key around for backwards compat
    if (oldData) {
      localStorage.setItem("pittGPACalc_courses", oldData);
    }
  }

  if (!getActiveProfileId() && profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
  }

  return profiles;
}

// Load courses for current active profile
function loadCourses() {
  var profileId = getActiveProfileId();
  if (!profileId) return [];
  var data = localStorage.getItem(getCoursesKey(profileId));
  return data ? JSON.parse(data) : [];
}

// Save courses for current active profile
function saveCourses() {
  var profileId = getActiveProfileId();
  if (!profileId) return;
  localStorage.setItem(getCoursesKey(profileId), JSON.stringify(courses));

  // Keep old key in sync if this is the first profile (backwards compat)
  var profiles = getProfiles();
  if (profiles && profiles.length > 0 && profileId === profiles[0].id) {
    localStorage.setItem("pittGPACalc_courses", JSON.stringify(courses));
  }
}

// Initialize
var profiles = initProfiles();
var courses = loadCourses();
