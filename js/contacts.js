let contacts = [];
let activeContact = null;

/* =========================
   INIT
========================= */
function initContacts() {
    const uid = localStorage.getItem("userId");
    if (!uid) window.location.href = "index.html";
    setUsernamePill();
    initTheme();
    searchContacts();
}

/* function puts username's first name at the bottom left of left sidebar */
function setUsernamePill() {
    const name = localStorage.getItem("firstName") || "Username";
    const pill = document.querySelector(".user-pill");
    if (pill) {
        pill.textContent = name;
    }
}

/* function restores the theme */
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
    }
}

/* function switches the theme */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
}

/* search */
function searchContacts() {
    const search = document.getElementById("searchInput")?.value || "";

    fetch(API_BASE + "SearchContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            search,
            userId: localStorage.getItem("userId"),
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            contacts = data.results || [];
            renderContacts();
            updateCount();
        });
}

// function updates the amount of contacts
function updateCount() {
    const el = document.getElementById("contactsCount");
    if (el) {
        el.textContent = `${contacts.length} of ${contacts.length} contacts`;
    }
}

/* contact */
function renderContacts() {
    const grid = document.getElementById("contactGrid");
    grid.innerHTML = "";

    contacts.forEach((c) => {
        const card = document.createElement("div");
        card.className = "contact-card";

        const initials =
            (c.firstName?.[0] || "") + (c.lastName?.[0] || "");

        card.innerHTML = `
      <div class="card-accent"></div>

      <div class="card-top">
        <div class="card-avatar">${initials}</div>

        <div class="menu-wrap">
          <button class="card-icon-btn" onclick="toggleMenu(event, ${c.id})">
            <i class="fa-solid fa-ellipsis"></i>
          </button>

          <div class="menu" id="menu-${c.id}">
            <button class="menu-item" onclick="menuEdit(event, ${c.id})">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="menu-item danger" onclick="menuDelete(event, ${c.id})">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <div class="card-name">
        <div class="card-first">${c.firstName}</div>
        <div class="card-last">${c.lastName}</div>
      </div>

      <div class="card-info-box">
        <div class="info-row">
          <i class="fa-solid fa-phone"></i>
          ${formatPhone(c.phone)}
        </div>
        <div class="info-row">
          <i class="fa-solid fa-envelope"></i>
          ${c.email}
        </div>
      </div>
    `;

        grid.appendChild(card);
    });
}

/* 3 dot menu */
//function opens the 3 dot menu for the card and closes the others
function toggleMenu(e, id) {
    e.stopPropagation();

    document.querySelectorAll(".menu").forEach((m) => {
        if (m.id !== `menu-${id}`) m.classList.remove("open");
    });

    document.getElementById(`menu-${id}`).classList.toggle("open");
}

//close the menu when click outside
document.addEventListener("click", () => {
    document.querySelectorAll(".menu").forEach((m) => m.classList.remove("open"));
});

//function opens the edit panel for the selected card
function menuEdit(e, id) {
    e.stopPropagation();
    activeContact = contacts.find((c) => c.id === id);
    openEditPanel();
}

//function deletes selected contact card
function menuDelete(e, id) {
    e.stopPropagation();
    activeContact = contacts.find((c) => c.id === id);
    deleteContact();
}

/* =========================
   PANELS
========================= */
function openAddModal() {
    resetAddForm();
    document.getElementById("addPanel").classList.add("open");
    showOverlay();
}

function openEditPanel() {
    const c = activeContact;
    const content = document.getElementById("viewPanelContent");

    content.innerHTML = `
    <input id="editFirst" value="${c.firstName}">
    <input id="editLast" value="${c.lastName}">
    <input id="editPhone" value="${c.phone}">
    <input id="editEmail" value="${c.email}">
    <div class="button-row">
      <button onclick="saveEdit()">Save</button>
      <button class="secondary" onclick="closePanels()">Cancel</button>
    </div>
  `;

    document.getElementById("viewPanel").classList.add("open");
    showOverlay();
}

/* =========================
   API ACTIONS
========================= */
function submitAdd() {
    fetch(API_BASE + "CreateContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: addFirst.value,
            lastName: addLast.value,
            phone: addPhone.value,
            email: addEmail.value,
            userId: localStorage.getItem("userId"),
        }),
    }).then(() => {
        closePanels();
        searchContacts();
    });
}

function saveEdit() {
    fetch(API_BASE + "UpdateContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: activeContact.id,
            userId: localStorage.getItem("userId"),
            firstName: editFirst.value,
            lastName: editLast.value,
            phone: editPhone.value,
            email: editEmail.value,
        }),
    }).then(() => {
        closePanels();
        searchContacts();
    });
}

function deleteContact() {
    fetch(API_BASE + "DeleteContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: activeContact.id,
            userId: localStorage.getItem("userId"),
        }),
    }).then(() => {
        closePanels();
        searchContacts();
    });
}

/* =========================
   UI HELPERS
========================= */
function closePanels() {
    document.querySelectorAll(".side-panel").forEach((p) =>
        p.classList.remove("open")
    );
    hideOverlay();
}

function showOverlay() {
    document.getElementById("overlay").classList.add("show");
}

function hideOverlay() {
    document.getElementById("overlay").classList.remove("show");
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

/* =========================
   UTILITIES
========================= */
function formatPhone(phone) {
    const d = phone.replace(/\D/g, "");
    if (d.length !== 10) return phone;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function updatePreview() {
    const first = addFirst.value || "First";
    const last = addLast.value || "Last";

    document.querySelector("#previewTile .initial-circle").innerText =
        first[0] + last[0];
    document.querySelector("#previewTile strong").innerText =
        `${first} ${last}`;
    document.querySelector("#previewTile span:nth-child(2)").innerText =
        formatPhone(addPhone.value || "5555555555");
    document.querySelector("#previewTile span:nth-child(3)").innerText =
        addEmail.value || "email@example.com";
}

function resetAddForm() {
    addFirst.value = "";
    addLast.value = "";
    addPhone.value = "";
    addEmail.value = "";
    updatePreview();
}
