const CART_KEY = "eshop_cart";

const cartItemsContainer = document.querySelector("#cartItems");
const summaryItems = document.querySelector("#summaryItems");
const summaryTotal = document.querySelector("#summaryTotal");
const clearCartBtn = document.querySelector("#clearCartBtn");
const checkoutBtn = document.querySelector("#checkoutBtn");

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
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

function renderCart() {
    const cart = getCart();

    if (!cartItemsContainer) {
        return;
    }

    if (!cart.length) {
        cartItemsContainer.innerHTML = `<p class="empty-state">Your cart is empty.</p>`;
        summaryItems.textContent = "0";
        summaryTotal.textContent = "€0.00";
        return;
    }

    cartItemsContainer.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("article");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="../${item.image}" alt="${escapeHtml(item.title)}">

            <div class="cart-item-content">
                <h4>${escapeHtml(item.title)}</h4>
                <p>€${Number(item.price).toFixed(2)}</p>

                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>

            <div class="cart-item-side">
                <strong>€${(item.price * item.quantity).toFixed(2)}</strong>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    summaryItems.textContent = totalItems;
    summaryTotal.textContent = `€${totalPrice.toFixed(2)}`;

    setupCartButtons();
}

function setupCartButtons() {
    document.querySelectorAll(".increase-btn").forEach((button) => {
        button.addEventListener("click", function () {
            changeQuantity(Number(button.dataset.id), 1);
        });
    });

    document.querySelectorAll(".decrease-btn").forEach((button) => {
        button.addEventListener("click", function () {
            changeQuantity(Number(button.dataset.id), -1);
        });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", function () {
            removeItem(Number(button.dataset.id));
        });
    });
}

function changeQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find((cartItem) => Number(cartItem.id) === Number(productId));

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        const updatedCart = cart.filter((cartItem) => Number(cartItem.id) !== Number(productId));
        saveCart(updatedCart);
        return;
    }

    if (item.quantity > item.stock) {
        Swal.fire({
            icon: "warning",
            title: "Stock limit",
            text: "You cannot add more than the available stock.",
            confirmButtonColor: "#38bdf8",
            background: "#111820",
            color: "#f5f5f0"
        });

        item.quantity = item.stock;
    }

    saveCart(cart);
}

function removeItem(productId) {
    const updatedCart = getCart().filter((item) => Number(item.id) !== Number(productId));
    saveCart(updatedCart);
}

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", async function () {
        const cart = getCart();

        if (!cart.length) {
            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Clear cart?",
            text: "All items will be removed from your cart.",
            showCancelButton: true,
            confirmButtonText: "Clear",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            background: "#111820",
            color: "#f5f5f0"
        });

        if (result.isConfirmed) {
            localStorage.removeItem(CART_KEY);
            renderCart();
            updateCartBadge();
        }
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        const cart = getCart();

        if (!cart.length) {
            Swal.fire({
                icon: "info",
                title: "Empty cart",
                text: "Add products to your cart before checkout.",
                confirmButtonColor: "#38bdf8",
                background: "#111820",
                color: "#f5f5f0"
            });

            return;
        }

        Swal.fire({
            icon: "info",
            title: "Checkout coming next",
            text: "The next task will connect the cart to checkout using PHP sessions.",
            confirmButtonColor: "#38bdf8",
            background: "#111820",
            color: "#f5f5f0"
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

renderCart();
updateCartBadge();