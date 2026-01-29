function loadContacts() {
    let payload = JSON.stringify({ userId: localStorage.getItem("userId"), search: "" });

    fetch(API_BASE + "SearchContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
    })
    .then(res => res.json())
    .then(data => renderContacts(data.results || []));
}

function addContact() {
    let payload = JSON.stringify({
        firstName: document.getElementById("cFirst").value,
        lastName: document.getElementById("cLast").value,
        phone: document.getElementById("cPhone").value,
        email: document.getElementById("cEmail").value,
        userId: localStorage.getItem("userId")
    });

    fetch(API_BASE + "CreateContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
    }).then(() => loadContacts());
}

function deleteContact(id) {
    fetch(API_BASE + "DeleteContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    }).then(() => loadContacts());
}
