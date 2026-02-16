let contacts = [];
let activeContact = null;
let showFavoritesOnly = false;


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
            contacts.sort((a, b) => b.favorite - a.favorite);
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
    const list = showFavoritesOnly
        ? contacts.filter(c => Number(c.favorite) === 1)
        : contacts;

    list.forEach((c) => {
        const card = document.createElement("div");
        card.className = "contact-card";

        const initials =
            (c.firstName?.[0] || "") + (c.lastName?.[0] || "");

        card.innerHTML = `
  <div class="card-accent"></div>

  <div class="card-top">

    <div class="card-left">
      <div class="card-avatar">${initials}</div>

      <div class="card-name-inline">
        ${c.firstName} ${c.lastName}
      </div>
    </div>

    <div class="card-actions">

    <button class="fav-btn ${Number(c.favorite) === 1 ? "active" : ""}"
            onclick="toggleFavorite(event, ${c.id})">

      <svg class="fav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"/>
      </svg>
    </button>


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

  </div>

  <div class="card-info-box">
    <div class="info-row">
        <i class="fa-solid fa-phone copy-icon" onclick="copyText(event, '${c.phone}')"></i>
        ${formatPhone(c.phone)}
    </div>

    <div class="info-row">
        <i class="fa-solid fa-envelope copy-icon" onclick="copyText(event, '${c.email}')"></i>
        ${c.email}
    </div>
  </div>
  
  <div class="card-toast" aria-live="polite"></div>
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
    <input id="editFirst" placeholder="First Name" value="${c.firstName}">
    <input id="editLast" placeholder="Last Name" value="${c.lastName}">
    <input id="editPhone" placeholder="Phone" value="${c.phone}">
    <input id="editEmail" placeholder="Email" value="${c.email}">
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

function toggleFavorite(e, id) {
    e.stopPropagation();

    fetch(API_BASE + "ToggleFavorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contactId: id,
            userId: localStorage.getItem("userId")
        })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                searchContacts(); // refresh list
            }
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

function copyText(e, text) {
    e.stopPropagation();
    navigator.clipboard.writeText(text)
        .then(() => {
            const card = e.target.closest(".contact-card");
            if (!card) {
                return;
            }
            const toast = card.querySelector(".card-toast");
            if (!toast) {
                return;
            }
            toast.innerText = "Copied to clipboard!";
            toast.classList.add("show");
            clearTimeout(toast._t);
            toast._t = setTimeout(() => toast.classList.remove("show"), 900);
        })
        .catch(() => {
            const card = e.target.closest(".contact-card");
            const toast = card?.querySelector(".card-toast");
            if (!toast) {
                return;
            }
            toast.innerText = "Failed to copy.";
            toast.classList.add("show");
            clearTimeout(toast._t);
            toast._t = setTimeout(() => toast.classList.remove("show"), 1200);
        });
}

function updateCount() {
    const el = document.getElementById("contactsCount");
    if (!el) return;

    const visible = showFavoritesOnly
        ? contacts.filter(c => Number(c.favorite) === 1).length
        : contacts.length;

    el.textContent = `${visible} of ${contacts.length} contacts`;
}

function showAllContacts() {
    showFavoritesOnly = false;

    document.getElementById("homeBtn").classList.add("active");
    document.getElementById("favBtn").classList.remove("active");

    renderContacts();
    updateCount();
}

function showFavoriteContacts() {
    showFavoritesOnly = true;

    document.getElementById("favBtn").classList.add("active");
    document.getElementById("homeBtn").classList.remove("active");

    renderContacts();
    updateCount();
}




