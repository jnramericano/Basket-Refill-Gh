;(function () {
const USERS_KEY = "basketRefillGHUsers";
const LEADS_KEY = "basketRefillGHLeads";
const MESSAGES_KEY = "basketRefillGHMessages";
const USER_SESSION_KEY = "basketRefillGHUserSession";
const ADMIN_SESSION_KEY = "basketRefillGHAdminSession";

const ADMIN_EMAIL = "admin@basketrefillgh.com";
const ADMIN_PASSWORD = "admin123";

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return loadJSON(USERS_KEY, []);
}

function saveUsers(users) {
  saveJSON(USERS_KEY, users);
}

function getLeads() {
  return loadJSON(LEADS_KEY, []);
}

function saveLeads(leads) {
  saveJSON(LEADS_KEY, leads);
}

function getMessages() {
  return loadJSON(MESSAGES_KEY, []);
}

function saveMessages(messages) {
  saveJSON(MESSAGES_KEY, messages);
}

function registerStudent({ name, email, password, school, studentType }) {
  const users = getUsers();
  const exists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const now = new Date().toISOString();

  const user = {
    id: `USR-${Date.now()}`,
    role: "student",
    name,
    email,
    password,
    school,
    studentType,
    createdAt: now
  };

  users.unshift(user);
  saveUsers(users);

  // Also save to admin leads so the admin can see the signup.
  const leads = getLeads();
  leads.unshift({
    id: `LEAD-${Date.now()}`,
    fullName: name,
    email,
    phone: "",
    school,
    studentType,
    deliveryArea: "",
    orderType: "subscription",
    orderTypeLabel: "New student signup",
    planId: "none",
    planName: "No subscription",
    planPrice: 0,
    addOns: [],
    addonTotal: 0,
    estimatedMonthlyTotal: 0,
    comments: "Created via signup page.",
    notes: "",
    status: "New",
    createdAt: now
  });
  saveLeads(leads);

  return user;
}

function loginStudent(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.role === "student" &&
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) return null;

  sessionStorage.setItem(
    USER_SESSION_KEY,
    JSON.stringify({
      id: user.id,
      role: "student",
      name: user.name,
      email: user.email,
      school: user.school
    })
  );

  return user;
}

function loginAdmin(email, password) {
  if (
    email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.setItem(
      USER_SESSION_KEY,
      JSON.stringify({
        role: "admin",
        email: ADMIN_EMAIL
      })
    );
    return true;
  }

  return false;
}

function requireAdmin() {
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
    window.location.href = "login.html?role=admin";
  }
}

function logoutAll() {
  sessionStorage.removeItem(USER_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

// Expose helpers globally
window.BRGHAuth = {
  registerStudent,
  loginStudent,
  loginAdmin,
  requireAdmin,
  logoutAll,
  getCurrentUser,
  getLeads,
  saveLeads,
  getMessages,
  saveMessages
};
})();