const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const checkoutForm = document.querySelector("#checkoutForm");
const customerName = document.querySelector("#customerName");
const customerEmail = document.querySelector("#customerEmail");
const countrySelect = document.querySelector("#country");
const phoneCodeSelect = document.querySelector("#phoneCode");

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
            <img src="../${item.image}" alt="${escapeHtml(item.title)}">

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
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(checkoutForm);

        const streetAddress = formData.get("street_address");
        const city = formData.get("city");
        const postalCode = formData.get("postal_code");
        const country = formData.get("country");
        const phoneCode = formData.get("phone_code");
        const phoneNumber = formData.get("phone_number");

        const fullShippingAddress = `${streetAddress}, ${postalCode} ${city}, ${country}`;
        const fullPhone = `${phoneCode} ${phoneNumber}`;

        Swal.fire({
            icon: "info",
            title: "Order storage comes next",
            html: `
                <p>The cart is now connected to PHP session.</p>
                <p><strong>Shipping:</strong> ${escapeHtml(fullShippingAddress)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(fullPhone)}</p>
                <p>The next task will store the order in MySQL.</p>
            `,
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

loadCheckoutSession();