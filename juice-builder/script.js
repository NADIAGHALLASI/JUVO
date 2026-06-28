// ================== STATE MANAGEMENT ==================
let cart = { items: [], total: 0 };
let selectedFruits = [];
let selectedBase = "none";

// ================== CART FUNCTIONS ==================
function loadCart() {
  const savedCart = localStorage.getItem("juiceCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);

    selectedFruits = [];
    selectedBase = "none";

    if (cart.baseType && cart.baseType.id !== "none") {
      selectedBase = cart.baseType.id;
    }

    if (cart.baseFruit) {
      selectedFruits.push({
        id: `fruit-${cart.baseFruit.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: cart.baseFruit.name,
        price: cart.baseFruit.price,
      });
    }

    if (cart.addons) {
      cart.addons.forEach((addon) => {
        selectedFruits.push({
          id: `fruit-${addon.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: addon.name,
          price: addon.price,
        });
      });
    }
  } else {
    resetCart();
  }
  updateCartDisplay();
  updateAllUI();
}

function resetCart() {
  cart = { items: [], total: 0 };
  selectedFruits = [];
  selectedBase = "none";
  localStorage.removeItem("juiceCart");
  localStorage.removeItem("juiceOrder");
  updateCartDisplay();
  updateAllUI();
}

function saveCart() {
  const newCart = {
    baseType: null,
    baseFruit: null,
    addons: [],
  };

  if (selectedBase !== "none") {
    let baseName = selectedBase === "milk" ? "Milk Base" : "Coffee Base";
    newCart.baseType = {
      id: selectedBase,
      name: baseName,
      price: 2.0,
    };
  } else {
    newCart.baseType = {
      id: "none",
      name: "No Base",
      price: 0,
    };
  }

  if (selectedFruits.length === 1) {
    newCart.baseFruit = {
      name: selectedFruits[0].name,
      price: selectedFruits[0].price,
    };
  } else if (selectedFruits.length > 1) {
    newCart.addons = selectedFruits.map((f) => ({
      name: f.name,
      price: f.price,
    }));
  }

  localStorage.setItem("juiceCart", JSON.stringify(newCart));

  if (selectedFruits.length > 0) {
    const order = {
      base:
        selectedBase !== "none"
          ? {
              name: selectedBase === "milk" ? "Milk Base" : "Coffee Base",
              price: 2.0,
            }
          : { name: "No Base", price: 0 },
      fruits: selectedFruits.map((f) => ({ name: f.name, price: f.price })),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("juiceOrder", JSON.stringify(order));
  } else {
    localStorage.removeItem("juiceOrder");
  }
}

function updateCartDisplay() {
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.querySelector(".cart-total");

  if (cartCount) {
    cartCount.textContent =
      selectedFruits.length + (selectedBase !== "none" ? 1 : 0);
  }

  if (cartTotal) {
    let total = 0;
    selectedFruits.forEach((f) => (total += f.price));
    if (selectedBase !== "none") total += 2.0;
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
  saveCart();
}

function addToCart(product) {
  showNotification(`✓ ${product.name} added`, "success");
}

function removeFromCart(id) {
  showNotification(`✗ Item removed`, "error");
}

function showNotification(message, type = "success") {
  const oldNotification = document.querySelector(".cart-notification");
  if (oldNotification) oldNotification.remove();

  const notification = document.createElement("div");
  notification.className = `cart-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// ================== UI UPDATE ==================
function updateAllUI() {
  updateFruitButtonsUI();
  updateBaseButtonsUI();
  updateSelectionRule();
}

function updateFruitButtonsUI() {
  const limitReached = selectedFruits.length >= 2;
  const fruitCards = document.querySelectorAll(".addon-card");

  fruitCards.forEach((card) => {
    const fruitName = card.querySelector("h4")?.textContent;
    const isSelected = selectedFruits.some((f) => f.name === fruitName);
    const btn = card.querySelector(".add-btn");

    if (isSelected) {
      card.classList.add("selected");
      if (btn) btn.textContent = "✓ Added";
    } else {
      card.classList.remove("selected");
      if (btn && !limitReached) btn.textContent = "+ Add";
      else if (btn && limitReached) btn.textContent = "Limit";
    }

    if (btn) {
      btn.disabled = limitReached && !isSelected;
    }
  });
}

function updateBaseButtonsUI() {
  const baseButtons = document.querySelectorAll(".select-base-btn");
  baseButtons.forEach((btn) => {
    const baseValue = btn.getAttribute("data-base");
    if (baseValue === selectedBase) {
      btn.classList.add("active");
      btn.textContent = "Selected";
    } else {
      btn.classList.remove("active");
      btn.textContent = "Select";
    }
  });
}

function updateSelectionRule() {
  const selectionRule = document.getElementById("selectionRule");
  if (selectionRule) {
    if (selectedFruits.length === 0) {
      selectionRule.innerHTML = "⚠️ Choose at least one fruit";
      selectionRule.style.color = "#f44336";
    } else if (selectedFruits.length === 2) {
      selectionRule.innerHTML = "✓ Maximum fruits (2/2)";
      selectionRule.style.color = "#4CAF50";
    } else {
      selectionRule.innerHTML = "🍎 Choose 1-2 fruits";
      selectionRule.style.color = "#FF9800";
    }
  }
}

// ================== FRUIT ACTIONS ==================
function addFruit(name, price) {
  if (selectedFruits.length >= 2) {
    showNotification("Maximum 2 fruits allowed!", "warning");
    return false;
  }
  if (selectedFruits.some((f) => f.name === name)) {
    showNotification(`${name} already selected!`, "warning");
    return false;
  }

  const fruit = {
    id: `fruit-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name: name,
    price: parseFloat(price),
  };
  selectedFruits.push(fruit);
  showNotification(`✓ ${name} added`, "success");
  updateAllUI();
  updateCartDisplay();
  return true;
}

function removeFruit(name) {
  const fruitIndex = selectedFruits.findIndex((f) => f.name === name);
  if (fruitIndex !== -1) {
    selectedFruits.splice(fruitIndex, 1);
    showNotification(`✗ ${name} removed`, "error");
    updateAllUI();
    updateCartDisplay();
    return true;
  }
  return false;
}

// ================== BASE ACTIONS ==================
function setBase(baseValue, basePrice, baseName) {
  selectedBase = baseValue;
  showNotification(`✓ ${baseName} selected`, "success");
  updateAllUI();
  updateCartDisplay();
}

// ================== SETUP EVENT LISTENERS ==================
function setupEventListeners() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.removeEventListener("click", fruitClickHandler);
    btn.addEventListener("click", fruitClickHandler);
  });

  document.querySelectorAll(".select-base-btn").forEach((btn) => {
    btn.removeEventListener("click", baseClickHandler);
    btn.addEventListener("click", baseClickHandler);
  });

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.removeEventListener("click", nextClickHandler);
    nextBtn.addEventListener("click", nextClickHandler);
  }

  const floatingCart = document.querySelector(".floating-cart");
  if (floatingCart) {
    floatingCart.removeEventListener("click", floatingCartHandler);
    floatingCart.addEventListener("click", floatingCartHandler);
  }
}

// ================== HANDLERS ==================
function fruitClickHandler(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const name = btn.getAttribute("data-name");
  const price = btn.getAttribute("data-price");

  if (btn.textContent === "✓ Added") {
    removeFruit(name);
  } else if (btn.textContent !== "Limit") {
    addFruit(name, price);
  }
}

function baseClickHandler(e) {
  const btn = e.currentTarget;
  const baseValue = btn.getAttribute("data-base");
  const basePrice = parseFloat(btn.getAttribute("data-price"));
  const baseName = btn.getAttribute("data-name");
  setBase(baseValue, basePrice, baseName);
}

function nextClickHandler() {
  if (selectedFruits.length === 0) {
    showNotification("Please select at least one fruit!", "error");
    return;
  }

  saveCart();

  const order = {
    base:
      selectedBase !== "none"
        ? {
            name: selectedBase === "milk" ? "Milk Base" : "Coffee Base",
            price: 2.0,
          }
        : { name: "No Base", price: 0 },
    fruits: selectedFruits,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("juiceOrder", JSON.stringify(order));
  window.location.href = "../order/order.html";
}

function floatingCartHandler() {
  saveCart();
  window.location.href = "../order/order.html";
}

// ================== RESET FUNCTION ==================
function clearOldData() {
  const urlParams = new URLSearchParams(window.location.search);
  const isNew = urlParams.get("new") === "true";

  if (isNew) {
    resetCart();
  }
}

// ================== LOGIN CHECK ==================
function checkLoginStatus() {
  const username = localStorage.getItem("juvo_username");
  const guest = localStorage.getItem("juvo_guest");
  if (!username && !guest) {
    if (confirm("Please login to build your juice!")) {
      window.location.href = "../login/login.html";
    }
  }
}

// ================== INITIALIZATION ==================
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  clearOldData();
  loadCart();
  setupEventListeners();
});
