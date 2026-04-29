const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const logoutBtn = document.querySelector("#logoutBtn");
const userInfo = document.querySelector("#userInfo");
const homeLink = document.querySelector("#homeLink");

function getApiBase() {
    const path = window.location.pathname;

    if (path.includes("/views/auth/")) {
        return "../../api";
    }

    if (path.includes("/views/")) {
        return "../api";
    }

    return "api";
}

const API_BASE = getApiBase();

function showAlert(type, title, message) {
    Swal.fire({
        icon: type,
        title: title,
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: type === "success" ? "#22c55e" : "#ef4444",
        background: "#111820",
        color: "#f5f5f0",
        customClass: {
            popup: "custom-alert-popup",
            title: "custom-alert-title",
            confirmButton: "custom-alert-button"
        }
    });
}

function showSuccessAndRedirect(title, message, redirectUrl, buttonText = "Continue") {
    Swal.fire({
        icon: "success",
        title: title,
        text: message,
        confirmButtonText: buttonText,
        confirmButtonColor: "#22c55e",
        background: "#111820",
        color: "#f5f5f0",
        customClass: {
            popup: "custom-alert-popup",
            title: "custom-alert-title",
            confirmButton: "custom-alert-button"
        }
    }).then(() => {
        window.location.href = redirectUrl;
    });
}

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
        const targetId = button.dataset.target;
        const passwordInput = document.querySelector(`#${targetId}`);

        if (!passwordInput) {
            return;
        }

        const passwordIsHidden = passwordInput.type === "password";

        if (passwordIsHidden) {
            passwordInput.type = "text";
            button.classList.add("is-visible");
            button.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            button.classList.remove("is-visible");
            button.setAttribute("aria-label", "Show password");
        }
    });
});

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(registerForm);

        const password = formData.get("password");
        const confirmPassword = formData.get("confirm_password");

        if (password !== confirmPassword) {
            showAlert(
                "error",
                "Passwords do not match",
                "Please make sure both password fields are the same."
            );
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/register.php`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                registerForm.reset();

                showSuccessAndRedirect(
                    "Account created!",
                    result.message,
                    "login.html",
                    "Go to login"
                );
            } else {
                showAlert("error", "Registration failed", result.message);
            }
        } catch (error) {
            showAlert(
                "error",
                "Connection error",
                "Something went wrong. Please try again."
            );
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        try {
            const response = await fetch(`${API_BASE}/login.php`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Welcome back!",
                    text: result.message,
                    timer: 1200,
                    showConfirmButton: false,
                    background: "#111820",
                    color: "#f5f5f0",
                    customClass: {
                        popup: "custom-alert-popup",
                        title: "custom-alert-title"
                    }
                }).then(() => {
                    window.location.href = "../home.html";
                });
            } else {
                showAlert("error", "Login failed", result.message);
            }
        } catch (error) {
            showAlert(
                "error",
                "Connection error",
                "Something went wrong. Please try again."
            );
        }
    });
}

async function checkSession() {
    if (!userInfo) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/session.php`);
        const result = await response.json();

        const loginLink = document.querySelector("#loginLink");
        const registerLink = document.querySelector("#registerLink");

        if (result.logged_in) {
            userInfo.textContent = `Welcome, ${result.user.name}. Your role is ${result.user.role}.`;

            if (logoutBtn) {
                logoutBtn.hidden = false;
            }

            if (loginLink) {
                loginLink.hidden = true;
            }

            if (registerLink) {
                registerLink.hidden = true;
            }
        } else {
            userInfo.textContent = "You are not logged in.";

            if (logoutBtn) {
                logoutBtn.hidden = true;
            }

            if (loginLink) {
                loginLink.hidden = false;
            }

            if (registerLink) {
                registerLink.hidden = false;
            }
        }
    } catch (error) {
        userInfo.textContent = "Could not check session.";
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        try {
            const response = await fetch(`${API_BASE}/logout.php`);
            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Logged out",
                    text: result.message,
                    timer: 1100,
                    showConfirmButton: false,
                    background: "#111820",
                    color: "#f5f5f0",
                    customClass: {
                        popup: "custom-alert-popup",
                        title: "custom-alert-title"
                    }
                }).then(() => {
                    window.location.href = "auth/login.html";
                });
            } else {
                showAlert("error", "Logout failed", "Could not log out. Please try again.");
            }
        } catch (error) {
            showAlert("error", "Logout failed", "Could not log out. Please try again.");
        }
    });
}

if (homeLink) {
    homeLink.addEventListener("click", function (event) {
        event.preventDefault();
        checkSession();
    });
}

checkSession();