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
            image: product.image,
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
            homepageProducts.innerHTML = `<p class="empty-state">Could not load products.</p>`;
            return;
        }

        if (!result.products.length) {
            homepageProducts.innerHTML = `<p class="empty-state">No products available yet.</p>`;
            return;
        }

        homepageProducts.innerHTML = "";

        result.products.forEach((product) => {
            const productCard = document.createElement("article");
            productCard.className = "homepage-product-card";

            const imageSrc = `../${product.image}`;
            const stockNumber = Number(product.stock);
            const stockLabel = stockNumber > 0 ? `${stockNumber} in stock` : "Out of stock";

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
                    <p>${escapeHtml(product.description)}</p>

                    <div class="product-footer">
                        <strong>€${Number(product.price).toFixed(2)}</strong>
                        ${cartButton}
                    </div>

                    <small>Seller: ${escapeHtml(product.seller_name || "Unknown")}</small>
                </div>
            `;

            homepageProducts.appendChild(productCard);
        });

        setupAddToCartButtons();
    } catch (error) {
        homepageProducts.innerHTML = `<p class="empty-state">Could not load products.</p>`;
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
            addToCart(product);
        });
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

updateCartBadge();
loadHomepageProducts();