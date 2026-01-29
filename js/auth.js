function doLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    let payload = JSON.stringify({ login: login, password: password });

    fetch(API_BASE + "Login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showMessage(data.error);
        } else {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("firstName", data.firstName);
            window.location.href = "contacts.html";
        }
    });
}

function doRegister() {
    let first = document.getElementById("regFirst").value;
    let last = document.getElementById("regLast").value;
    let login = document.getElementById("regLogin").value;
    let pass = document.getElementById("regPass").value;

    let payload = JSON.stringify({
        firstName: first,
        lastName: last,
        login: login,
        password: pass
    });

    fetch(API_BASE + "Register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showMessage(data.error);
        } else {
            // Auto-fill login fields and log in immediately
            document.getElementById("loginName").value = login;
            document.getElementById("loginPassword").value = pass;
            doLogin();
        }
    });
}

function showMessage(msg) {
    document.getElementById("msgBox").innerText = msg;
}
