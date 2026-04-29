const homepageProducts = document.querySelector("#homepageProducts");

let currentUserRole = null;

async function getCurrentUserRole() {
    try {
        const response = await fetch("../api/session.php");
        const result = await response.json();

        if (result.logged_in && result.user) {
            currentUserRole = result.user.role;
        }
    } catch (error) {
        currentUserRole = null;
    }
}

async function loadHomepageProducts() {
    if (!homepageProducts) {
        return;
    }

    await getCurrentUserRole();

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

            const cartButton = currentUserRole === "seller"
                ? ""
                : `
                    <button 
                        class="small-btn add-to-cart-btn" 
                        data-product-id="${product.id}"
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
    } catch (error) {
        homepageProducts.innerHTML = `<p class="empty-state">Could not load products.</p>`;
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

loadHomepageProducts();