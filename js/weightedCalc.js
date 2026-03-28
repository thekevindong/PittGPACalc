// Weighted Grade Calculator - Modal-based tool

var weightedItems = [];

function openWeightedCalc() {
  document.getElementById("weightedModal").style.display = "block";
  if (weightedItems.length === 0) {
    // Start with 3 empty rows
    weightedItems = [
      { category: "", weight: "", grade: "" },
      { category: "", weight: "", grade: "" },
      { category: "", weight: "", grade: "" },
    ];
  }
  renderWeightedItems();
}

function closeWeightedCalc() {
  document.getElementById("weightedModal").style.display = "none";
}

function addWeightedRow() {
  weightedItems.push({ category: "", weight: "", grade: "" });
  renderWeightedItems();
  // Focus the new row's weight field
  var rows = document.querySelectorAll(".weighted-row-weight");
  if (rows.length > 0) rows[rows.length - 1].focus();
}

function removeWeightedItem(index) {
  weightedItems.splice(index, 1);
  if (weightedItems.length === 0) {
    weightedItems.push({ category: "", weight: "", grade: "" });
  }
  renderWeightedItems();
  document.getElementById("weightedResult").style.display = "none";
}

function clearWeightedItems() {
  weightedItems = [
    { category: "", weight: "", grade: "" },
    { category: "", weight: "", grade: "" },
    { category: "", weight: "", grade: "" },
  ];
  renderWeightedItems();
  document.getElementById("weightedResult").style.display = "none";
}

// Save values from inputs back into weightedItems array
function syncWeightedInputs() {
  weightedItems.forEach(function (item, i) {
    var catEl = document.getElementById("wr_cat_" + i);
    var wEl = document.getElementById("wr_w_" + i);
    var gEl = document.getElementById("wr_g_" + i);
    if (catEl) item.category = catEl.value;
    if (wEl) item.weight = wEl.value;
    if (gEl) item.grade = gEl.value;
  });
}

function renderWeightedItems() {
  var container = document.getElementById("weightedItemsContainer");

  // Column headers
  var html = '<div class="weighted-row-header">';
  html += '<div class="weighted-col-label">Name (optional)</div>';
  html += '<div class="weighted-col-label">Grade (%)</div>';
  html += '<div class="weighted-col-label">Weight (%)</div>';
  html += '<div class="weighted-col-label"></div>';
  html += "</div>";

  weightedItems.forEach(function (item, index) {
    var catVal = item.category || "";
    var wVal =
      item.weight !== "" && item.weight !== undefined ? item.weight : "";
    var gVal = item.grade !== "" && item.grade !== undefined ? item.grade : "";

    html += '<div class="weighted-row">';
    html +=
      '<input type="text" id="wr_cat_' +
      index +
      '" class="weighted-row-cat" value="' +
      escapeAttr(catVal) +
      '" placeholder="e.g. Midterm" />';
    html +=
      '<input type="number" id="wr_g_' +
      index +
      '" class="weighted-row-grade" value="' +
      escapeAttr(String(gVal)) +
      '" placeholder="100" min="0" max="200" step="0.01" />';
    html +=
      '<div class="weighted-input-pct"><input type="number" id="wr_w_' +
      index +
      '" class="weighted-row-weight" value="' +
      escapeAttr(String(wVal)) +
      '" placeholder="25" min="0" max="100" step="0.01" /><span class="pct-sign">%</span></div>';
    html +=
      '<button class="weighted-item-remove" onclick="syncWeightedInputs(); removeWeightedItem(' +
      index +
      ')">✕</button>';
    html += "</div>";
  });

  // Weight bar (based on filled-in weights)
  var totalWeight = 0;
  weightedItems.forEach(function (item) {
    var w = parseFloat(item.weight);
    if (!isNaN(w)) totalWeight += w;
  });

  var barClass =
    totalWeight > 100
      ? "weighted-weight-fill weighted-weight-over"
      : "weighted-weight-fill";
  var barWidth = Math.min(totalWeight, 100);
  var barColor =
    totalWeight > 100 ? "#e84545" : totalWeight === 100 ? "#4ecca3" : "#ffb81c";
  html +=
    '<div class="weighted-weight-bar"><div class="' +
    barClass +
    '" style="width: ' +
    barWidth +
    '%;"></div></div>';
  html +=
    '<div class="weighted-weight-info" style="color: ' +
    barColor +
    ';">Total weight: ' +
    totalWeight.toFixed(1) +
    "% / 100%</div>";

  container.innerHTML = html;

  // Add live-sync on input change so weight bar updates
  weightedItems.forEach(function (item, i) {
    var wEl = document.getElementById("wr_w_" + i);
    if (wEl) {
      wEl.addEventListener("input", function () {
        syncWeightedInputs();
        updateWeightBar();
      });
    }
  });
}

function updateWeightBar() {
  var totalWeight = 0;
  weightedItems.forEach(function (item) {
    var w = parseFloat(item.weight);
    if (!isNaN(w)) totalWeight += w;
  });

  var bar = document.querySelector(".weighted-weight-fill");
  var info = document.querySelector(".weighted-weight-info");
  if (!bar || !info) return;

  var barWidth = Math.min(totalWeight, 100);
  bar.style.width = barWidth + "%";

  if (totalWeight > 100) {
    bar.className = "weighted-weight-fill weighted-weight-over";
    info.style.color = "#e84545";
  } else if (Math.abs(totalWeight - 100) < 0.01) {
    bar.className = "weighted-weight-fill";
    info.style.color = "#4ecca3";
  } else {
    bar.className = "weighted-weight-fill";
    info.style.color = "#ffb81c";
  }

  info.textContent = "Total weight: " + totalWeight.toFixed(1) + "% / 100%";
}

function calculateWeighted() {
  syncWeightedInputs();

  // Filter to rows that have at least weight and grade filled in
  var validItems = weightedItems.filter(function (item) {
    var w = parseFloat(item.weight);
    var g = parseFloat(item.grade);
    return !isNaN(w) && w > 0 && !isNaN(g) && g >= 0;
  });

  if (validItems.length === 0) {
    alert("Please fill in at least one row with a weight and grade!");
    return;
  }

  var totalWeight = 0;
  var weightedSum = 0;

  validItems.forEach(function (item) {
    var w = parseFloat(item.weight);
    var g = parseFloat(item.grade);
    totalWeight += w;
    weightedSum += (w / 100) * g;
  });

  var finalGrade;
  var note = "";
  if (Math.abs(totalWeight - 100) < 0.01) {
    finalGrade = weightedSum;
  } else if (totalWeight > 0) {
    finalGrade = (weightedSum / totalWeight) * 100;
    note =
      "Weights total " +
      totalWeight.toFixed(1) +
      "% — grade normalized to 100%.";
  } else {
    finalGrade = 0;
  }

  var letterGrade = getLetterGrade(finalGrade);

  var resultEl = document.getElementById("weightedResult");
  resultEl.style.display = "block";

  var html = "";
  html += '<div class="weighted-result-label">YOUR WEIGHTED GRADE</div>';
  html +=
    '<div class="weighted-result-grade">' + finalGrade.toFixed(2) + "%</div>";
  html += '<div class="weighted-result-letter">' + letterGrade + "</div>";
  if (note) {
    html +=
      '<div style="color: #aaa; font-size: 0.65rem; margin-top: 8px;">' +
      note +
      "</div>";
  }

  resultEl.innerHTML = html;
  resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function getLetterGrade(pct) {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
