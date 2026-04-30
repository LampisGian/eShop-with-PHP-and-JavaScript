const homepageProducts = document.querySelector("#homepageProducts");
const CART_KEY = "eshop_cart";

let currentUser = null;

async function getCurrentUser() {
    try {
        const response = await fetch("../api/session.php");
        const result = await response.json();

        if (result.logged_in && result.user) {
            currentUser = result.user;
        }
    } catch (error) {
        currentUser = null;
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cartBadge = document.querySelector("#cartBadge");

    if (!cartBadge) {
        return;
    }

    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadge.textContent = totalItems;
    cartBadge.hidden = totalItems === 0;
}

function normalizeImagePath(imagePath) {
    return String(imagePath || "").replace(/^\/+/, "");
}

function getImageSrc(imagePath) {
    const cleanPath = normalizeImagePath(imagePath);
    return `../${cleanPath}`;
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find((item) => Number(item.id) === Number(product.id));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Number(product.id),
            title: product.title,
            price: Number(product.price),
            image: normalizeImagePath(product.image),
            stock: Number(product.stock),
            quantity: 1
        });
    }

    saveCart(cart);

    Swal.fire({
        icon: "success",
        title: "Added to cart",
        text: `${product.title} was added to your cart.`,
        timer: 1200,
        showConfirmButton: false,
        background: "#111820",
        color: "#f5f5f0"
    });
}

async function loadHomepageProducts() {
    if (!homepageProducts) {
        return;
    }

    await getCurrentUser();

    try {
        const response = await fetch("../api/get_products.php");
        const result = await response.json();

        if (!result.success) {
            homepageProducts.innerHTML = `
                <div class="empty-card">
                    <h3>Products could not be loaded</h3>
                    <p>Please refresh the page or try again later.</p>
                </div>
            `;
            return;
        }

        if (!result.products.length) {
            homepageProducts.innerHTML = `
                <div class="empty-card">
                    <h3>No products yet</h3>
                    <p>Sellers have not uploaded products yet.</p>
                </div>
            `;
            return;
        }

        homepageProducts.innerHTML = "";

        result.products.forEach((product) => {
            const productCard = document.createElement("article");
            productCard.className = "homepage-product-card";

            const imageSrc = getImageSrc(product.image);
            const stockNumber = Number(product.stock);
            const stockLabel = stockNumber > 0 ? `${stockNumber} in stock` : "Out of stock";
            const shortDescription = String(product.description || "").length > 95
                ? `${String(product.description).slice(0, 95)}...`
                : product.description;

            const cartButton = currentUser && currentUser.role === "seller"
                ? ""
                : `
                    <button 
                        class="small-btn add-to-cart-btn" 
                        data-product='${JSON.stringify(product).replaceAll("'", "&apos;")}'
                        ${stockNumber > 0 ? "" : "disabled"}
                    >
                        Add to Cart
                    </button>
                `;

            productCard.innerHTML = `
                <div class="homepage-product-image">
                    <img src="${imageSrc}" alt="${escapeHtml(product.title)}">
                </div>

                <div class="homepage-product-content">
                    <div class="product-topline">
                        <span class="product-category">${escapeHtml(product.category_name || "Uncategorized")}</span>
                        <span class="product-stock ${stockNumber <= 0 ? "out-of-stock" : ""}">
                            ${escapeHtml(stockLabel)}
                        </span>
                    </div>

                    <h3>${escapeHtml(product.title)}</h3>
                    <p>${escapeHtml(shortDescription)}</p>

                    <div class="product-footer">
                        <strong>€${Number(product.price).toFixed(2)}</strong>
                        ${cartButton}
                    </div>

                    <button 
                        class="details-btn product-details-btn"
                        data-product='${JSON.stringify(product).replaceAll("'", "&apos;")}'
                    >
                        View Details
                    </button>

                    <small>Seller: ${escapeHtml(product.seller_name || "Unknown")}</small>
                </div>
            `;

            homepageProducts.appendChild(productCard);
        });

        setupAddToCartButtons();
        setupProductDetailsButtons();
    } catch (error) {
        homepageProducts.innerHTML = `
            <div class="empty-card">
                <h3>Products could not be loaded</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

function setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        button.addEventListener("click", async function () {
            if (!currentUser) {
                const result = await Swal.fire({
                    icon: "warning",
                    title: "Login required",
                    text: "Please login as a customer to add products to your cart.",
                    showCancelButton: true,
                    confirmButtonText: "Go to login",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#38bdf8",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                if (result.isConfirmed) {
                    window.location.href = "auth/login.html";
                }

                return;
            }

            if (currentUser.role !== "customer") {
                Swal.fire({
                    icon: "error",
                    title: "Customer only",
                    text: "Only customer accounts can add products to the cart.",
                    confirmButtonColor: "#ef4444",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                return;
            }

            const product = JSON.parse(button.dataset.product.replaceAll("&apos;", "'"));
            product.image = normalizeImagePath(product.image);

            addToCart(product);
        });
    });
}

function setupProductDetailsButtons() {
    document.querySelectorAll(".product-details-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const product = JSON.parse(button.dataset.product.replaceAll("&apos;", "'"));
            openProductDetailsModal(product);
        });
    });
}

function openProductDetailsModal(product) {
    closeProductDetailsModal();

    const imageSrc = getImageSrc(product.image);
    const stockNumber = Number(product.stock);
    const stockText = stockNumber > 0 ? `${stockNumber} in stock` : "Out of stock";
    const stockClass = stockNumber > 0 ? "" : "out-of-stock";

    const cartAction = currentUser && currentUser.role === "seller"
        ? ""
        : `
            <button 
                class="btn product-modal-cart-btn" 
                ${stockNumber > 0 ? "" : "disabled"}
            >
                Add to Cart
            </button>
        `;

    const modal = document.createElement("div");
    modal.className = "product-modal-overlay";
    modal.id = "productDetailsModal";

    modal.innerHTML = `
        <div class="product-modal-card">
            <button class="product-modal-close" type="button" aria-label="Close details">×</button>

            <div class="product-modal-image">
                <img src="${imageSrc}" alt="${escapeHtml(product.title)}">
            </div>

            <div class="product-modal-content">
                <div class="product-modal-topline">
                    <span class="product-category">${escapeHtml(product.category_name || "Uncategorized")}</span>
                    <span class="product-stock ${stockClass}">${escapeHtml(stockText)}</span>
                </div>

                <h2>${escapeHtml(product.title)}</h2>

                <p>${escapeHtml(product.description)}</p>

                <div class="product-modal-meta">
                    <div>
                        <small>Price</small>
                        <strong>€${Number(product.price).toFixed(2)}</strong>
                    </div>

                    <div>
                        <small>Seller</small>
                        <strong>${escapeHtml(product.seller_name || "Unknown")}</strong>
                    </div>
                </div>

                <div class="product-modal-actions">
                    ${cartAction}
                    <button class="secondary-action-btn product-modal-back-btn" type="button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
        modal.classList.add("open");
    });

    const closeBtn = modal.querySelector(".product-modal-close");
    const backBtn = modal.querySelector(".product-modal-back-btn");
    const addBtn = modal.querySelector(".product-modal-cart-btn");

    closeBtn.addEventListener("click", closeProductDetailsModal);
    backBtn.addEventListener("click", closeProductDetailsModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeProductDetailsModal();
        }
    });

    if (addBtn) {
        addBtn.addEventListener("click", async function () {
            if (!currentUser) {
                const result = await Swal.fire({
                    icon: "warning",
                    title: "Login required",
                    text: "Please login as a customer to add products to your cart.",
                    showCancelButton: true,
                    confirmButtonText: "Go to login",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#38bdf8",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                if (result.isConfirmed) {
                    window.location.href = "auth/login.html";
                }

                return;
            }

            if (currentUser.role !== "customer") {
                Swal.fire({
                    icon: "error",
                    title: "Customer only",
                    text: "Only customer accounts can add products to the cart.",
                    confirmButtonColor: "#ef4444",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                return;
            }

            product.image = normalizeImagePath(product.image);
            addToCart(product);
            closeProductDetailsModal();
        });
    }

    document.addEventListener("keydown", handleModalEscape);
}

function closeProductDetailsModal() {
    const modal = document.querySelector("#productDetailsModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleModalEscape);

    setTimeout(() => {
        modal.remove();
    }, 220);
}

function handleModalEscape(event) {
    if (event.key === "Escape") {
        closeProductDetailsModal();
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

updateCartBadge();
loadHomepageProducts();