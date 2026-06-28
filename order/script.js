let currentOrder = null;

const baseImagePath = "../images/image-order/";

const availableImages = {
  Orange: baseImagePath + "orange.png",
  Apple: baseImagePath + "apple.png",
  Watermelon: baseImagePath + "watermelon.png",
  Mango: baseImagePath + "mango.png",
  Strawberry: baseImagePath + "strawberry.png",
  Blueberry: baseImagePath + "blueberry.png",
  "Blueberry-Watermelon": baseImagePath + "blueberry-watermelon.png",
  "Strawberry-Watermelon": baseImagePath + "strawberry-watermelon.png",
  "Orange-Watermelon": baseImagePath + "orange-watermelon.png",
  "Orange-Strawberry": baseImagePath + "orange-strawberry.png",
  "Banana-Coffee": baseImagePath + "banana-coffee.png",
  "Banana-Milk": baseImagePath + "banana-milk.png",
  "Strawberry-Milk": baseImagePath + "strawberry-milk.png",
  "Strawberry-Coffee": baseImagePath + "strawberry-coffee.png",
  "Mango-Milk": baseImagePath + "mango-milk.png",
  "Mango-Coffee": baseImagePath + "mango-coffee.png",
  "Mango-Strawberry": baseImagePath + "mango-strawberry.png",
  "Mango-Banana": baseImagePath + "mango-banana.png",
  "Mango-Blueberry": baseImagePath + "mango-blueberry.png",
  "Coconut-Milk": baseImagePath + "coconut-milk.png",
  "Coconut-Coffee": baseImagePath + "coconut-coffee.png",
  "Blueberry-Milk": baseImagePath + "blueberry-milk.png",
  "Blueberry-Coffee": baseImagePath + "blueberry-coffee.png",
  "Apple-Banana": baseImagePath + "apple-banana.png",
  "Apple-Watermelon": baseImagePath + "apple-watermelon.png",
  "Apple-Strawberry": baseImagePath + "apple-strawberry.png",

};

document.addEventListener("DOMContentLoaded", () => {
  loadOrder();
  setupBackButton();
});

function setupBackButton() {
  const backBtn = document.querySelector(".back-button");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../juice-builder/juice-builder.html?new=true";
    });
  }
}

function loadOrder() {
  currentOrder = JSON.parse(localStorage.getItem("juiceOrder"));

  if (
    !currentOrder ||
    !currentOrder.fruits ||
    currentOrder.fruits.length === 0
  ) {
    showEmptyState();
    return;
  }

  const imagePath = getImagePath(currentOrder);

  if (imagePath) {
    renderOrder(currentOrder);
    displayJuiceImage(imagePath);
  } else {
    showNoImageError(currentOrder);
  }
}

function getImagePath(order) {
  if (!order || !order.fruits || order.fruits.length === 0) return null;

  const fruitNames = order.fruits.map((f) => f.name);
  const baseName = order.base?.name || "No Base";

  if (fruitNames.length === 1) {
    const fruit = fruitNames[0];
    if (baseName === "Milk Base") {
      const milkKey = `${fruit}-Milk`;
      if (availableImages[milkKey]) return availableImages[milkKey];
    }
    if (baseName === "Coffee Base") {
      const coffeeKey = `${fruit}-Coffee`;
      if (availableImages[coffeeKey]) return availableImages[coffeeKey];
    }
    return availableImages[fruit] || null;
  }

  if (fruitNames.length === 2) {
    const sortedFruits = [...fruitNames].sort();
    const comboKey = `${sortedFruits[0]}-${sortedFruits[1]}`;
    if (availableImages[comboKey]) return availableImages[comboKey];
  }

  return null;
}

function displayJuiceImage(imagePath) {
  const juiceImage = document.getElementById("juiceImage");
  if (!juiceImage) return;

  juiceImage.src = imagePath;
  juiceImage.style.display = "block";
  updateJuiceName(currentOrder);
}

function showNoImageError(order) {
  const addonsContainer = document.getElementById("addonsContainer");
  const juiceImage = document.getElementById("juiceImage");

  const fruitNames = order.fruits.map((f) => f.name).join(" + ");
  const baseName =
    order.base?.name !== "No Base"
      ? ` with ${order.base.name.replace(" Base", "")}`
      : "";

  if (addonsContainer) {
    addonsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Not Available!</h3>
                <p>"${fruitNames}${baseName}" juice is not available.</p>
                <button onclick="location.href='../juice-builder/juice-builder.html?new=true'">
                    <i class="fas fa-arrow-left"></i> Go Back & Edit
                </button>
            </div>
        `;
  }

  if (juiceImage) {
    juiceImage.src = "";
    juiceImage.style.display = "none";
  }
}

function showEmptyState() {
  const addonsContainer = document.getElementById("addonsContainer");
  const juiceImage = document.getElementById("juiceImage");

  if (addonsContainer) {
    addonsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <p>No items in your order</p>
                <button onclick="location.href='../juice-builder/juice-builder.html?new=true'">
                    Build Your Juice
                </button>
            </div>
        `;
  }

  if (juiceImage) {
    juiceImage.src = "";
    juiceImage.style.display = "none";
  }

  document.getElementById("subtotal").textContent = "0.00 $";
  document.getElementById("finalTotal").textContent = "0.00 $";
  document.getElementById("juiceName").textContent = "No juice created";
}

function updateJuiceName(order) {
  const juiceNameSpan = document.getElementById("juiceName");
  if (!juiceNameSpan) return;

  const fruitNames = order.fruits.map((f) => f.name);
  let juiceName = "";

  if (fruitNames.length === 1) {
    juiceName = `${fruitNames[0]} Juice`;
  } else if (fruitNames.length === 2) {
    juiceName = `${fruitNames[0]} & ${fruitNames[1]} Blend`;
  }

  if (order.base && order.base.name !== "No Base") {
    juiceName += ` with ${order.base.name.replace(" Base", "")}`;
  }

  juiceNameSpan.textContent = juiceName;
}

function renderBase(base) {
  if (!base || !base.name) return;
  const baseItem = document.getElementById("baseTypeItem");
  if (base.name === "No Base") {
    baseItem.style.display = "none";
    return;
  }

  document.getElementById("baseTypeName").textContent = base.name;
  const basePriceSpan = document.getElementById("baseTypePrice");
  if (basePriceSpan) {
    basePriceSpan.textContent = base.price
      ? base.price.toFixed(2) + " $"
      : "0.00 $";
  }
  baseItem.style.display = "flex";
}

function renderFruits(fruits) {
  const addons = document.getElementById("addonsContainer");
  const separator = document.getElementById("addonsSeparator");
  if (!addons) return;
  addons.innerHTML = "";
  const validFruits = fruits.filter((fruit) => fruit && fruit.name);
  if (separator)
    separator.style.display = validFruits.length > 0 ? "block" : "none";

  validFruits.forEach((fruit, index) => {
    const div = document.createElement("div");
    div.className = "order-item";
    div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${fruit.name}</span>
                <span class="item-category">Fruit</span>
            </div>
            <span class="item-price">${fruit.price ? fruit.price.toFixed(2) : "0.00"} $</span>
            <button class="delete-item-btn" data-index="${index}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
    addons.appendChild(div);
  });

  document
    .querySelectorAll("#addonsContainer .delete-item-btn")
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const index = parseInt(this.getAttribute("data-index"));
        removeFruit(index);
      });
    });
}

function renderTotal(order) {
  if (!order) return;

  let basePrice = 0;
  if (order.base && order.base.name !== "No Base") {
    basePrice = order.base.price || 0;
  }

  const fruitsPrice = order.fruits
    ? order.fruits.reduce((sum, f) => sum + (f.price || 0), 0)
    : 0;
  const subtotal = basePrice + fruitsPrice;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " $";
  document.getElementById("finalTotal").textContent =
    subtotal.toFixed(2) + " $";
}

function renderOrder(order) {
  if (!order) return;
  currentOrder = order;
  if (order.base) renderBase(order.base);
  if (order.fruits && order.fruits.length > 0) renderFruits(order.fruits);
  renderTotal(order);
}

function removeFruit(index) {
  if (!currentOrder || !currentOrder.fruits) return;

  currentOrder.fruits.splice(index, 1);

  if (currentOrder.fruits.length === 0) {
    document.getElementById("addonsSeparator").style.display = "none";
    showEmptyState();
    localStorage.removeItem("juiceOrder");
    localStorage.removeItem("juiceCart");
    currentOrder = null;
  } else {
    localStorage.setItem("juiceOrder", JSON.stringify(currentOrder));
    renderFruits(currentOrder.fruits);
    renderTotal(currentOrder);

    const imagePath = getImagePath(currentOrder);
    if (imagePath) {
      displayJuiceImage(imagePath);
    }
    showNotification("Fruit removed");
  }
}

function removeBase() {
  if (!currentOrder) return;
  currentOrder.base = { name: "No Base", price: 0 };
  document.getElementById("baseTypeItem").style.display = "none";
  localStorage.setItem("juiceOrder", JSON.stringify(currentOrder));
  renderTotal(currentOrder);
  showNotification("Base removed");
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "order-notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function proceedToCheckout() {
  if (
    !currentOrder ||
    !currentOrder.fruits ||
    currentOrder.fruits.length === 0
  ) {
    showNotification("Please add some fruits first!");
    return;
  }

  window.location.href = "../checkout/checkout.html";
}

function clearAllCart() {
  if (confirm("Are you sure you want to clear your entire cart?")) {
    localStorage.removeItem("juiceOrder");
    localStorage.removeItem("juiceCart");

    currentOrder = null;

    showEmptyState();

    showNotification("Cart cleared successfully");

    updateFloatingCartDisplay();
  }
}

function updateFloatingCartDisplay() {
  if (typeof updateCartDisplay === "function") {
    updateCartDisplay();
  }
}

window.clearAllCart = clearAllCart;

window.removeFruit = removeFruit;
window.removeBase = removeBase;
window.proceedToCheckout = proceedToCheckout;
