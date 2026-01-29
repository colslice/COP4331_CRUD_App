let contacts = [];
let activeContact = null;

/* =========================
   INIT
========================= */
function initContacts() {
    const uid = localStorage.getItem("userId");
    if (!uid) window.location.href = "index.html";
    searchContacts();
}

/* =========================
   SEARCH & RENDER
========================= */
function searchContacts() {
    const search = document.getElementById("searchInput").value || "";

    fetch(API_BASE + "SearchContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            search,
            userId: localStorage.getItem("userId")
        })
    })
        .then(res => res.json())
        .then(data => {
            contacts = data.results || [];
            renderContacts();
        });
}

function renderContacts() {
    const grid = document.getElementById("contactGrid");
    grid.innerHTML = "";

    contacts.forEach(c => {
        const tile = document.createElement("div");
        tile.className = "contact-tile";
        tile.onclick = () => openViewModal(c);

        tile.innerHTML = `
            <div class="initial-circle">
                ${c.firstName[0]}${c.lastName[0]}
            </div>
            <div class="contact-info">
                <strong>${c.firstName} ${c.lastName}</strong>
                <span>${c.email}</span>
                <span>${formatPhone(c.phone)}</span>
            </div>
        `;

        grid.appendChild(tile);
    });
}

/* =========================
   PANELS
========================= */
function openAddModal() {
    document.getElementById("addPanel").classList.add("open");
    showOverlay();
}

function openViewModal(c) {
    activeContact = c;
    const content = document.getElementById("viewPanelContent");

    content.innerHTML = `
        <div class="initial-circle" style="margin-bottom:16px">
            ${c.firstName[0]}${c.lastName[0]}
        </div>
        <h2>${c.firstName} ${c.lastName}</h2>
        <p>${formatPhone(c.phone)}</p>
        <p>${c.email}</p>
        <div class="button-row">
            <button onclick="startEdit()">Edit</button>
            <button class="secondary" onclick="deleteContact()">Delete</button>
        </div>
    `;

    document.getElementById("viewPanel").classList.add("open");
    showOverlay();
}

function startEdit() {
    const c = activeContact;
    const content = document.getElementById("viewPanelContent");

    content.innerHTML = `
        <input id="editFirst" value="${c.firstName}">
        <input id="editLast" value="${c.lastName}">
        <input id="editPhone" value="${c.phone}">
        <input id="editEmail" value="${c.email}">
        <div class="button-row">
            <button onclick="saveEdit()">Save</button>
            <button class="secondary" onclick="openViewModal(activeContact)">Cancel</button>
        </div>
    `;
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
            userId: localStorage.getItem("userId")
        })
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
            email: editEmail.value
        })
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
            userId: localStorage.getItem("userId")
        })
    }).then(() => {
        closePanels();
        searchContacts();
    });
}

/* =========================
   UI HELPERS
========================= */
function closePanels() {
    document.querySelectorAll(".side-panel")
        .forEach(p => p.classList.remove("open"));
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
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return phone;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function updatePreview() {
    const first = addFirst.value || "First";
    const last = addLast.value || "Last";
    const phone = formatPhone(addPhone.value || "5555555555");
    const email = addEmail.value || "email@example.com";

    document.querySelector("#previewTile .initial-circle").innerText =
        first[0] + last[0];

    document.querySelector("#previewTile strong").innerText =
        `${first} ${last}`;

    document.querySelector("#previewTile span:nth-child(2)").innerText = phone;
    document.querySelector("#previewTile span:nth-child(3)").innerText = email;
}
