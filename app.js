// ==========================================
// MOCK DATABASE & INITIALIZATION
// ==========================================

const DEFAULT_STUDENTS = [
  {
    regNo: "BIT/2025/10492",
    name: "Francis Mwangi Njuguna",
    course: "Bachelor in Information Technology",
    department: "Computing & Informatics",
    year: "Year 1, Semester 2",
    admYear: 2025,
    email: "francis.mwangi@student.mku.ac.ke",
    nationalId: "39019283",
    avatar: "male-1",
    billing: {
      billed: 68000,
      paid: 50000,
      balance: 18000
    },
    transactions: [
      { receiptNo: "MKU-104920", date: "2025-10-15", ref: "MPESA-FKR10M83D", amount: 30000, mode: "M-PESA", status: "COMPLETED" },
      { receiptNo: "MKU-104810", date: "2025-09-08", ref: "BANK-EQ-10482B", amount: 20000, mode: "Equity Bank", status: "COMPLETED" }
    ],
    units: [
      // Semester 1 (September 2025 - December 2025)
      { code: "BIT 1101", title: "Introduction to Information Technology", lecturer: "Dr. A. Mwangi", credits: 3, semester: "Y1S1", mark: 75 },
      { code: "BIT 1102", title: "Computer Mathematics", lecturer: "Ms. J. Kamau", credits: 3, semester: "Y1S1", mark: 62 },
      { code: "BIT 1103", title: "Structured Programming", lecturer: "Mr. D. Ochieng", credits: 3, semester: "Y1S1", mark: 68 },
      // Semester 2 (January 2026 - May 2026 / Current)
      { code: "BIT 1201", title: "Database Systems", lecturer: "Dr. L. Mutua", credits: 3, semester: "Y1S2", mark: 0 },
      { code: "BIT 1202", title: "Object Oriented Programming", lecturer: "Mr. S. Koech", credits: 3, semester: "Y1S2", mark: 0 },
      { code: "BIT 1203", title: "System Analysis & Design", lecturer: "Mrs. M. Nduta", credits: 3, semester: "Y1S2", mark: 0 },
      { code: "BIT 1204", title: "Web Design & Development", lecturer: "Prof. P. Kipkorir", credits: 3, semester: "Y1S2", mark: 0 }
    ],
    availableUnits: [
      { code: "BIT 1205", title: "Computer Networks", credits: 3 },
      { code: "BIT 1206", title: "Operating Systems", credits: 3 }
    ],
    documents: {
      kcseSlip: null,
      transcript: null,
      nationalId: null
    }
  }
];

// Helper to generate SVG avatars inline
function getAvatarSvg(avatarId) {
  if (avatarId && avatarId.startsWith("data:image/")) {
    return avatarId;
  }
  
  const colors = {
    "male-1": { bg: "#e2e8f0", skin: "#e0ac69", hair: "#2d3748", shirt: "#0c3c86" },
    "female-1": { bg: "#fef3c7", skin: "#f3c89b", hair: "#78350f", shirt: "#e5a910" },
    "male-2": { bg: "#d1fae5", skin: "#d2b48c", hair: "#1a202c", shirt: "#059669" }
  };
  
  const c = colors[avatarId] || colors["male-1"];
  
  if (avatarId.startsWith("male")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="16" fill="${encodeURIComponent(c.bg)}"/>
      <circle cx="50" cy="40" r="20" fill="${encodeURIComponent(c.skin)}"/>
      <path d="M50 18 C38 18, 32 25, 32 32 C35 32, 38 28, 50 28 C62 28, 65 32, 68 32 C68 25, 62 18, 50 18 Z" fill="${encodeURIComponent(c.hair)}"/>
      <path d="M50 48 C42 48, 30 50, 30 52 L30 52 C30 52, 32 60, 32 60 L68 60 C68 60, 70 52, 70 52 L70 52 C70 50, 58 48, 50 48 Z" fill="${encodeURIComponent(c.skin)}"/>
      <path d="M25 75 C25 65, 35 60, 50 60 C65 60, 75 65, 75 75 L75 90 C75 90, 25 90, 25 90 Z" fill="${encodeURIComponent(c.shirt)}"/>
      <rect x="44" y="58" width="12" height="10" fill="${encodeURIComponent(c.skin)}"/>
      <circle cx="44" cy="38" r="2.5" fill="%23222"/>
      <circle cx="56" cy="38" r="2.5" fill="%23222"/>
      <path d="M46 48 Q50 51 54 48" stroke="%23222" stroke-width="1.5" fill="none"/>
    </svg>`;
  } else {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="16" fill="${encodeURIComponent(c.bg)}"/>
      <circle cx="50" cy="42" r="18" fill="${encodeURIComponent(c.skin)}"/>
      <!-- Long Hair -->
      <path d="M28 35 C28 20, 72 20, 72 35 C72 50, 68 70, 68 70 C68 70, 65 30, 50 30 C35 30, 32 70, 32 70 C32 70, 28 50, 28 35 Z" fill="${encodeURIComponent(c.hair)}"/>
      <path d="M25 75 C25 65, 35 60, 50 60 C65 60, 75 65, 75 75 L75 90 C75 90, 25 90, 25 90 Z" fill="${encodeURIComponent(c.shirt)}"/>
      <rect x="45" y="56" width="10" height="10" fill="${encodeURIComponent(c.skin)}"/>
      <circle cx="44" cy="40" r="2" fill="%23222"/>
      <circle cx="56" cy="40" r="2" fill="%23222"/>
      <path d="M47 48 Q50 50 53 48" stroke="%23222" stroke-width="1.5" fill="none"/>
    </svg>`;
  }
}

// Initializing DB
let students = [];

function initDatabase() {
  const cached = localStorage.getItem("mku_portal_students");
  let parseSuccess = false;
  
  if (cached) {
    try {
      students = JSON.parse(cached);
      // Ensure the database contains Francis Mwangi Njuguna
      if (students.some(s => s.regNo === "BIT/2025/10492")) {
        // Ensure every student has a documents object
        students.forEach(s => {
          if (!s.documents) {
            s.documents = { kcseSlip: null, transcript: null, nationalId: null };
          }
        });
        parseSuccess = true;
      }
    } catch (e) {
      parseSuccess = false;
    }
  }
  
  if (!parseSuccess) {
    students = DEFAULT_STUDENTS;
    localStorage.setItem("mku_portal_students", JSON.stringify(students));
  }
}

function saveDatabase() {
  localStorage.setItem("mku_portal_students", JSON.stringify(students));
}

// ==========================================
// SESSION MANAGEMENT (LOGIN/LOGOUT)
// ==========================================

let currentRole = "student"; // 'student' or 'admin'
let loggedInUser = null;     // Student object if logged in

function setLoginRole(role) {
  currentRole = role;
  
  // Update Tabs style
  document.getElementById("tab-student").classList.toggle("active", role === "student");
  document.getElementById("tab-admin").classList.toggle("active", role === "admin");
  
  // Update inputs/labels
  const usernameLabel = document.getElementById("login-username-label");
  const usernameInput = document.getElementById("username");
  const userIcon = document.getElementById("login-user-icon");
  const demoBox = document.getElementById("demo-credentials-box");
  const demoText = document.getElementById("demo-credentials-text");
  
  if (role === "student") {
    usernameLabel.textContent = "Student ID / Registration Number";
    usernameInput.placeholder = "e.g., BIT/2025/10492";
    demoBox.style.display = "block";
    demoText.innerHTML = "Student: Use Reg No: <code>BIT/2025/10492</code> and password: <code>student123</code>";
  } else {
    usernameLabel.textContent = "Admin Username";
    usernameInput.placeholder = "e.g., admin";
    demoBox.style.display = "block";
    demoText.innerHTML = "Admin: Use Username: <code>admin</code> and password: <code>admin123</code>";
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  
  if (currentRole === "student") {
    // Find matching student
    const student = students.find(s => s.regNo.toLowerCase() === username.toLowerCase());
    
    if (student && pass === "student123") {
      loggedInUser = student;
      
      // Hide login, show student view
      document.getElementById("login-view").classList.remove("active");
      document.getElementById("student-view").classList.add("active");
      
      // Populate and setup student dashboard
      initializeStudentDashboard();
      showToast(`Welcome back, ${student.name}!`, "success");
    } else {
      showToast("Invalid Registration Number or Password. Use: BIT/2025/10492 / student123", "error");
    }
  } else {
    // Admin login
    if (username.toLowerCase() === "admin" && pass === "admin123") {
      // Hide login, show admin view
      document.getElementById("login-view").classList.remove("active");
      document.getElementById("admin-view").classList.add("active");
      
      initializeAdminDashboard();
      showToast("Welcome to Administrator Portal", "success");
    } else {
      showToast("Invalid Admin credentials. Use: admin / admin123", "error");
    }
  }
}

function logout() {
  loggedInUser = null;
  
  // Clear inputs
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  
  // Swap views
  document.getElementById("student-view").classList.remove("active");
  document.getElementById("admin-view").classList.remove("active");
  document.getElementById("login-view").classList.add("active");
  
  // Close any overlays
  document.getElementById("edit-results-modal").classList.remove("active");
  document.getElementById("mpesa-sim-overlay").style.display = "none";
  
  showToast("Logged out successfully.", "info");
}

// ==========================================
// TOAST NOTIFICATIONS SYSTEM
// ==========================================

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "";
  if (type === "success") {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else if (type === "warning") {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Auto-remove toast
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// STUDENT PORTAL LOGIC
// ==========================================

function switchSection(sectionId) {
  // Update sidebar active item
  const menuLinks = document.querySelectorAll("#student-view .menu-item-link");
  menuLinks.forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    
    if (sectionId === "student-home" && text.includes("home")) link.classList.add("active");
    else if (sectionId === "student-units" && text.includes("units")) link.classList.add("active");
    else if (sectionId === "student-fees" && text.includes("fees")) link.classList.add("active");
    else if (sectionId === "student-transcript" && text.includes("transcript")) link.classList.add("active");
    else link.classList.remove("active");
  });

  // Hide all sections, show active
  const sections = document.querySelectorAll("#student-view .dashboard-section");
  sections.forEach(sec => sec.classList.remove("active"));
  
  document.getElementById(`${sectionId}-section`).classList.add("active");
  
  // Update title bar
  const titles = {
    "student-home": "Home Profile Dashboard",
    "student-units": "Registered Units Registration",
    "student-fees": "Fees Ledger Statement",
    "student-transcript": "Academic Semester Transcript"
  };
  document.getElementById("page-title").textContent = titles[sectionId];
  
  // Close mobile sidebar on navigate
  document.getElementById("student-view").querySelector(".sidebar").classList.remove("mobile-open");
  document.getElementById("sidebar-overlay").classList.remove("active");
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("student-view").querySelector(".sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("active");
}

function initializeStudentDashboard() {
  if (!loggedInUser) return;
  
  const user = loggedInUser;
  const avatarUrl = getAvatarSvg(user.avatar);
  
  // Sidebar info
  document.getElementById("student-avatar-img").src = avatarUrl;
  document.getElementById("student-name-sidebar").textContent = user.name;
  document.getElementById("student-reg-sidebar").textContent = user.regNo;
  
  // Profile hero
  document.getElementById("student-hero-img").src = avatarUrl;
  document.getElementById("student-full-name").textContent = user.name;
  document.getElementById("student-course").textContent = user.course;
  document.getElementById("student-reg-no").textContent = user.regNo;
  document.getElementById("student-year").textContent = user.year;
  document.getElementById("student-dept").textContent = user.department;
  
  // Credentials details table
  document.getElementById("td-full-name").textContent = user.name;
  document.getElementById("td-reg-no").textContent = user.regNo;
  document.getElementById("td-email").textContent = user.email;
  document.getElementById("td-national-id").textContent = user.nationalId;
  
  // Load sub-modules
  loadStudentStats();
  loadRegisteredUnits();
  loadAvailableUnits();
  loadFeeStatement();
  loadAcademicTranscript();
  loadStudentDocuments();
  
  // Always start at home
  switchSection("student-home");
}

function loadStudentStats() {
  const user = loggedInUser;
  
  // Count current semester units (where code matches ongoing patterns or credits is set)
  const registeredCount = user.units.filter(u => u.semester === "Y2S1" || u.semester === "Y1S2" || u.mark === 0).length;
  document.getElementById("stat-registered-units").textContent = `${registeredCount} Units`;
  
  // Fee balance
  document.getElementById("stat-fee-balance").textContent = `KES ${user.billing.balance.toLocaleString()}`;
  
  // GPA calculation
  const stats = calculateGPAStats(user.units);
  document.getElementById("stat-cumulative-gpa").textContent = `${stats.gpa} / 4.0`;
}

// Map grade mark to letter and points
function getGradeDetails(mark) {
  if (mark === 0 || mark === null || mark === undefined) return { grade: "IP", gp: 0, status: "Ongoing" }; // In Progress
  if (mark >= 70) return { grade: "A", gp: 4.0, status: "Pass" };
  if (mark >= 60) return { grade: "B", gp: 3.0, status: "Pass" };
  if (mark >= 50) return { grade: "C", gp: 2.0, status: "Pass" };
  if (mark >= 40) return { grade: "D", gp: 1.0, status: "Pass" };
  return { grade: "E", gp: 0.0, status: "Fail" };
}

function calculateGPAStats(unitsList) {
  let totalGradePoints = 0;
  let totalCredits = 0;
  let gradedUnitsCount = 0;
  
  unitsList.forEach(u => {
    // Only calculate for units that are graded (mark > 0)
    if (u.mark > 0) {
      const details = getGradeDetails(u.mark);
      totalGradePoints += details.gp * u.credits;
      totalCredits += u.credits;
      gradedUnitsCount++;
    }
  });
  
  const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
  
  // Calculate Mean Grade Letter
  let meanGrade = "N/A";
  if (gpa >= 3.7) meanGrade = "A";
  else if (gpa >= 3.5) meanGrade = "A-";
  else if (gpa >= 3.0) meanGrade = "B+";
  else if (gpa >= 2.7) meanGrade = "B";
  else if (gpa >= 2.4) meanGrade = "B-";
  else if (gpa >= 2.0) meanGrade = "C+";
  else if (gpa >= 1.7) meanGrade = "C";
  else if (gpa >= 1.0) meanGrade = "D";
  else if (gradedUnitsCount > 0) meanGrade = "E";
  
  return { gpa, totalCredits, meanGrade };
}

function loadRegisteredUnits() {
  const tbody = document.querySelector("#registered-units-table tbody");
  tbody.innerHTML = "";
  
  // Show all registered units
  loggedInUser.units.forEach(u => {
    const isGraded = u.mark > 0;
    const badgeClass = isGraded ? "badge-success" : "badge-warning";
    const statusText = isGraded ? "Graded" : "Active / Ongoing";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${u.code}</strong></td>
      <td>${u.title}</td>
      <td>${u.lecturer || "TBD"}</td>
      <td>${u.credits} Hrs</td>
      <td><span class="badge ${badgeClass}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function loadAvailableUnits() {
  const tbody = document.querySelector("#available-units-table tbody");
  tbody.innerHTML = "";
  
  if (loggedInUser.availableUnits.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-light);">All recommended units are registered for this semester.</td></tr>`;
    return;
  }
  
  loggedInUser.availableUnits.forEach((u, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${u.code}</strong></td>
      <td>${u.title}</td>
      <td>${u.credits} Hrs</td>
      <td>
        <button class="btn-accent" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="registerUnit(${index})">
          Register Unit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function registerUnit(index) {
  const unit = loggedInUser.availableUnits[index];
  
  // Remove from available, add to registered
  loggedInUser.availableUnits.splice(index, 1);
  
  // Ongoing units don't have grades yet
  loggedInUser.units.push({
    code: unit.code,
    title: unit.title,
    credits: unit.credits,
    lecturer: "Dr. Faculty Staff",
    semester: loggedInUser.year.includes("Year 3") ? "Y3S2" : "Y2S1", // Add to current semester
    mark: 0
  });
  
  // Bill fee for registering a unit (e.g. KES 6,500 per unit)
  loggedInUser.billing.billed += 6500;
  loggedInUser.billing.balance += 6500;
  
  saveDatabase();
  
  // Reload
  loadStudentStats();
  loadRegisteredUnits();
  loadAvailableUnits();
  loadFeeStatement();
  
  showToast(`Successfully registered ${unit.code} - ${unit.title}. Billing updated.`, "success");
}

function loadFeeStatement() {
  const user = loggedInUser;
  
  // Update billing summary cards
  document.getElementById("fee-total-billed").textContent = `KES ${user.billing.billed.toLocaleString()}`;
  document.getElementById("fee-total-paid").textContent = `KES ${user.billing.paid.toLocaleString()}`;
  document.getElementById("fee-total-outstanding").textContent = `KES ${user.billing.balance.toLocaleString()}`;
  
  // Calculate percentage paid
  const pct = user.billing.billed > 0 ? Math.round((user.billing.paid / user.billing.billed) * 100) : 100;
  document.getElementById("fee-progress-pct").textContent = `${pct}%`;
  
  // Update progress circle dashoffset (stroke-dasharray is 440)
  const circle = document.getElementById("fee-progress-bar-circle");
  const offset = 440 - (440 * pct) / 100;
  circle.style.strokeDashoffset = offset;
  
  // Text summary
  if (user.billing.balance > 0) {
    document.getElementById("fee-progress-summary").textContent = `You require KES ${user.billing.balance.toLocaleString()} to clear fees for the exam card.`;
  } else {
    document.getElementById("fee-progress-summary").textContent = "Your fees account is fully cleared. Thank you!";
  }
  
  // Load payments table
  const tbody = document.querySelector("#fee-transactions-table tbody");
  tbody.innerHTML = "";
  
  if (user.transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No payments recorded.</td></tr>`;
    return;
  }
  
  user.transactions.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${t.receiptNo}</strong></td>
      <td>${t.date}</td>
      <td><code>${t.ref}</code></td>
      <td>KES ${t.amount.toLocaleString()}</td>
      <td>${t.mode}</td>
      <td><span class="badge badge-success">${t.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Lipa na M-Pesa push simulation
let currentMpesaAmount = 0;
let currentMpesaPin = "";

function triggerMpesaPush(event) {
  event.preventDefault();
  const phone = document.getElementById("mpesa-phone").value.trim();
  const amount = parseInt(document.getElementById("mpesa-amount").value);
  
  if (!phone || isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid phone number and amount.", "error");
    return;
  }
  
  if (amount > loggedInUser.billing.balance) {
    showToast(`Amount exceeds outstanding balance of KES ${loggedInUser.billing.balance.toLocaleString()}`, "warning");
    return;
  }
  
  currentMpesaAmount = amount;
  currentMpesaPin = "";
  updateMpesaDots();
  
  // Show Phone screen overlay
  document.getElementById("mpesa-prompt-text").innerHTML = `Lipa na M-PESA:<br>Do you want to pay KES ${amount.toLocaleString()} to Mount Kenya University?<br>Enter M-Pesa PIN:`;
  document.getElementById("mpesa-sim-overlay").style.display = "flex";
}

function pressMpesaKey(key) {
  if (currentMpesaPin.length < 4) {
    currentMpesaPin += key;
    updateMpesaDots();
  }
}

function clearMpesaKey() {
  currentMpesaPin = currentMpesaPin.slice(0, -1);
  updateMpesaDots();
}

function updateMpesaDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (i <= currentMpesaPin.length) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  }
}

function cancelMpesaTransaction() {
  document.getElementById("mpesa-sim-overlay").style.display = "none";
  showToast("Transaction cancelled by user.", "warning");
}

function submitMpesaTransaction() {
  if (currentMpesaPin.length < 4) {
    showToast("Please enter a 4-digit PIN.", "error");
    return;
  }
  
  // Close phone overlay
  document.getElementById("mpesa-sim-overlay").style.display = "none";
  
  // Process payment
  const transactionCode = "MPESA-" + Math.random().toString(36).substring(2, 11).toUpperCase();
  const receiptNo = "MKU-" + Math.floor(100000 + Math.random() * 900000);
  const today = new Date().toISOString().split("T")[0];
  
  loggedInUser.billing.paid += currentMpesaAmount;
  loggedInUser.billing.balance -= currentMpesaAmount;
  
  // Add payment to list
  loggedInUser.transactions.unshift({
    receiptNo: receiptNo,
    date: today,
    ref: transactionCode,
    amount: currentMpesaAmount,
    mode: "M-PESA",
    status: "COMPLETED"
  });
  
  saveDatabase();
  
  // Refresh UI
  loadStudentStats();
  loadFeeStatement();
  
  // Clear payment fields
  document.getElementById("mpesa-amount").value = "";
  
  showToast(`Payment of KES ${currentMpesaAmount.toLocaleString()} verified! Ref: ${transactionCode}`, "success");
}

function loadAcademicTranscript() {
  const container = document.getElementById("transcript-semesters-container");
  container.innerHTML = "";
  
  // Update student meta details in the Transcript document
  document.getElementById("trans-student-name").textContent = loggedInUser.name;
  document.getElementById("trans-reg-no").textContent = loggedInUser.regNo;
  document.getElementById("trans-programme").textContent = loggedInUser.course;
  document.getElementById("trans-adm-year").textContent = loggedInUser.admYear;
  document.getElementById("trans-date-printed").textContent = new Date().toISOString().split("T")[0];
  
  // Group units by semesters
  const semesters = {};
  loggedInUser.units.forEach(u => {
    // Only display semesters that have at least one graded unit in this layout
    const sem = u.semester;
    if (!semesters[sem]) {
      semesters[sem] = [];
    }
    semesters[sem].push(u);
  });
  
  // Render each semester
  const semesterLabels = {
    "Y1S1": "YEAR 1 SEMESTER 1 (ACADEMIC YEAR " + loggedInUser.admYear + "/" + (loggedInUser.admYear + 1) + ")",
    "Y1S2": "YEAR 1 SEMESTER 2 (ACADEMIC YEAR " + loggedInUser.admYear + "/" + (loggedInUser.admYear + 1) + ")",
    "Y2S1": "YEAR 2 SEMESTER 1 (ACADEMIC YEAR " + (loggedInUser.admYear + 1) + "/" + (loggedInUser.admYear + 2) + ")",
    "Y2S2": "YEAR 2 SEMESTER 2 (ACADEMIC YEAR " + (loggedInUser.admYear + 1) + "/" + (loggedInUser.admYear + 2) + ")",
    "Y3S1": "YEAR 3 SEMESTER 1 (ACADEMIC YEAR " + (loggedInUser.admYear + 2) + "/" + (loggedInUser.admYear + 3) + ")",
    "Y3S2": "YEAR 3 SEMESTER 2 (ACADEMIC YEAR " + (loggedInUser.admYear + 2) + "/" + (loggedInUser.admYear + 3) + ")"
  };
  
  // Sort semesters
  const sortedSems = Object.keys(semesters).sort();
  
  sortedSems.forEach(semKey => {
    const list = semesters[semKey];
    
    const div = document.createElement("div");
    div.className = "transcript-academic-record";
    
    let rowsHtml = "";
    list.forEach(u => {
      const hasGrade = u.mark > 0;
      const details = getGradeDetails(u.mark);
      const displayMark = hasGrade ? u.mark : "IP";
      const displayGrade = hasGrade ? details.grade : "IP";
      
      rowsHtml += `
        <tr>
          <td>${u.code}</td>
          <td>${u.title}</td>
          <td>${u.credits}</td>
          <td>${displayMark}</td>
          <td><strong>${displayGrade}</strong></td>
          <td>${hasGrade ? details.status : "Ongoing"}</td>
        </tr>
      `;
    });
    
    div.innerHTML = `
      <div class="transcript-semester-title">${semesterLabels[semKey] || semKey}</div>
      <table class="transcript-table">
        <thead>
          <tr>
            <th style="width: 15%;">Unit Code</th>
            <th style="width: 45%;">Unit Description</th>
            <th style="width: 10%;">Credits</th>
            <th style="width: 10%;">Marks</th>
            <th style="width: 10%;">Grade</th>
            <th style="width: 10%;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    container.appendChild(div);
  });
  
  // Cumulative GPA & credit hours
  const stats = calculateGPAStats(loggedInUser.units);
  document.getElementById("trans-total-credits").textContent = stats.totalCredits;
  document.getElementById("trans-cumulative-gpa").textContent = stats.gpa;
  document.getElementById("trans-mean-grade").textContent = stats.meanGrade;
}

// ==========================================
// ADMIN PORTAL LOGIC
// ==========================================

let activeAdminStudentReg = null; // Registration number of student being edited

function switchAdminSection(sectionId) {
  // Mobile sidebar close on admin
  document.getElementById("admin-view").querySelector(".sidebar").classList.remove("mobile-open");
  document.getElementById("admin-sidebar-overlay").classList.remove("active");
}

function toggleMobileSidebarAdmin() {
  const sidebar = document.getElementById("admin-view").querySelector(".sidebar");
  const overlay = document.getElementById("admin-sidebar-overlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("active");
}

function initializeAdminDashboard() {
  loadAdminStats();
  renderAdminStudentsTable();
}

function loadAdminStats() {
  // Total Students
  document.getElementById("admin-stat-total-students").textContent = students.length;
  
  // Average GPA across all students
  let totalGpa = 0;
  let count = 0;
  let totalBalance = 0;
  
  students.forEach(s => {
    const stats = calculateGPAStats(s.units);
    if (parseFloat(stats.gpa) > 0) {
      totalGpa += parseFloat(stats.gpa);
      count++;
    }
    totalBalance += s.billing.balance;
  });
  
  const avgGpa = count > 0 ? (totalGpa / count).toFixed(2) : "0.00";
  document.getElementById("admin-stat-average-gpa").textContent = avgGpa;
  document.getElementById("admin-stat-unpaid-fees").textContent = `KES ${totalBalance.toLocaleString()}`;
}

function renderAdminStudentsTable(filteredStudents = students) {
  const tbody = document.querySelector("#admin-students-table tbody");
  tbody.innerHTML = "";
  
  if (filteredStudents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-light);">No student matching query was found.</td></tr>`;
    return;
  }
  
  filteredStudents.forEach(s => {
    const avatarUrl = getAvatarSvg(s.avatar);
    const stats = calculateGPAStats(s.units);
    const feeBadgeClass = s.billing.balance === 0 ? "badge-success" : (s.billing.balance > 15000 ? "badge-danger" : "badge-warning");
    const feeStatus = s.billing.balance === 0 ? "Cleared" : `KES ${s.billing.balance.toLocaleString()}`;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${avatarUrl}" alt="Avatar" style="width: 38px; height: 38px; border-radius: 8px; border: 1.5px solid var(--accent-color); background: white;"></td>
      <td><strong>${s.regNo}</strong></td>
      <td>${s.name}</td>
      <td style="font-size: 0.85rem; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.course}</td>
      <td><strong>${stats.gpa}</strong> <span style="font-size: 0.75rem; color: var(--text-light);">(${stats.meanGrade})</span></td>
      <td><span class="badge ${feeBadgeClass}">${feeStatus}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-accent" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; background: var(--primary-color); color: white;" onclick="openStudentFormModal('${s.regNo}')">
            Edit Profile
          </button>
          <button class="btn-accent" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="openEditModal('${s.regNo}')">
            Edit Marks
          </button>
          <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; background: var(--success-color); border: none;" onclick="simulatedClearFees('${s.regNo}')">
            Clear Fees
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterStudents() {
  const query = document.getElementById("admin-search-input").value.trim().toLowerCase();
  
  if (!query) {
    renderAdminStudentsTable(students);
    return;
  }
  
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(query) || 
    s.regNo.toLowerCase().includes(query) || 
    s.course.toLowerCase().includes(query)
  );
  
  renderAdminStudentsTable(filtered);
}

function openEditModal(regNo) {
  const student = students.find(s => s.regNo === regNo);
  if (!student) return;
  
  activeAdminStudentReg = regNo;
  
  // Set title
  document.getElementById("edit-results-modal-title").textContent = `Edit Marks & Registered Units: ${student.name} (${student.regNo})`;
  
  // Render units list
  renderEditModalUnits(student);
  
  // Populate the Register Unit select dropdown
  populateAdminAddUnitSelect(student);
  
  // Hide custom unit fields by default and clear inputs
  document.getElementById("admin-custom-unit-fields").style.display = "none";
  document.getElementById("admin-custom-unit-code").value = "";
  document.getElementById("admin-custom-unit-title").value = "";
  document.getElementById("admin-custom-unit-credits").value = "3";
  
  // Show Modal overlay
  document.getElementById("edit-results-modal").classList.add("active");
}

function renderEditModalUnits(student) {
  // Populate form rows
  const container = document.getElementById("edit-results-form-list");
  container.innerHTML = "";
  
  student.units.forEach((u, index) => {
    const row = document.createElement("div");
    row.className = "result-edit-row";
    row.innerHTML = `
      <div class="result-unit-info">
        <span class="result-unit-code">${u.code}</span>
        <span class="result-unit-title">${u.title}</span>
      </div>
      <div>
        <span style="font-size: 0.75rem; color: var(--text-light);">Mark (0-100)</span>
        <input type="number" min="0" max="100" class="result-input-field unit-mark-input" data-index="${index}" value="${u.mark}">
      </div>
      <div style="text-align: center;">
        <span style="font-size: 0.75rem; color: var(--text-light); display: block;">Grade</span>
        <strong class="unit-grade-preview" id="preview-grade-${index}" style="font-size: 1.1rem; color: var(--primary-color);">
          ${u.mark > 0 ? getGradeDetails(u.mark).grade : "IP"}
        </strong>
      </div>
    `;
    
    // Auto-update grade letters as marks input changes
    const input = row.querySelector(".unit-mark-input");
    input.addEventListener("input", (e) => {
      const mark = parseInt(e.target.value) || 0;
      const preview = row.querySelector(".unit-grade-preview");
      if (mark > 0) {
        preview.textContent = getGradeDetails(mark).grade;
      } else {
        preview.textContent = "IP";
      }
    });
    
    container.appendChild(row);
  });
}

function populateAdminAddUnitSelect(student) {
  const select = document.getElementById("admin-add-unit-select");
  select.innerHTML = "";
  
  // Add initial prompt option
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select recommended unit --";
  select.appendChild(defaultOpt);
  
  // Add recommended units
  if (student.availableUnits && student.availableUnits.length > 0) {
    student.availableUnits.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.code;
      opt.textContent = `${u.code} - ${u.title} (${u.credits} credits)`;
      select.appendChild(opt);
    });
  }
  
  // Add custom unit option
  const customOpt = document.createElement("option");
  customOpt.value = "custom";
  customOpt.textContent = "Register Custom Unit...";
  select.appendChild(customOpt);
}

function toggleCustomUnitFields() {
  const select = document.getElementById("admin-add-unit-select");
  const fields = document.getElementById("admin-custom-unit-fields");
  
  if (select.value === "custom") {
    fields.style.display = "grid";
  } else {
    fields.style.display = "none";
  }
}

function adminRegisterUnitForStudent() {
  const student = students.find(s => s.regNo === activeAdminStudentReg);
  if (!student) return;
  
  // Temporarily save pending marks so they aren't lost when we re-render the list
  const inputs = document.querySelectorAll(".unit-mark-input");
  inputs.forEach(input => {
    const idx = parseInt(input.getAttribute("data-index"));
    const mark = parseInt(input.value) || 0;
    student.units[idx].mark = mark;
  });
  
  const select = document.getElementById("admin-add-unit-select");
  const selectedValue = select.value;
  
  if (!selectedValue) {
    showToast("Please select a unit to register.", "warning");
    return;
  }
  
  let newUnit = null;
  
  if (selectedValue === "custom") {
    const code = document.getElementById("admin-custom-unit-code").value.trim().toUpperCase();
    const title = document.getElementById("admin-custom-unit-title").value.trim();
    const credits = parseInt(document.getElementById("admin-custom-unit-credits").value) || 3;
    
    if (!code || !title) {
      showToast("Custom unit code and title are required.", "error");
      return;
    }
    
    // Check if unit is already registered
    const alreadyRegistered = student.units.some(u => u.code.toLowerCase() === code.toLowerCase());
    if (alreadyRegistered) {
      showToast(`Unit ${code} is already registered for this student.`, "warning");
      return;
    }
    
    newUnit = {
      code: code,
      title: title,
      credits: credits,
      lecturer: "Dr. Faculty Staff",
      semester: student.year.includes("Year 3") ? "Y3S2" : (student.year.includes("Year 4") ? "Y4S2" : "Y2S1"),
      mark: 0
    };
  } else {
    // Recommended unit selected
    const availIndex = student.availableUnits.findIndex(u => u.code === selectedValue);
    if (availIndex !== -1) {
      const u = student.availableUnits[availIndex];
      newUnit = {
        code: u.code,
        title: u.title,
        credits: u.credits,
        lecturer: "Dr. Faculty Staff",
        semester: student.year.includes("Year 3") ? "Y3S2" : (student.year.includes("Year 4") ? "Y4S2" : "Y2S1"),
        mark: 0
      };
      // Remove from available units list
      student.availableUnits.splice(availIndex, 1);
    }
  }
  
  if (newUnit) {
    student.units.push(newUnit);
    
    // Bill fee for registering a unit (e.g. KES 6,500)
    student.billing.billed += 6500;
    student.billing.balance += 6500;
    
    saveDatabase();
    
    // Re-populate modal view immediately
    renderEditModalUnits(student);
    populateAdminAddUnitSelect(student);
    
    // Reset custom inputs and hide custom fields
    document.getElementById("admin-custom-unit-fields").style.display = "none";
    document.getElementById("admin-custom-unit-code").value = "";
    document.getElementById("admin-custom-unit-title").value = "";
    document.getElementById("admin-custom-unit-credits").value = "3";
    select.value = "";
    
    // Refresh admin stats & student list table behind the modal
    loadAdminStats();
    renderAdminStudentsTable();
    
    // If active user is the one being edited, update their active student dashboard
    if (loggedInUser && loggedInUser.regNo === student.regNo) {
      loggedInUser = student;
      loadStudentStats();
      loadRegisteredUnits();
      loadAvailableUnits();
      loadFeeStatement();
      loadAcademicTranscript();
    }
    
    showToast(`Registered unit ${newUnit.code} successfully! Billing updated.`, "success");
  }
}

function closeEditModal() {
  document.getElementById("edit-results-modal").classList.remove("active");
  activeAdminStudentReg = null;
}

function saveStudentResults() {
  const student = students.find(s => s.regNo === activeAdminStudentReg);
  if (!student) return;
  
  const inputs = document.querySelectorAll(".unit-mark-input");
  inputs.forEach(input => {
    const idx = parseInt(input.getAttribute("data-index"));
    const mark = parseInt(input.value) || 0;
    
    // Save new mark
    student.units[idx].mark = mark;
  });
  
  saveDatabase();
  
  // Close modal
  closeEditModal();
  
  // Refresh admin tables and stats
  loadAdminStats();
  renderAdminStudentsTable();
  
  // If active user is the one being edited, update their active dashboard data
  if (loggedInUser && loggedInUser.regNo === student.regNo) {
    loggedInUser = student; // Sync session info
    loadStudentStats();
    loadRegisteredUnits();
    loadAcademicTranscript();
  }
  
  showToast(`Successfully updated marks for ${student.name}`, "success");
}

function simulatedClearFees(regNo) {
  const student = students.find(s => s.regNo === regNo);
  if (!student) return;
  
  if (student.billing.balance === 0) {
    showToast(`${student.name} is already fully cleared.`, "info");
    return;
  }
  
  const originalBalance = student.billing.balance;
  
  student.billing.paid += originalBalance;
  student.billing.balance = 0;
  
  // Record transaction receipt
  const receiptNo = "MKU-" + Math.floor(100000 + Math.random() * 900000);
  student.transactions.unshift({
    receiptNo: receiptNo,
    date: new Date().toISOString().split("T")[0],
    ref: "ADMIN-CLEAR-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    amount: originalBalance,
    mode: "Admin Ledger Offset",
    status: "COMPLETED"
  });
  
  saveDatabase();
  
  // Refresh views
  loadAdminStats();
  renderAdminStudentsTable();
  
  if (loggedInUser && loggedInUser.regNo === student.regNo) {
    loggedInUser = student;
    loadStudentStats();
    loadFeeStatement();
  }
  
  showToast(`Cleared outstanding KES ${originalBalance.toLocaleString()} for ${student.name}`, "success");
}

// Add / Edit Student Profile Credentials
let activeStudentFormReg = null; // null if creating, string regNo if editing
let uploadedPhotoBase64 = null; // Stores base64 profile photo data

function openStudentFormModal(regNo = null) {
  const modal = document.getElementById("student-form-modal");
  const title = document.getElementById("student-form-modal-title");
  const regInput = document.getElementById("student-form-reg");
  const form = document.getElementById("student-credentials-form");
  const fileInput = document.getElementById("student-form-photo-upload");
  const statusSpan = document.getElementById("photo-upload-status");
  
  form.reset();
  if (fileInput) fileInput.value = "";
  uploadedPhotoBase64 = null;
  activeStudentFormReg = regNo;
  
  // Set tab to profile details by default
  switchAdminStudentFormTab("profile");
  
  if (regNo) {
    // EDIT MODE
    title.textContent = "Edit Student Credentials";
    regInput.readOnly = true;
    regInput.style.background = "#e2e8f0";
    
    const student = students.find(s => s.regNo === regNo);
    if (student) {
      document.getElementById("student-form-reg").value = student.regNo;
      document.getElementById("student-form-name").value = student.name;
      document.getElementById("student-form-course").value = student.course;
      document.getElementById("student-form-dept").value = student.department;
      document.getElementById("student-form-year").value = student.year;
      document.getElementById("student-form-admyear").value = student.admYear;
      document.getElementById("student-form-email").value = student.email;
      document.getElementById("student-form-nationalid").value = student.nationalId;
      document.getElementById("student-form-billed").value = student.billing.billed;
      document.getElementById("student-form-paid").value = student.billing.paid;
      
      const avatarPreview = document.getElementById("admin-form-avatar-preview");
      if (student.avatar && !student.avatar.startsWith("data:image/")) {
        document.getElementById("student-form-avatar").value = student.avatar;
        statusSpan.textContent = "No custom photo uploaded (using default avatar)";
        if (avatarPreview) avatarPreview.src = getAvatarSvg(student.avatar);
      } else if (student.avatar) {
        uploadedPhotoBase64 = student.avatar;
        statusSpan.textContent = "Custom profile photo is active";
        if (avatarPreview) avatarPreview.src = student.avatar;
      }
    }
  } else {
    // CREATE MODE
    title.textContent = "Add New Student";
    regInput.readOnly = false;
    regInput.style.background = "";
    statusSpan.textContent = "No photo uploaded (using default avatar)";
    
    document.getElementById("student-form-admyear").value = new Date().getFullYear();
    document.getElementById("student-form-billed").value = 65000;
    document.getElementById("student-form-paid").value = 0;
    
    const avatarPreview = document.getElementById("admin-form-avatar-preview");
    if (avatarPreview) avatarPreview.src = getAvatarSvg("male-1");
  }
  
  modal.classList.add("active");
}

function closeStudentFormModal() {
  document.getElementById("student-form-modal").classList.remove("active");
  activeStudentFormReg = null;
}

function saveStudentCredentials(event) {
  event.preventDefault();
  
  const regNo = document.getElementById("student-form-reg").value.trim();
  const name = document.getElementById("student-form-name").value.trim();
  const course = document.getElementById("student-form-course").value.trim();
  const department = document.getElementById("student-form-dept").value.trim();
  const year = document.getElementById("student-form-year").value;
  const admYear = parseInt(document.getElementById("student-form-admyear").value) || new Date().getFullYear();
  const email = document.getElementById("student-form-email").value.trim();
  const nationalId = document.getElementById("student-form-nationalid").value.trim();
  const billed = parseInt(document.getElementById("student-form-billed").value) || 0;
  const paid = parseInt(document.getElementById("student-form-paid").value) || 0;
  const avatar = document.getElementById("student-form-avatar").value;
  
  const balance = billed - paid;
  const finalAvatar = uploadedPhotoBase64 || avatar;
  
  if (activeStudentFormReg) {
    // Edit existing student
    const student = students.find(s => s.regNo === activeStudentFormReg);
    if (student) {
      student.name = name;
      student.course = course;
      student.department = department;
      student.year = year;
      student.admYear = admYear;
      student.email = email;
      student.nationalId = nationalId;
      student.avatar = finalAvatar;
      
      // Update billing
      student.billing.billed = billed;
      student.billing.paid = paid;
      student.billing.balance = balance;
      
      saveDatabase();
      showToast(`Credentials for ${name} updated successfully.`, "success");
    }
  } else {
    // Create new student
    // Check if regNo already exists
    const exists = students.some(s => s.regNo.toLowerCase() === regNo.toLowerCase());
    if (exists) {
      showToast(`Student with Registration Number ${regNo} already exists!`, "error");
      return;
    }
    
    // Auto-generate some default units so the student immediately has a results slip and transcript
    const defaultUnits = [
      { code: "UCU 1101", title: "Communication Skills", lecturer: "Ms. Evelyn W.", credits: 3, semester: "Y1S1", mark: 0 },
      { code: "UCU 1102", title: "Development Studies", lecturer: "Dr. Nicholas M.", credits: 3, semester: "Y1S1", mark: 0 },
      { code: "UCU 1103", title: "Introduction to Computers", lecturer: "Mr. Bernard K.", credits: 3, semester: "Y1S1", mark: 0 }
    ];
    
    const newStudent = {
      regNo: regNo,
      name: name,
      course: course,
      department: department,
      year: year,
      admYear: admYear,
      email: email,
      nationalId: nationalId,
      avatar: avatar,
      billing: {
        billed: billed,
        paid: paid,
        balance: balance
      },
      transactions: [],
      units: defaultUnits,
      availableUnits: [
        { code: "UCU 1104", title: "Environmental Science", credits: 3 },
        { code: "UCU 1105", title: "Health & Physical Education", credits: 3 }
      ],
      documents: {
        kcseSlip: null,
        transcript: null,
        nationalId: null
      }
    };
    
    // Add transaction if initial fees paid is positive
    if (paid > 0) {
      newStudent.transactions.push({
        receiptNo: "MKU-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString().split("T")[0],
        ref: "DEP-INIT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        amount: paid,
        mode: "Bank Deposit",
        status: "COMPLETED"
      });
    }
    
    students.push(newStudent);
    saveDatabase();
    showToast(`New student ${name} created successfully!`, "success");
  }
  
  // Close modal
  closeStudentFormModal();
  
  // Refresh admin tables and stats
  loadAdminStats();
  renderAdminStudentsTable();
  
  // If editing the active student user, sync and refresh student portal
  if (loggedInUser && loggedInUser.regNo === regNo) {
    const updated = students.find(s => s.regNo === regNo);
    if (updated) {
      loggedInUser = updated;
      initializeStudentDashboard();
    }
  }
}

// ==========================================
// CREDENTIALS & PROFILE PICTURE UPLOADING LOGIC
// ==========================================

const DOC_LABELS = {
  kcseSlip: "High School / KCSE Result Slip",
  transcript: "Previous Academic Transcript",
  nationalId: "National ID / Passport"
};

// Tabs switching in the Admin Student Credentials Modal
function switchAdminStudentFormTab(tabName) {
  const profileTab = document.getElementById("admin-student-tab-profile");
  const docsTab = document.getElementById("admin-student-tab-docs");
  const profilePane = document.getElementById("admin-student-pane-profile");
  const docsPane = document.getElementById("admin-student-pane-docs");
  
  if (!profileTab || !docsTab || !profilePane || !docsPane) return;
  
  if (tabName === "profile") {
    profileTab.classList.add("active");
    profileTab.style.color = "var(--primary-color)";
    profileTab.style.borderBottom = "3px solid var(--primary-color)";
    
    docsTab.classList.remove("active");
    docsTab.style.color = "var(--text-medium)";
    docsTab.style.borderBottom = "3px solid transparent";
    
    profilePane.style.display = "block";
    docsPane.style.display = "none";
  } else {
    docsTab.classList.add("active");
    docsTab.style.color = "var(--primary-color)";
    docsTab.style.borderBottom = "3px solid var(--primary-color)";
    
    profileTab.classList.remove("active");
    profileTab.style.color = "var(--text-medium)";
    profileTab.style.borderBottom = "3px solid transparent";
    
    profilePane.style.display = "none";
    docsPane.style.display = "block";
    
    // Render the documents list
    renderAdminStudentDocuments();
  }
}

// Student Portal profile photo edit overlay trigger
function triggerStudentPhotoUpload() {
  const fileInput = document.getElementById("student-photo-file-input");
  if (fileInput) fileInput.click();
}

function handleStudentPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64 = evt.target.result;
    
    if (loggedInUser) {
      loggedInUser.avatar = base64;
      
      const studentIdx = students.findIndex(s => s.regNo === loggedInUser.regNo);
      if (studentIdx !== -1) {
        students[studentIdx].avatar = base64;
        saveDatabase();
      }
      
      // Update displays
      document.getElementById("student-hero-img").src = base64;
      document.getElementById("student-avatar-img").src = base64;
      
      // Sync admin list if admin is active behind
      renderAdminStudentsTable();
      
      showToast("Profile photo updated successfully!", "success");
    }
  };
  reader.readAsDataURL(file);
}

// Student Portal documents triggers
function triggerDocUpload(docType) {
  const input = document.getElementById(`doc-upload-${docType}`);
  if (input) input.click();
}

function handleDocUpload(event, docType) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64 = evt.target.result;
    const today = new Date().toISOString().split("T")[0];
    
    if (loggedInUser) {
      if (!loggedInUser.documents) {
        loggedInUser.documents = { kcseSlip: null, transcript: null, nationalId: null };
      }
      
      loggedInUser.documents[docType] = {
        name: file.name,
        data: base64,
        date: today
      };
      
      const studentIdx = students.findIndex(s => s.regNo === loggedInUser.regNo);
      if (studentIdx !== -1) {
        students[studentIdx].documents = loggedInUser.documents;
        saveDatabase();
      }
      
      loadStudentDocuments();
      showToast(`Uploaded ${file.name} successfully!`, "success");
    }
  };
  reader.readAsDataURL(file);
}

function deleteDoc(docType) {
  if (loggedInUser && loggedInUser.documents && loggedInUser.documents[docType]) {
    const filename = loggedInUser.documents[docType].name;
    loggedInUser.documents[docType] = null;
    
    const studentIdx = students.findIndex(s => s.regNo === loggedInUser.regNo);
    if (studentIdx !== -1) {
      students[studentIdx].documents = loggedInUser.documents;
      saveDatabase();
    }
    
    loadStudentDocuments();
    showToast(`Removed document: ${filename}`, "info");
  }
}

function viewDoc(docType) {
  if (loggedInUser && loggedInUser.documents && loggedInUser.documents[docType]) {
    const doc = loggedInUser.documents[docType];
    openDocumentPreview(doc.name, doc.data);
  }
}

function loadStudentDocuments() {
  const container = document.getElementById("student-documents-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  const docs = loggedInUser.documents || { kcseSlip: null, transcript: null, nationalId: null };
  const docTypes = ["kcseSlip", "transcript", "nationalId"];
  
  docTypes.forEach(type => {
    const doc = docs[type];
    const label = DOC_LABELS[type];
    
    const docRow = document.createElement("div");
    docRow.className = "document-item-row";
    docRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: #ffffff;";
    
    let fileMetaHtml = "";
    let actionsHtml = "";
    
    if (doc) {
      fileMetaHtml = `
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--primary-dark);">${label}</div>
        <div style="font-size: 0.75rem; color: var(--success-color); display: flex; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Uploaded: ${doc.name} (${doc.date})
        </div>
      `;
      actionsHtml = `
        <button class="btn-accent" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: var(--primary-color); color: white;" onclick="viewDoc('${type}')">View</button>
        <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; color: var(--danger-color); border-color: rgba(239, 68, 68, 0.2);" onclick="deleteDoc('${type}')">Delete</button>
      `;
    } else {
      fileMetaHtml = `
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-medium);">${label}</div>
        <div style="font-size: 0.75rem; color: var(--text-light);">Not uploaded yet</div>
      `;
      actionsHtml = `
        <button class="btn-accent" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="triggerDocUpload('${type}')">Upload</button>
      `;
    }
    
    docRow.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="background: rgba(12, 60, 134, 0.08); color: var(--primary-color); width: 36px; height: 36px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          ${fileMetaHtml}
        </div>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        ${actionsHtml}
      </div>
    `;
    
    container.appendChild(docRow);
  });
}

// Universal preview modal handlers
function openDocumentPreview(filename, base64Data) {
  const modal = document.getElementById("document-preview-modal");
  const title = document.getElementById("document-preview-modal-title");
  const content = document.getElementById("document-preview-content");
  const downloadLink = document.getElementById("document-download-link");
  
  if (!modal || !title || !content || !downloadLink) return;
  
  title.textContent = `Preview: ${filename}`;
  content.innerHTML = "";
  
  downloadLink.href = base64Data;
  downloadLink.download = filename;
  
  const isImage = base64Data.startsWith("data:image/");
  const isPdf = base64Data.startsWith("data:application/pdf");
  
  if (isImage) {
    const img = document.createElement("img");
    img.src = base64Data;
    img.alt = filename;
    img.style.cssText = "max-width: 100%; max-height: 55vh; object-fit: contain; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); border: 2px solid var(--border-color); background: white;";
    content.appendChild(img);
  } else if (isPdf) {
    const iframe = document.createElement("iframe");
    iframe.src = base64Data;
    iframe.style.cssText = "width: 100%; height: 55vh; border: none; border-radius: var(--radius-sm);";
    content.appendChild(iframe);
  } else {
    content.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-light); margin-bottom: 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <h4 style="font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 0.5rem;">${filename}</h4>
        <p style="font-size: 0.9rem; color: var(--text-medium); margin-bottom: 1rem;">This file format cannot be previewed directly in the browser.</p>
        <span style="font-size: 0.8rem; color: var(--text-light);">Use the download button below to view it locally.</span>
      </div>
    `;
  }
  
  modal.classList.add("active");
}

function closeDocumentPreviewModal() {
  const modal = document.getElementById("document-preview-modal");
  if (modal) modal.classList.remove("active");
  const content = document.getElementById("document-preview-content");
  if (content) content.innerHTML = "";
}

// Admin Portal student document management
function renderAdminStudentDocuments() {
  const container = document.getElementById("admin-student-documents-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (!activeStudentFormReg) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-light); padding: 1.5rem; font-size: 0.9rem; border: 1.5px dashed var(--border-color); border-radius: var(--radius-md); background: #f8fafc;">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-light); margin-bottom: 0.5rem; display: block; margin-left: auto; margin-right: auto;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Please save new student credentials first to allow document management.
      </div>
    `;
    return;
  }
  
  const student = students.find(s => s.regNo === activeStudentFormReg);
  if (!student) return;
  
  const docs = student.documents || { kcseSlip: null, transcript: null, nationalId: null };
  const docTypes = ["kcseSlip", "transcript", "nationalId"];
  
  docTypes.forEach(type => {
    const doc = docs[type];
    const label = DOC_LABELS[type];
    
    const docRow = document.createElement("div");
    docRow.className = "document-item-row";
    docRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: #ffffff;";
    
    let fileMetaHtml = "";
    let actionsHtml = "";
    
    if (doc) {
      fileMetaHtml = `
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--primary-dark);">${label}</div>
        <div style="font-size: 0.75rem; color: var(--success-color); display: flex; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Uploaded: ${doc.name} (${doc.date})
        </div>
      `;
      actionsHtml = `
        <button type="button" class="btn-accent" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: var(--primary-color); color: white;" onclick="viewAdminStudentDoc('${type}')">View</button>
        <button type="button" class="btn-accent" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: var(--accent-color); color: var(--primary-dark); border: none;" onclick="triggerAdminDocUpload('${type}')">Replace</button>
        <button type="button" class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; color: var(--danger-color); border-color: rgba(239, 68, 68, 0.2);" onclick="deleteAdminStudentDoc('${type}')">Delete</button>
      `;
    } else {
      fileMetaHtml = `
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-medium);">${label}</div>
        <div style="font-size: 0.75rem; color: var(--text-light);">Not uploaded yet</div>
      `;
      actionsHtml = `
        <button type="button" class="btn-accent" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="triggerAdminDocUpload('${type}')">Upload</button>
      `;
    }
    
    docRow.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="background: rgba(12, 60, 134, 0.08); color: var(--primary-color); width: 36px; height: 36px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          ${fileMetaHtml}
        </div>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        ${actionsHtml}
      </div>
    `;
    
    container.appendChild(docRow);
  });
}

function triggerAdminDocUpload(docType) {
  const input = document.getElementById(`admin-doc-upload-${docType}`);
  if (input) input.click();
}

function handleAdminDocUpload(event, docType) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64 = evt.target.result;
    const today = new Date().toISOString().split("T")[0];
    
    if (activeStudentFormReg) {
      const student = students.find(s => s.regNo === activeStudentFormReg);
      if (student) {
        if (!student.documents) {
          student.documents = { kcseSlip: null, transcript: null, nationalId: null };
        }
        
        student.documents[docType] = {
          name: file.name,
          data: base64,
          date: today
        };
        
        saveDatabase();
        renderAdminStudentDocuments();
        
        // If the edited student is the logged in user, sync their dashboard
        if (loggedInUser && loggedInUser.regNo === student.regNo) {
          loggedInUser.documents = student.documents;
          loadStudentDocuments();
        }
        
        showToast(`Uploaded ${file.name} successfully!`, "success");
      }
    }
  };
  reader.readAsDataURL(file);
}

function deleteAdminStudentDoc(docType) {
  if (activeStudentFormReg) {
    const student = students.find(s => s.regNo === activeStudentFormReg);
    if (student && student.documents && student.documents[docType]) {
      const filename = student.documents[docType].name;
      student.documents[docType] = null;
      
      saveDatabase();
      renderAdminStudentDocuments();
      
      // If the edited student is the logged in user, sync their dashboard
      if (loggedInUser && loggedInUser.regNo === student.regNo) {
        loggedInUser.documents = student.documents;
        loadStudentDocuments();
      }
      
      showToast(`Removed document: ${filename}`, "info");
    }
  }
}

function viewAdminStudentDoc(docType) {
  if (activeStudentFormReg) {
    const student = students.find(s => s.regNo === activeStudentFormReg);
    if (student && student.documents && student.documents[docType]) {
      const doc = student.documents[docType];
      openDocumentPreview(doc.name, doc.data);
    }
  }
}

// ==========================================
// APP START & BOOTSTRAPPING
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  setLoginRole("student"); // Default tab on load
  
  // Photo uploader event listener inside Admin form
  const photoInput = document.getElementById("student-form-photo-upload");
  if (photoInput) {
    photoInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          uploadedPhotoBase64 = evt.target.result;
          document.getElementById("photo-upload-status").textContent = "Photo loaded successfully. Click Save to apply.";
          
          // Update preview thumbnail dynamically
          const preview = document.getElementById("admin-form-avatar-preview");
          if (preview) {
            preview.src = uploadedPhotoBase64;
          }
          
          showToast("Profile photo loaded.", "success");
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Update preview image dynamically if avatar style is changed
  const avatarSelect = document.getElementById("student-form-avatar");
  if (avatarSelect) {
    avatarSelect.addEventListener("change", function(e) {
      if (!uploadedPhotoBase64) {
        const preview = document.getElementById("admin-form-avatar-preview");
        if (preview) {
          preview.src = getAvatarSvg(e.target.value);
        }
      }
    });
  }
});

// Expose functions globally for inline HTML event handlers
window.setLoginRole = setLoginRole;
window.handleLogin = handleLogin;
window.logout = logout;
window.switchSection = switchSection;
window.toggleMobileSidebar = toggleMobileSidebar;
window.registerUnit = registerUnit;
window.triggerMpesaPush = triggerMpesaPush;
window.pressMpesaKey = pressMpesaKey;
window.clearMpesaKey = clearMpesaKey;
window.cancelMpesaTransaction = cancelMpesaTransaction;
window.submitMpesaTransaction = submitMpesaTransaction;
window.switchAdminSection = switchAdminSection;
window.toggleMobileSidebarAdmin = toggleMobileSidebarAdmin;
window.filterStudents = filterStudents;
window.openStudentFormModal = openStudentFormModal;
window.closeStudentFormModal = closeStudentFormModal;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.simulatedClearFees = simulatedClearFees;
window.saveStudentCredentials = saveStudentCredentials;
window.adminRegisterUnitForStudent = adminRegisterUnitForStudent;
window.toggleCustomUnitFields = toggleCustomUnitFields;
window.saveStudentResults = saveStudentResults;
window.triggerStudentPhotoUpload = triggerStudentPhotoUpload;
window.handleStudentPhotoUpload = handleStudentPhotoUpload;
window.triggerDocUpload = triggerDocUpload;
window.handleDocUpload = handleDocUpload;
window.deleteDoc = deleteDoc;
window.viewDoc = viewDoc;
window.closeDocumentPreviewModal = closeDocumentPreviewModal;
window.switchAdminStudentFormTab = switchAdminStudentFormTab;
window.viewAdminStudentDoc = viewAdminStudentDoc;
window.triggerAdminDocUpload = triggerAdminDocUpload;
window.handleAdminDocUpload = handleAdminDocUpload;
window.deleteAdminStudentDoc = deleteAdminStudentDoc;
window.showToast = showToast;
