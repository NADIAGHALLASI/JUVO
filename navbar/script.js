// ================== Navbar ==================
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar");
  console.log("🔍 navbar container found:", navbarContainer);

  if (navbarContainer) {
    console.log("✅ Loading navbar...");
    loadNavbar();
  } else {
    console.log("❌ No navbar container found on this page");
  }
});

function loadNavbar() {
  fetch("/navbar/navbar.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((data) => {
      console.log("✅ Navbar loaded successfully!");
      document.getElementById("navbar").innerHTML = data;

      initHamburgerMenu();
      initAboutModal();
    })
    .catch((err) => {
      console.error("❌ Navbar load error:", err);
      // Fallback:
      fetch("../navbar/navbar.html")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.text();
        })
        .then((data) => {
          console.log("✅ Navbar loaded successfully (fallback)!");
          document.getElementById("navbar").innerHTML = data;
          initHamburgerMenu();
          initAboutModal();
        })
        .catch((err2) =>
          console.error("❌ Navbar load error (fallback):", err2),
        );
    });
}

function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }
}

// ================== ABOUT MODAL ==================
function initAboutModal() {
  function waitForElements() {
    const aboutBtn = document.getElementById("aboutBtn");
    const modal = document.getElementById("aboutModal");
    const closeBtn = document.getElementById("closeModalBtn");

    if (aboutBtn && modal) {
      console.log("✅ About button and modal found!");

      const newAboutBtn = aboutBtn.cloneNode(true);
      aboutBtn.parentNode.replaceChild(newAboutBtn, aboutBtn);

      newAboutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("🎯 About button clicked!");
        modal.style.display = "flex";
      });

      if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        newCloseBtn.addEventListener("click", function () {
          modal.style.display = "none";
        });
      }

      window.addEventListener("click", function (e) {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
          modal.style.display = "none";
        }
      });

      return true;
    }
    return false;
  }

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    const found = waitForElements();
    if (found || attempts > 50) {
      clearInterval(interval);
      if (!found) console.log("❌ About modal elements not found!");
    }
  }, 100);
}
