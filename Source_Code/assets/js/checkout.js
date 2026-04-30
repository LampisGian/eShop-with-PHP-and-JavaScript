const CART_KEY = "eshop_cart";

const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const checkoutForm = document.querySelector("#checkoutForm");
const customerName = document.querySelector("#customerName");
const customerEmail = document.querySelector("#customerEmail");
const countrySelect = document.querySelector("#country");
const phoneCodeSelect = document.querySelector("#phoneCode");

function normalizeImagePath(imagePath) {
    return String(imagePath || "").replace(/^\/+/, "");
}

function getImageSrc(imagePath) {
    const cleanPath = normalizeImagePath(imagePath);
    return `../${cleanPath}`;
}

async function loadCheckoutSession() {
    try {
        const response = await fetch("../api/get_cart_session.php");
        const result = await response.json();

        if (!result.success) {
            await Swal.fire({
                icon: "warning",
                title: "Checkout unavailable",
                text: result.message,
                confirmButtonText: "Back to cart",
                confirmButtonColor: "#38bdf8",
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "cart.html";
            return;
        }

        renderCheckout(result.cart, Number(result.total));

        if (result.user) {
            customerName.value = result.user.name || "";
            customerEmail.value = result.user.email || "";
        }
    } catch (error) {
        await Swal.fire({
            icon: "error",
            title: "Connection error",
            text: "Could not load checkout session.",
            confirmButtonText: "Back to cart",
            confirmButtonColor: "#ef4444",
            background: "#111820",
            color: "#f5f5f0"
        });

        window.location.href = "cart.html";
    }
}

function renderCheckout(cart, total) {
    checkoutItems.innerHTML = "";

    cart.forEach((item) => {
        const checkoutItem = document.createElement("article");
        checkoutItem.className = "checkout-item";

        checkoutItem.innerHTML = `
            <img src="${getImageSrc(item.image)}" alt="${escapeHtml(item.title)}">

            <div>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${item.quantity} × €${Number(item.price).toFixed(2)}</p>
            </div>

            <strong>€${Number(item.line_total).toFixed(2)}</strong>
        `;

        checkoutItems.appendChild(checkoutItem);
    });

    checkoutTotal.textContent = `€${total.toFixed(2)}`;
}

if (countrySelect && phoneCodeSelect) {
    countrySelect.addEventListener("change", function () {
        const countryPhoneCodes = {
            "Greece": "+30",
            "Cyprus": "+357",
            "Germany": "+49",
            "France": "+33",
            "Italy": "+39",
            "Spain": "+34",
            "Netherlands": "+31",
            "United Kingdom": "+44",
            "United States": "+1"
        };

        const selectedCode = countryPhoneCodes[countrySelect.value];

        if (selectedCode) {
            phoneCodeSelect.value = selectedCode;
        }
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(checkoutForm);

        try {
            const response = await fetch("../api/place_order.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Order failed",
                    text: result.message,
                    confirmButtonColor: "#ef4444",
                    background: "#111820",
                    color: "#f5f5f0"
                });

                return;
            }

            localStorage.removeItem(CART_KEY);

            await Swal.fire({
                icon: "success",
                title: "Order completed!",
                text: `Your order number is #${result.order_id}.`,
                confirmButtonText: "Back to home",
                confirmButtonColor: "#22c55e",
                background: "#111820",
                color: "#f5f5f0"
            });

            window.location.href = "home.html";
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Connection error",
                text: "Could not place the order. Please try again.",
                confirmButtonColor: "#ef4444",
                background: "#111820",
                color: "#f5f5f0"
            });
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

loadCheckoutSession();