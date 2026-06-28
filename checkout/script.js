document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("juiceCart")) || {
    baseType: null,
    baseFruit: null,
    addons: [],
  };

  displayOrderSummary(cart);
  generateOrderNumber();
});

function displayOrderSummary(cart) {
  const container = document.getElementById("checkout-items");
  let total = 0;
  let html = "";

  if (cart.baseType && cart.baseType.id !== "none") {
    html += `
            <div class="checkout-item">
                <div class="item-name-section">
                    <span class="item-main-name">${cart.baseType.name}</span>
                    <span class="item-category-badge">Base</span>
                </div>
                <div class="item-price-section">+${cart.baseType.price.toLocaleString()} $</div>
            </div>
        `;
    total += cart.baseType.price;
  }

  if (cart.baseFruit) {
    html += `
            <div class="checkout-item">
                <div class="item-name-section">
                    <span class="item-main-name">${cart.baseFruit.name}</span>
                    <span class="item-category-badge">Fruit</span>
                </div>
                <div class="item-price-section">${cart.baseFruit.price.toLocaleString()} $</div>
            </div>
        `;
    total += cart.baseFruit.price;
  }

  if (cart.addons && cart.addons.length > 0) {
    cart.addons.forEach((addon) => {
      html += `
                <div class="checkout-item">
                    <div class="item-name-section">
                        <span class="item-main-name">${addon.name}</span>
                        <span class="item-category-badge">Fruit</span>
                    </div>
                    <div class="item-price-section">+${addon.price.toLocaleString()} $</div>
                </div>
            `;
      total += addon.price;
    });
  }

  if (
    (!cart.baseType || cart.baseType.id === "none") &&
    !cart.baseFruit &&
    (!cart.addons || cart.addons.length === 0)
  ) {
    html = '<p style="text-align: center; color: #999;">No items selected</p>';
  }

  container.innerHTML = html;
  document.getElementById("checkout-total").textContent =
    total.toLocaleString() + " $";
}

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `JUVO-${year}-${random}`;
  document.getElementById("orderNumber").textContent = orderNumber;

  localStorage.setItem("lastOrderNumber", orderNumber);
}
