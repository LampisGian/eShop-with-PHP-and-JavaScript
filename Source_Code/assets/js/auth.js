// This file handles user authentication and session management for the e-commerce application. It includes event listeners for login and registration forms, as well as a logout button. 
// The script checks the user's session on page load to update the UI accordingly, showing or hiding menu items based on the user's authentication status and role. 
// It also provides utility functions for displaying alerts and updating the cart badge in the navigation menu. 
// The API base URL is determined dynamically based on the current page's location to ensure that API requests are correctly routed regardless of the directory structure of the views.

const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const logoutBtn = document.querySelector("#logoutBtn");
const userInfo = document.querySelector("#userInfo");
const homeLink = document.querySelector("#homeLink");
const homeMenuLink = document.querySelector("#homeMenuLink");
const menuToggle = document.querySelector("#menuToggle");
const mainMenu = document.querySelector("#mainMenu");

function getApiBase() {
    const path = window.location.pathname;

    if (path.includes("/views/auth/")) {
        return "../../api";
    }

    if (path.includes("/views/seller/")) {
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

function updateCartBadge() {
    const cartBadge = document.querySelector("#cartBadge");

    if (!cartBadge) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem("eshop_cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadge.textContent = totalItems;
    cartBadge.hidden = totalItems === 0;
}

if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        mainMenu.classList.toggle("open");
        menuToggle.classList.toggle("open");
    });

    mainMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        mainMenu.classList.remove("open");
        menuToggle.classList.remove("open");
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
                const redirectUrl = result.user && result.user.role === "seller"
                    ? "../seller/dashboard.html"
                    : "../home.html";

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
                    window.location.href = redirectUrl;
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
    const menuWelcomeName = document.querySelector("#menuWelcomeName");
    const menuAccountRole = document.querySelector("#menuAccountRole");
    const profileLink = document.querySelector("#profileLink");

    try {
        const response = await fetch(`${API_BASE}/session.php`);
        const result = await response.json();

        const loginLink = document.querySelector("#loginLink");
        const registerLink = document.querySelector("#registerLink");
        const sellerDashboardLink = document.querySelector("#sellerDashboardLink");
        const cartLink = document.querySelector("#cartLink");

        if (result.logged_in) {
            if (userInfo) {
                userInfo.textContent = `Welcome, ${result.user.name}. Your role is ${result.user.role}.`;
            }

            if (menuWelcomeName) {
                menuWelcomeName.textContent = `Welcome, ${result.user.name}`;
            }

            if (menuAccountRole) {
                menuAccountRole.textContent = `${result.user.role.charAt(0).toUpperCase() + result.user.role.slice(1)} account`;
            }

            if (profileLink) {
                profileLink.hidden = false;
            }

            if (logoutBtn) {
                logoutBtn.hidden = false;
            }

            if (loginLink) {
                loginLink.hidden = true;
            }

            if (registerLink) {
                registerLink.hidden = true;
            }

            if (sellerDashboardLink) {
                sellerDashboardLink.hidden = result.user.role !== "seller";
            }

            if (cartLink) {
                cartLink.hidden = result.user.role === "seller";
            }
        } else {
            if (userInfo) {
                userInfo.textContent = "You are not logged in.";
            }

            if (menuWelcomeName) {
                menuWelcomeName.textContent = "Welcome, Guest";
            }

            if (menuAccountRole) {
                menuAccountRole.textContent = "Guest account";
            }

            if (profileLink) {
                profileLink.hidden = true;
            }

            if (logoutBtn) {
                logoutBtn.hidden = true;
            }

            if (loginLink) {
                loginLink.hidden = false;
            }

            if (registerLink) {
                registerLink.hidden = false;
            }

            if (sellerDashboardLink) {
                sellerDashboardLink.hidden = true;
            }

            if (cartLink) {
                cartLink.hidden = false;
            }
        }

        updateCartBadge();
    } catch (error) {
        if (userInfo) {
            userInfo.textContent = "Could not check session.";
        }

        updateCartBadge();
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
                    const path = window.location.pathname;

                    if (path.includes("/views/seller/")) {
                        window.location.href = "../auth/login.html";
                    } else if (path.includes("/views/auth/")) {
                        window.location.href = "login.html";
                    } else {
                        window.location.href = "auth/login.html";
                    }
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

if (homeMenuLink) {
    homeMenuLink.addEventListener("click", function (event) {
        event.preventDefault();
        checkSession();
        mainMenu?.classList.remove("open");
        menuToggle?.classList.remove("open");
    });
}

function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll(".main-menu a");

    menuLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        const normalizedHref = href.replace("../", "").replace("./", "");

        if (currentPath.includes(normalizedHref)) {
            link.classList.add("active-menu-item");
        }
    });
}

setActiveMenuItem();

checkSession();