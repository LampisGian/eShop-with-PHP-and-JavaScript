const sellerInfo = document.querySelector("#sellerInfo");
const productForm = document.querySelector("#productForm");
const categorySelect = document.querySelector("#category_id");
const productsList = document.querySelector("#productsList");
const logoutBtn = document.querySelector("#logoutBtn");

const API_BASE = "../../api";

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

async function checkSellerSession() {
    try {
        const response = await fetch(`${API_BASE}/session.php`);
        const result = await response.json();

        if (!result.logged_in) {
            await Swal.fire({
                icon: "warning",
                title: "Login required",
                text: "You must login as a seller to access this page.",
                confirmButtonText: "Go to login",
                confirmButtonColor: "#38bdf8",
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "../auth/login.html";
            return false;
        }

        if (result.user.role !== "seller") {
            await Swal.fire({
                icon: "error",
                title: "Access denied",
                text: "Only seller accounts can access the seller dashboard.",
                confirmButtonText: "Back to home",
                confirmButtonColor: "#ef4444",
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "../home.html";
            return false;
        }

        sellerInfo.textContent = `Welcome, ${result.user.name}. You can manage your products here.`;

        if (logoutBtn) {
            logoutBtn.hidden = false;
        }

        return true;
    } catch (error) {
        sellerInfo.textContent = "Could not check seller session.";
        return false;
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/get_categories.php`);
        const result = await response.json();

        categorySelect.innerHTML = `<option value="">Select category</option>`;

        if (!result.success || !result.categories.length) {
            categorySelect.innerHTML = `<option value="">No categories found</option>`;
            return;
        }

        result.categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        categorySelect.innerHTML = `<option value="">Could not load categories</option>`;
    }
}

async function loadSellerProducts() {
    try {
        const response = await fetch(`${API_BASE}/get_seller_products.php`);
        const result = await response.json();

        if (!result.success) {
            productsList.innerHTML = `<p class="empty-state">${result.message}</p>`;
            return;
        }

        if (!result.products.length) {
            productsList.innerHTML = `<p class="empty-state">You have not uploaded any products yet.</p>`;
            return;
        }

        productsList.innerHTML = "";

        result.products.forEach((product) => {
            const productCard = document.createElement("article");
            productCard.className = "seller-product-card";

            const imageSrc = `../../${product.image}`;

            productCard.innerHTML = `
                <img src="${imageSrc}" alt="${escapeHtml(product.title)}">
                <div class="seller-product-content">
                    <h4>${escapeHtml(product.title)}</h4>
                    <p>${escapeHtml(product.description)}</p>
                    <div class="product-meta">
                        <span>€${Number(product.price).toFixed(2)}</span>
                        <span>Stock: ${product.stock}</span>
                    </div>
                    <small>${escapeHtml(product.category_name || "No category")}</small>
                </div>
            `;

            productsList.appendChild(productCard);
        });
    } catch (error) {
        productsList.innerHTML = `<p class="empty-state">Could not load products.</p>`;
    }
}

if (productForm) {
    productForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(productForm);

        try {
            const response = await fetch(`${API_BASE}/create_product.php`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Product uploaded!",
                    text: result.message,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#22c55e",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                productForm.reset();
                loadSellerProducts();
            } else {
                showAlert("error", "Upload failed", result.message);
            }
        } catch (error) {
            showAlert("error", "Connection error", "Something went wrong while uploading the product.");
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        try {
            await fetch(`${API_BASE}/logout.php`);

            await Swal.fire({
                icon: "success",
                title: "Logged out",
                text: "You have been logged out successfully.",
                timer: 1100,
                showConfirmButton: false,
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "../auth/login.html";
        } catch (error) {
            showAlert("error", "Logout failed", "Could not log out. Please try again.");
        }
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function initSellerDashboard() {
    const allowed = await checkSellerSession();

    if (!allowed) {
        return;
    }

    await loadCategories();
    await loadSellerProducts();
}

initSellerDashboard();