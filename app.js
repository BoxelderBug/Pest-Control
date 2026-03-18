const STORAGE_KEY = "pest-control-hq-v1";

const defaultState = {
  customers: [
    {
      id: crypto.randomUUID(),
      name: "Miller Family",
      property: "1420 Oak Ridge Dr",
      city: "Omaha, NE",
      pestFocus: "Quarterly perimeter",
      status: "Active",
      technician: "Nolan",
      intervalDays: 90,
      lastService: "2026-03-05",
      nextService: "2026-06-03"
    },
    {
      id: crypto.randomUUID(),
      name: "Red Barn Storage",
      property: "885 Highway 6",
      city: "Council Bluffs, IA",
      pestFocus: "Rodent stations",
      status: "Follow-up",
      technician: "Chris",
      intervalDays: 30,
      lastService: "2026-03-12",
      nextService: "2026-04-11"
    },
    {
      id: crypto.randomUUID(),
      name: "Harper Dental",
      property: "2109 84th St",
      city: "Omaha, NE",
      pestFocus: "Commercial interior",
      status: "Active",
      technician: "Nolan",
      intervalDays: 21,
      lastService: "2026-03-17",
      nextService: "2026-04-07"
    }
  ],
  visits: [],
  notes: []
};

const appState = loadState();

const statsGrid = document.querySelector("[data-stats]");
const customersTable = document.querySelector("[data-customers-table]");
const scheduleLists = Array.from(document.querySelectorAll("[data-schedule-list]"));
const visitsList = document.querySelector("[data-visits-list]");
const notesList = document.querySelector("[data-notes-list]");
const customerSelect = document.querySelector("#visit-customer");
const noteCustomerSelect = document.querySelector("#note-customer");
const navButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
const addCustomerForm = document.querySelector("#customer-form");
const addVisitForm = document.querySelector("#visit-form");
const addNoteForm = document.querySelector("#note-form");
const resetButton = document.querySelector("#reset-demo-data");
const exportButton = document.querySelector("#export-data");
const messageBox = document.querySelector("[data-message]");

setDefaultDates();
seedVisitsAndNotes();
renderAll();

navButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget || "dashboard"));
});

addCustomerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(addCustomerForm);
  const customer = {
    id: crypto.randomUUID(),
    name: String(form.get("name") || "").trim(),
    property: String(form.get("property") || "").trim(),
    city: String(form.get("city") || "").trim(),
    pestFocus: String(form.get("pestFocus") || "").trim(),
    status: "Active",
    technician: String(form.get("technician") || "").trim(),
    intervalDays: clampNumber(form.get("intervalDays"), 7, 365, 30),
    lastService: "",
    nextService: String(form.get("nextService") || "").trim()
  };

  if (!customer.name || !customer.property || !customer.city || !customer.technician || !customer.nextService) {
    setMessage("Fill out all customer fields before saving.", true);
    return;
  }

  appState.customers.unshift(customer);
  persistState();
  addCustomerForm.reset();
  renderAll();
  setMessage(`Added ${customer.name} to the route board.`);
});

addVisitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(addVisitForm);
  const customerId = String(form.get("customerId") || "");
  const customer = appState.customers.find((item) => item.id === customerId);

  if (!customer) {
    setMessage("Choose a customer before logging a visit.", true);
    return;
  }

  const visit = {
    id: crypto.randomUUID(),
    customerId,
    date: String(form.get("date") || ""),
    serviceType: String(form.get("serviceType") || "").trim(),
    status: String(form.get("status") || "").trim(),
    technician: String(form.get("technician") || "").trim(),
    duration: clampNumber(form.get("duration"), 10, 480, 45),
    notes: String(form.get("notes") || "").trim()
  };

  if (!visit.date || !visit.serviceType || !visit.status || !visit.technician) {
    setMessage("Fill out the visit form before saving.", true);
    return;
  }

  appState.visits.unshift(visit);
  customer.lastService = visit.date;
  customer.nextService = addDays(visit.date, customer.intervalDays);
  customer.status = visit.status === "Completed" ? "Active" : visit.status;

  persistState();
  addVisitForm.reset();
  renderAll();
  setMessage(`Logged ${visit.serviceType.toLowerCase()} for ${customer.name}.`);
});

addNoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(addNoteForm);
  const customerId = String(form.get("customerId") || "");
  const customer = appState.customers.find((item) => item.id === customerId);
  const note = {
    id: crypto.randomUUID(),
    customerId,
    author: String(form.get("author") || "").trim(),
    date: String(form.get("date") || ""),
    text: String(form.get("text") || "").trim()
  };

  if (!customer || !note.author || !note.date || !note.text) {
    setMessage("Fill out the technician note form before saving.", true);
    return;
  }

  appState.notes.unshift(note);
  persistState();
  addNoteForm.reset();
  renderAll();
  setMessage(`Added a technician note for ${customer.name}.`);
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

exportButton.addEventListener("click", () => {
  const payload = JSON.stringify(appState, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pest-control-hq-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setMessage("Exported local data snapshot.");
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }
    const parsed = JSON.parse(raw);
    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : structuredClone(defaultState.customers),
      visits: Array.isArray(parsed.visits) ? parsed.visits : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function seedVisitsAndNotes() {
  if (appState.visits.length > 0 || appState.notes.length > 0) {
    return;
  }

  const [miller, redBarn, harper] = appState.customers;
  appState.visits = [
    {
      id: crypto.randomUUID(),
      customerId: harper.id,
      date: "2026-03-17",
      serviceType: "Interior service",
      status: "Completed",
      technician: "Nolan",
      duration: 55,
      notes: "Replaced glue boards in break room and storage closet."
    },
    {
      id: crypto.randomUUID(),
      customerId: redBarn.id,
      date: "2026-03-12",
      serviceType: "Rodent station check",
      status: "Follow-up",
      technician: "Chris",
      duration: 40,
      notes: "Two exterior stations showed activity on the west fence."
    },
    {
      id: crypto.randomUUID(),
      customerId: miller.id,
      date: "2026-03-05",
      serviceType: "Quarterly perimeter",
      status: "Completed",
      technician: "Nolan",
      duration: 35,
      notes: "Granular bait added around shed and mulch line."
    }
  ];

  appState.notes = [
    {
      id: crypto.randomUUID(),
      customerId: redBarn.id,
      author: "Chris",
      date: "2026-03-12",
      text: "Need to check dock door sweep on next stop. Heavy rub marks behind unit C."
    },
    {
      id: crypto.randomUUID(),
      customerId: harper.id,
      author: "Nolan",
      date: "2026-03-17",
      text: "Office manager wants early-morning appointments only."
    }
  ];

  persistState();
}

function renderAll() {
  renderStats();
  renderCustomers();
  renderSchedule();
  renderVisits();
  renderNotes();
  renderSelects();
}

function renderStats() {
  const now = todayKey();
  const activeCustomers = appState.customers.filter((item) => item.status !== "Inactive").length;
  const upcoming = appState.customers.filter((item) => item.nextService && item.nextService >= now).length;
  const completedThisWeek = appState.visits.filter((item) => item.status === "Completed" && daysBetween(item.date, now) <= 7).length;
  const followUps = appState.customers.filter((item) => item.status === "Follow-up").length;

  statsGrid.innerHTML = [
    statCard("Active Accounts", String(activeCustomers), "Live residential and commercial stops."),
    statCard("Upcoming Services", String(upcoming), "Customers with a scheduled next service date."),
    statCard("Completed This Week", String(completedThisWeek), "Finished visits in the last seven days."),
    statCard("Follow-ups", String(followUps), "Accounts that need another look.")
  ].join("");
}

function renderCustomers() {
  const rows = appState.customers
    .slice()
    .sort((a, b) => a.nextService.localeCompare(b.nextService))
    .map((customer) => `
      <tr>
        <td>${escapeHtml(customer.name)}</td>
        <td>${escapeHtml(customer.property)}</td>
        <td>${escapeHtml(customer.city)}</td>
        <td>${escapeHtml(customer.pestFocus)}</td>
        <td><span class="status-pill status-${slugify(customer.status)}">${escapeHtml(customer.status)}</span></td>
        <td>${escapeHtml(customer.technician)}</td>
        <td>${formatDate(customer.lastService) || "Not logged"}</td>
        <td>${formatDate(customer.nextService)}</td>
      </tr>
    `)
    .join("");

  customersTable.innerHTML = rows;
}

function renderSchedule() {
  const items = appState.customers
    .slice()
    .sort((a, b) => a.nextService.localeCompare(b.nextService))
    .map((customer) => `
      <article class="schedule-item">
        <div>
          <p class="eyebrow">${formatDate(customer.nextService)}</p>
          <h3>${escapeHtml(customer.name)}</h3>
          <p>${escapeHtml(customer.property)} · ${escapeHtml(customer.city)}</p>
        </div>
        <div class="schedule-meta">
          <span>${escapeHtml(customer.pestFocus)}</span>
          <span>${escapeHtml(customer.technician)}</span>
        </div>
      </article>
    `)
    .join("");

  scheduleLists.forEach((list) => {
    list.innerHTML = items;
  });
}

function renderVisits() {
  const items = appState.visits
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((visit) => {
      const customer = appState.customers.find((item) => item.id === visit.customerId);
      return `
        <article class="log-card">
          <div class="log-card-head">
            <div>
              <p class="eyebrow">${formatDate(visit.date)}</p>
              <h3>${escapeHtml(customer ? customer.name : "Unknown account")}</h3>
            </div>
            <span class="status-pill status-${slugify(visit.status)}">${escapeHtml(visit.status)}</span>
          </div>
          <p>${escapeHtml(visit.serviceType)} · ${escapeHtml(visit.technician)} · ${visit.duration} min</p>
          <p class="muted">${escapeHtml(visit.notes || "No visit notes recorded.")}</p>
        </article>
      `;
    })
    .join("");

  visitsList.innerHTML = items;
}

function renderNotes() {
  const items = appState.notes
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((note) => {
      const customer = appState.customers.find((item) => item.id === note.customerId);
      return `
        <article class="note-card">
          <div class="log-card-head">
            <div>
              <p class="eyebrow">${formatDate(note.date)}</p>
              <h3>${escapeHtml(customer ? customer.name : "Unknown account")}</h3>
            </div>
            <span>${escapeHtml(note.author)}</span>
          </div>
          <p class="muted">${escapeHtml(note.text)}</p>
        </article>
      `;
    })
    .join("");

  notesList.innerHTML = items;
}

function renderSelects() {
  const options = appState.customers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((customer) => `<option value="${customer.id}">${escapeHtml(customer.name)} · ${escapeHtml(customer.city)}</option>`)
    .join("");

  customerSelect.innerHTML = `<option value="">Select customer</option>${options}`;
  noteCustomerSelect.innerHTML = `<option value="">Select customer</option>${options}`;
}

function setDefaultDates() {
  const today = todayKey();
  const defaultNext = addDays(today, 30);
  const visitDateInput = addVisitForm.querySelector("input[name='date']");
  const noteDateInput = addNoteForm.querySelector("input[name='date']");
  const nextServiceInput = addCustomerForm.querySelector("input[name='nextService']");

  visitDateInput.value = today;
  noteDateInput.value = today;
  nextServiceInput.value = defaultNext;
}

function setActiveTab(tabId) {
  navButtons.forEach((button) => {
    const active = button.dataset.tabTarget === tabId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== tabId;
  });
}

function setMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.dataset.tone = isError ? "error" : "success";
}

function statCard(label, value, detail) {
  return `
    <article class="stat-card">
      <p>${label}</p>
      <strong>${value}</strong>
      <span>${detail}</span>
    </article>
  `;
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  return Math.floor((end - start) / (24 * 60 * 60 * 1000));
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(Math.max(numeric, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}
