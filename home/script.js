// ================== STATE ==================
let cart = { items: [] };

const favoriteProducts = [
  { id: "strawberry-milk", name: "Strawberry Milk", price: 5.0 },
  { id: "coconut-milk", name: "Coconut Milk", price: 6.0 },
  { id: "blueberry-coffee", name: "Blueberry Coffee", price: 6.0 },
  { id: "banana-coffee", name: "Banana Coffee", price: 4.5 },
];

// ================== CART FUNCTIONS ==================
function loadCart() {
  const saved = localStorage.getItem("juiceCart");
  if (!saved) {
    cart = { items: [] };
    return;
  }

  const parsed = JSON.parse(saved);
  if (parsed.items) {
    cart = parsed;
  } else {
    const items = [];
    if (parsed.baseType) items.push(parsed.baseType);
    if (parsed.baseFruit) items.push(parsed.baseFruit);
    if (parsed.addons) items.push(...parsed.addons);
    cart = { items: items };
  }
  updateCartDisplay();
}

function saveCart() {
  const existing = JSON.parse(localStorage.getItem("juiceCart") || "{}");
  const favoriteItems = cart.items.filter((item) =>
    favoriteProducts.some((p) => p.id === item.id),
  );

  const newCart = {
    baseType: existing.baseType || null,
    baseFruit: existing.baseFruit || null,
    addons: favoriteItems,
  };

  localStorage.setItem("juiceCart", JSON.stringify(newCart));
}

function updateCartDisplay() {
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.querySelector(".cart-total");

  if (cartCount) {
    const totalItems = cart.items.length;
    cartCount.textContent = totalItems;
  }

  if (cartTotal) {
    const total = cart.items.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = "$" + total.toFixed(2);
  }
  saveCart();
}

function showNotification(message) {
  let notification = document.querySelector(".cart-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.style.cssText = `
            position: fixed; bottom: 100px; right: 20px;
            background: #4CAF50; color: white; padding: 10px 20px;
            border-radius: 8px; font-size: 14px; z-index: 9999;
            opacity: 0; transition: opacity 0.3s ease;
            font-family: 'Cause', sans-serif;
        `;
    document.body.appendChild(notification);
  }
  notification.textContent = message;
  notification.style.opacity = "1";
  setTimeout(() => (notification.style.opacity = "0"), 2000);
}

// ================== SETUP BUTTONS ==================
function setupFavoriteButtons() {
  const buttons = document.querySelectorAll(".select-favorite-btn");

  buttons.forEach((button, index) => {
    const product = favoriteProducts[index];
    if (!product) return;

    const newBtn = button.cloneNode(true);
    button.parentNode.replaceChild(newBtn, button);

    const isInCart = cart.items.some((item) => item.id === product.id);
    newBtn.textContent = isInCart ? "✓ Selected" : "Select";
    newBtn.style.background = isInCart ? "#4CAF50" : "#FF9800";

    newBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const exists = cart.items.some((item) => item.id === product.id);

      if (exists) {
        cart.items = cart.items.filter((item) => item.id !== product.id);
        newBtn.textContent = "Select";
        newBtn.style.background = "#FF9800";
        showNotification(`✗ ${product.name} removed`);
      } else {
        cart.items.push({ ...product, quantity: 1 });
        newBtn.textContent = "✓ Selected";
        newBtn.style.background = "#4CAF50";
        showNotification(`✓ ${product.name} added to cart`);
      }

      updateCartDisplay();

      const cartEl = document.querySelector(".floating-cart");
      if (cartEl) {
        cartEl.style.transform = "scale(1.1)";
        setTimeout(() => (cartEl.style.transform = "scale(1)"), 200);
      }
    });
  });
}

// ================== SLIDER ==================
function initSlider() {
  const wrapper = document.querySelector(".cards-slider-wrapper");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const cards = document.querySelectorAll(".card");

  if (!wrapper || !prevBtn || !nextBtn || cards.length === 0) return;

  const getScrollAmount = () => {
    const cardWidth = cards[0].offsetWidth;
    const slider = wrapper.querySelector(".cards-slider");
    const gap = slider ? parseInt(getComputedStyle(slider).gap) || 20 : 20;
    return cardWidth + gap;
  };

  const newPrev = prevBtn.cloneNode(true);
  const newNext = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrev, prevBtn);
  nextBtn.parentNode.replaceChild(newNext, nextBtn);

  newPrev.addEventListener("click", () =>
    wrapper.scrollBy({ left: -getScrollAmount(), behavior: "smooth" }),
  );
  newNext.addEventListener("click", () =>
    wrapper.scrollBy({ left: getScrollAmount(), behavior: "smooth" }),
  );
}

function updateDynamicDots() {
  const wrapper = document.querySelector(".cards-slider-wrapper");
  const cards = document.querySelectorAll(".card");
  const dots = document.querySelector(".slider-dots");
  if (!wrapper || !dots || cards.length === 0) return;

  const update = () => {
    const perView =
      wrapper.clientWidth >= 992 ? 3 : wrapper.clientWidth >= 576 ? 2 : 1;
    const total = Math.ceil(cards.length / perView);

    if (dots.children.length !== total) {
      dots.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.onclick = () =>
          wrapper.scrollTo({
            left: i * wrapper.clientWidth,
            behavior: "smooth",
          });
        dots.appendChild(dot);
      }
    }
    const active =
      Math.round(
        (wrapper.scrollLeft / (wrapper.scrollWidth - wrapper.clientWidth)) *
          (total - 1),
      ) || 0;
    Array.from(dots.children).forEach((d, i) =>
      d.classList.toggle("active", i === active),
    );
  };
  wrapper.addEventListener("scroll", update);
  window.addEventListener("resize", () => setTimeout(update, 100));
  setTimeout(update, 100);
}

// ================== MODAL ==================
function setupModal() {
  const modal = document.getElementById("aboutModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const aboutSection = document.querySelector("#about");

  if (modal && aboutSection) {
    aboutSection.addEventListener(
      "click",
      () => (modal.style.display = "block"),
    );
  }
  if (closeBtn) {
    closeBtn.onclick = () => (modal.style.display = "none");
  }
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}

// ================== LOGIN ==================
function checkLoginStatus() {
  const username = localStorage.getItem("juvo_username");
  const guest = localStorage.getItem("juvo_guest");

  if (!username && !guest) {
    if (confirm("Please login or continue as guest?")) {
      window.location.href = "login/login.html";
    } else {
      localStorage.setItem("juvo_guest", "true");
    }
  }
}

// ================== NAVBAR ==================
function loadNavbar() {
  fetch("../navbar/navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      const hamburger = document.getElementById("hamburger");
      const navMenu = document.getElementById("nav-menu");
      if (hamburger && navMenu) {
        hamburger.addEventListener("click", () =>
          navMenu.classList.toggle("active"),
        );
      }

      const logoutBtn = document.querySelector("#logout-btn, .logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Logout?")) {
            localStorage.clear();
            window.location.href = "login/login.html";
          }
        });
      }

      initializePage();
    })
    .catch((err) => console.log("Navbar error:", err));
}

function initializePage() {
  loadCart();
  setupFavoriteButtons();
  initSlider();
  updateDynamicDots();
  setupModal();
}

// ================== START ==================
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  loadNavbar();
});
