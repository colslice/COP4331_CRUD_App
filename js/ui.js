function renderContacts(list) {
    let container = document.getElementById("contactList");
    container.innerHTML = "";

    list.forEach(c => {
        container.innerHTML += `
        <div class="contact-card">
            <div>
                <strong>${c.firstName} ${c.lastName}</strong>
                <div>${c.phone}</div>
                <div>${c.email}</div>
            </div>
            <button onclick="deleteContact(${c.id})">Delete</button>
        </div>`;
    });
}
