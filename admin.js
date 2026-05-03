;(function () {
const LEADS_KEY = "basketRefillGHLeads";
const MESSAGES_KEY = "basketRefillGHMessages";
const ADMIN_SESSION_KEY = "basketRefillGHAdminSession";

const money = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0
});

const PLAN_META = {
  basic: { name: "Basic", price: 99 },
  standard: { name: "Standard", price: 179 },
  premium: { name: "Premium", price: 299 },
  none: { name: "No subscription", price: 0 }
};

let adminState = {
  search: "",
  plan: "all",
  orderType: "all",
  status: "all",
  school: "all"
};

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

function getLeads() {
  return loadJSON(LEADS_KEY, []);
}

function getMessages() {
  return loadJSON(MESSAGES_KEY, []);
}

function setLeads(leads) {
  saveJSON(LEADS_KEY, leads);
}

function setMessages(messages) {
  saveJSON(MESSAGES_KEY, messages);
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("en-GH", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

function selectedPlanName(planId) {
  return PLAN_META[planId]?.name || "No subscription";
}

function selectedPlanPrice(planId) {
  return PLAN_META[planId]?.price || 0;
}

function loadSchools() {
  const leads = getLeads();
  const schools = [...new Set(leads.map((lead) => lead.school).filter(Boolean))].sort();

  const select = document.getElementById("schoolFilter");
  if (!select) return;

  const current = select.value || "all";

  select.innerHTML =
    `<option value="all">All schools</option>` +
    schools.map((school) => `<option value="${escapeHTML(school)}">${escapeHTML(school)}</option>`).join("");

  select.value = schools.includes(current) ? current : "all";
}

function filteredLeads() {
  const leads = getLeads();

  return leads
    .filter((lead) => {
      const text = [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.school,
        lead.studentType,
        lead.deliveryArea,
        lead.orderTypeLabel,
        lead.planName,
        lead.comments,
        lead.notes,
        ...(Array.isArray(lead.addOns) ? lead.addOns.map((item) => item.name) : [])
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !adminState.search || text.includes(adminState.search);

      const matchesPlan =
        adminState.plan === "all" || (adminState.plan === "none" ? lead.planId === "none" : lead.planId === adminState.plan);

      const matchesOrderType =
        adminState.orderType === "all" || lead.orderType === adminState.orderType;

      const matchesStatus =
        adminState.status === "all" || lead.status === adminState.status;

      const matchesSchool =
        adminState.school === "all" || lead.school === adminState.school;

      return matchesSearch && matchesPlan && matchesOrderType && matchesStatus && matchesSchool;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function filteredMessages() {
  const messages = getMessages();

  return messages
    .filter((message) => {
      const text = [
        message.name,
        message.contact,
        message.topic,
        message.message,
        message.reply,
        message.status
      ]
        .join(" ")
        .toLowerCase();

      return !adminState.search || text.includes(adminState.search);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderStats() {
  const leads = getLeads();
  const messages = getMessages();

  const contacted = leads.filter((lead) => lead.status === "Contacted").length;
  const pending = leads.length - contacted;
  const singleOrders = leads.filter((lead) => lead.orderType === "single").length;
  const schools = new Set(leads.map((lead) => lead.school).filter(Boolean)).size;
  const estimatedValue = leads.reduce((sum, lead) => sum + Number(lead.estimatedMonthlyTotal || 0), 0);

  setText("totalLeads", String(leads.length));
  setText("newLeads", String(leads.filter((lead) => lead.status === "New").length));
  setText("singleOrders", String(singleOrders));
  setText("monthlyValue", money.format(estimatedValue));
  setText("messageStat", String(messages.length));

  setText(
    "lastUpdated",
    `Last updated: ${new Intl.DateTimeFormat("en-GH", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date())}`
  );

  setText("leadCountLabel", `${filteredLeads().length} records`);
  setText("messageCountLabel", `${filteredMessages().length} messages`);

  return { leads, messages, contacted, pending, schools };
}

function renderPlanBars() {
  const leads = getLeads();
  const counts = {
    basic: leads.filter((lead) => lead.planId === "basic").length,
    standard: leads.filter((lead) => lead.planId === "standard").length,
    premium: leads.filter((lead) => lead.planId === "premium").length,
    none: leads.filter((lead) => lead.planId === "none").length
  };

  const max = Math.max(1, counts.basic, counts.standard, counts.premium, counts.none);

  const wrap = document.getElementById("planBars");
  if (!wrap) return;

  wrap.innerHTML = Object.entries(PLAN_META)
    .map(([key, meta]) => {
      const count = counts[key] || 0;
      const width = (count / max) * 100;

      return `
        <div class="bar-item">
          <div class="bar-head">
            <strong>${meta.name}</strong>
            <span class="muted">${count} lead${count === 1 ? "" : "s"}</span>
          </div>
          <div class="bar-track"><div style="width:${width}%"></div></div>
        </div>
      `;
    })
    .join("");
}

function renderLeads() {
  const container = document.getElementById("leadsContainer");
  const leads = filteredLeads();

  if (!container) return;

  if (!leads.length) {
    container.innerHTML = `
      <div class="admin-empty">
        <h3>No sign-ups found</h3>
        <p>Try the sample data button or submit a form from the website.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = leads
    .map((lead) => {
      const items = Array.isArray(lead.addOns) ? lead.addOns : [];
      const itemsHtml = items.length
        ? items
            .map(
              (item) => `
                <div class="admin-addon-row">
                  <span>${escapeHTML(item.name)} ${item.unit ? `(${escapeHTML(item.unit)})` : ""} × ${item.quantity}</span>
                  <strong>${money.format(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                </div>
              `
            )
            .join("")
        : `<p class="admin-muted-text">No single items added.</p>`;

      const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      return `
        <article class="lead-card">
          <div class="lead-top">
            <div>
              <div class="lead-name-row">
                <h3>${escapeHTML(lead.fullName || "Unnamed student")}</h3>
                <span class="status-badge status-${String(lead.status || "new").toLowerCase()}">
                  ${escapeHTML(lead.status || "New")}
                </span>
              </div>
              <p class="lead-meta">Submitted ${formatDate(lead.createdAt)}</p>
            </div>

            <div class="lead-total">
              <span>Estimated total</span>
              <strong>${money.format(Number(lead.estimatedMonthlyTotal || 0))}</strong>
            </div>
          </div>

          <div class="lead-details-grid">
            <div><span>Order type</span><strong>${escapeHTML(lead.orderTypeLabel || "—")}</strong></div>
            <div><span>Plan</span><strong>${escapeHTML(lead.planName || "No subscription")} • ${money.format(Number(lead.planPrice || 0))}</strong></div>
            <div><span>Email</span><strong>${lead.email ? `<a href="mailto:${escapeHTML(lead.email)}">${escapeHTML(lead.email)}</a>` : "Not provided"}</strong></div>
            <div><span>Phone</span><strong>${lead.phone ? `<a href="tel:${escapeHTML(lead.phone)}">${escapeHTML(lead.phone)}</a>` : "Not provided"}</strong></div>
            <div><span>School</span><strong>${escapeHTML(lead.school || "—")}</strong></div>
            <div><span>Student type</span><strong>${escapeHTML(lead.studentType || "—")}</strong></div>
            <div><span>Delivery area</span><strong>${escapeHTML(lead.deliveryArea || "—")}</strong></div>
            <div><span>Items selected</span><strong>${totalItems}</strong></div>
          </div>

          ${lead.comments ? `
            <div class="lead-comment-box">
              <span>Student comment / special request</span>
              <p>${escapeHTML(lead.comments)}</p>
            </div>
          ` : ""}

          <details class="lead-addons">
            <summary>Selected items: ${totalItems} ${totalItems === 1 ? "item" : "items"}</summary>
            <div class="admin-addon-list">${itemsHtml}</div>
          </details>

          <div class="lead-controls">
            <label>
              Status
              <select data-status-id="${escapeHTML(lead.id)}">
                ${["New", "Contacted", "Confirmed", "Waitlist", "Cancelled"].map((status) => `
                  <option value="${status}" ${status === lead.status ? "selected" : ""}>${status}</option>
                `).join("")}
              </select>
            </label>

            <label class="lead-notes-label">
              Admin notes
              <textarea rows="3" data-notes-id="${escapeHTML(lead.id)}" placeholder="Add follow-up notes...">${escapeHTML(lead.notes || "")}</textarea>
            </label>

            <div class="lead-button-row">
              <button class="btn btn-secondary" data-save-notes-id="${escapeHTML(lead.id)}" type="button">Save notes</button>
              <button class="btn btn-danger" data-delete-id="${escapeHTML(lead.id)}" type="button">Delete</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  bindLeadEvents();
}

function renderMessages() {
  const container = document.getElementById("messagesContainer");
  const messages = filteredMessages();

  if (!container) return;

  if (!messages.length) {
    container.innerHTML = `
      <div class="admin-empty">
        <h3>No comments yet</h3>
        <p>Student comments and product requests will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages
    .map((message) => {
      return `
        <article class="lead-card">
          <div class="lead-top">
            <div>
              <div class="lead-name-row">
                <h3>${escapeHTML(message.topic || "General feedback")}</h3>
                <span class="status-badge status-${String(message.status || "new").toLowerCase()}">
                  ${escapeHTML(message.status || "New")}
                </span>
              </div>
              <p class="lead-meta">From ${escapeHTML(message.name || "Unknown")} • ${formatDate(message.createdAt)}</p>
            </div>
          </div>

          <div class="lead-details-grid">
            <div><span>Name</span><strong>${escapeHTML(message.name || "—")}</strong></div>
            <div><span>Contact</span><strong>${escapeHTML(message.contact || "—")}</strong></div>
            <div><span>Topic</span><strong>${escapeHTML(message.topic || "—")}</strong></div>
          </div>

          <div class="lead-comment-box">
            <span>Student message</span>
            <p>${escapeHTML(message.message || "")}</p>
          </div>

          <div class="lead-controls">
            <label>
              Status
              <select data-message-status-id="${escapeHTML(message.id)}">
                ${["New", "Replied", "Closed"].map((status) => `
                  <option value="${status}" ${status === message.status ? "selected" : ""}>${status}</option>
                `).join("")}
              </select>
            </label>

            <label class="lead-notes-label">
              Admin reply / note
              <textarea rows="3" data-message-reply-id="${escapeHTML(message.id)}" placeholder="Write a reply note...">${escapeHTML(message.reply || "")}</textarea>
            </label>

            <div class="lead-button-row">
              <button class="btn btn-secondary" data-save-message-id="${escapeHTML(message.id)}" type="button">Save reply</button>
              <button class="btn btn-danger" data-delete-message-id="${escapeHTML(message.id)}" type="button">Delete</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  bindMessageEvents();
}

function bindLeadEvents() {
  document.querySelectorAll("[data-status-id]").forEach((select) => {
    select.addEventListener("change", () => {
      const leads = getLeads();
      const lead = leads.find((item) => item.id === select.dataset.statusId);
      if (!lead) return;

      lead.status = select.value;
      setLeads(leads);
      renderAll();
      toast("Lead status updated.");
    });
  });

  document.querySelectorAll("[data-save-notes-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.saveNotesId;
      const leads = getLeads();
      const lead = leads.find((item) => item.id === id);
      if (!lead) return;

      const textarea = document.querySelector(`[data-notes-id="${CSS.escape(id)}"]`);
      lead.notes = textarea ? textarea.value.trim() : "";

      setLeads(leads);
      renderAll();
      toast("Notes saved.");
    });
  });

  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this lead?")) return;

      const leads = getLeads().filter((item) => item.id !== button.dataset.deleteId);
      setLeads(leads);
      renderAll();
      toast("Lead deleted.");
    });
  });
}

function bindMessageEvents() {
  document.querySelectorAll("[data-message-status-id]").forEach((select) => {
    select.addEventListener("change", () => {
      const messages = getMessages();
      const message = messages.find((item) => item.id === select.dataset.messageStatusId);
      if (!message) return;

      message.status = select.value;
      setMessages(messages);
      renderAll();
      toast("Message status updated.");
    });
  });

  document.querySelectorAll("[data-save-message-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.saveMessageId;
      const messages = getMessages();
      const message = messages.find((item) => item.id === id);
      if (!message) return;

      const textarea = document.querySelector(`[data-message-reply-id="${CSS.escape(id)}"]`);
      message.reply = textarea ? textarea.value.trim() : "";

      setMessages(messages);
      renderAll();
      toast("Reply saved.");
    });
  });

  document.querySelectorAll("[data-delete-message-id]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this message?")) return;

      const messages = getMessages().filter((item) => item.id !== button.dataset.deleteMessageId);
      setMessages(messages);
      renderAll();
      toast("Message deleted.");
    });
  });
}

function exportCSV() {
  const leads = filteredLeads();

  if (!leads.length) {
    toast("No records to export.");
    return;
  }

  const headers = [
    "Full name",
    "Email",
    "Phone",
    "School",
    "Student type",
    "Delivery area",
    "Order type",
    "Plan",
    "Plan price",
    "Items selected",
    "Estimated total",
    "Comments",
    "Status",
    "Admin notes",
    "Created at"
  ];

  const rows = leads.map((lead) => {
    const items = (lead.addOns || [])
      .map((item) => `${item.name} x${item.quantity}`)
      .join("; ");

    return [
      lead.fullName || "",
      lead.email || "",
      lead.phone || "",
      lead.school || "",
      lead.studentType || "",
      lead.deliveryArea || "",
      lead.orderTypeLabel || "",
      lead.planName || "",
      Number(lead.planPrice || 0),
      items,
      Number(lead.estimatedMonthlyTotal || 0),
      lead.comments || "",
      lead.status || "",
      lead.notes || "",
      lead.createdAt || ""
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `basket-refill-gh-export-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
  toast("CSV exported.");
}

function copyEmails() {
  const emails = filteredLeads()
    .map((lead) => lead.email)
    .filter(Boolean)
    .join("\n");

  if (!emails) {
    toast("No emails to copy.");
    return;
  }

  navigator.clipboard.writeText(emails).then(
    () => toast("Emails copied."),
    () => toast("Copy failed.")
  );
}

function addSampleData() {
  const leads = getLeads();
  const messages = getMessages();

  leads.unshift({
    id: `LEAD-${Date.now()}`,
    fullName: "Ama Mensah",
    email: "ama@example.com",
    phone: "024 111 2233",
    school: "University of Ghana, Legon",
    studentType: "University student",
    deliveryArea: "Legon Hall",
    orderType: "single",
    orderTypeLabel: "Single item / one-time order",
    planId: "none",
    planName: "No subscription",
    planPrice: 0,
    addOns: [
      { id: "detergent", name: "Detergent", unit: "1kg", category: "Cleaning", price: 28, quantity: 2, refillable: true },
      { id: "toothpaste", name: "Toothpaste", unit: "Tube", category: "Toiletries", price: 18, quantity: 1, refillable: false }
    ],
    addonTotal: 74,
    estimatedMonthlyTotal: 74,
    comments: "Please deliver to hostel reception.",
    notes: "",
    status: "New",
    createdAt: new Date().toISOString()
  });

  messages.unshift({
    id: `MSG-${Date.now()}`,
    name: "Kwesi Owusu",
    contact: "055 444 1122",
    topic: "Product request",
    message: "Can you add cornflakes and body lotion?",
    reply: "",
    status: "New",
    createdAt: new Date().toISOString()
  });

  setLeads(leads);
  setMessages(messages);
  renderAll();
  toast("Sample data added.");
}

function clearData() {
  if (!confirm("Clear local leads and messages from this browser?")) return;

  setLeads([]);
  setMessages([]);
  renderAll();
  toast("Local data cleared.");
}

function refreshView() {
  renderAll();
  toast("Dashboard refreshed.");
}

function logout() {
  if (window.BRGHAuth) {
    BRGHAuth.logoutAll();
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }

  window.location.href = "login.html?role=admin";
}

function renderAll() {
  const { leads, messages, schools } = renderStats();

  renderPlanBars();
  loadSchools();
  renderLeads();
  renderMessages();

  setText("leadCountLabel", `${filteredLeads().length} record${filteredLeads().length === 1 ? "" : "s"}`);
  setText("messageCountLabel", `${filteredMessages().length} message${filteredMessages().length === 1 ? "" : "s"}`);
  setText("schoolCount", String(schools));
}

function bindTopControls() {
  const searchInput = document.getElementById("searchInput");
  const planFilter = document.getElementById("planFilter");
  const orderTypeFilter = document.getElementById("orderTypeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const schoolFilter = document.getElementById("schoolFilter");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      adminState.search = e.target.value.toLowerCase().trim();
      renderLeads();
      renderMessages();
      renderStats();
    });
  }

  if (planFilter) {
    planFilter.addEventListener("change", (e) => {
      adminState.plan = e.target.value;
      renderAll();
    });
  }

  if (orderTypeFilter) {
    orderTypeFilter.addEventListener("change", (e) => {
      adminState.orderType = e.target.value;
      renderAll();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      adminState.status = e.target.value;
      renderAll();
    });
  }

  if (schoolFilter) {
    schoolFilter.addEventListener("change", (e) => {
      adminState.school = e.target.value;
      renderAll();
    });
  }

  const refreshBtn = document.getElementById("refreshBtn");
  const seedBtn = document.getElementById("seedBtn");
  const exportBtn = document.getElementById("exportBtn");
  const copyEmailsBtn = document.getElementById("copyEmailsBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (refreshBtn) refreshBtn.addEventListener("click", refreshView);
  if (seedBtn) seedBtn.addEventListener("click", addSampleData);
  if (exportBtn) exportBtn.addEventListener("click", exportCSV);
  if (copyEmailsBtn) copyEmailsBtn.addEventListener("click", copyEmails);
  if (clearDataBtn) clearDataBtn.addEventListener("click", clearData);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

function bindNavToggle() {
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

document.addEventListener("DOMContentLoaded", () => {
  bindNavToggle();
  bindTopControls();
  renderAll();
});
})();