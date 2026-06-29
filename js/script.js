let currentCode = null;
let usernameValid = false;

const usernameInput = document.getElementById("username");
const verificationCodeInput = document.getElementById("verificationCode");
const codeContainer = document.getElementById("codeContainer");
const randomCodeSpan = document.getElementById("randomCode");
const refreshCodeBtn = document.getElementById("refreshCode");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const btnText = document.getElementById("btnText");
const btnIcon = document.getElementById("btnIcon");
const hintText = document.querySelector(".hint-text");
const usernameHint = document.querySelector(".username-hint");

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

function showNewCode() {
  currentCode = generateRandomCode();
  randomCodeSpan.textContent = currentCode;
}

function validateUsername(username) {
  const trimmedUsername = username.trim();

  if (trimmedUsername.length !== 5) return false;
  return /^[A-Za-z]+$/.test(trimmedUsername);
}

function validateCode(enteredCode) {
  if (!currentCode) return false;
  const codeNum = parseInt(enteredCode);
  return !isNaN(codeNum) && codeNum === currentCode;
}

function resetCode() {
  showNewCode();
  verificationCodeInput.value = "";
  verificationCodeInput.classList.remove("valid", "invalid");
  sendCodeBtn.disabled = true;
  btnText.textContent = "Send Code";
  btnIcon.className = "fas fa-arrow-right";
}

usernameInput.addEventListener("input", function () {
  if (this.value.length > 5) {
    this.value = this.value.slice(0, 5);
  }

  const isValid = validateUsername(this.value);

  if (!isValid) {
    usernameInput.classList.remove("valid");
    usernameInput.classList.add("invalid");
    usernameValid = false;

    codeContainer.style.display = "none";
    verificationCodeInput.disabled = true;
    sendCodeBtn.disabled = true;
  } else {
    usernameInput.classList.remove("invalid");
    usernameInput.classList.add("valid");
    usernameValid = true;

    codeContainer.style.display = "block";
    verificationCodeInput.disabled = false;
    verificationCodeInput.focus();
    showNewCode();
  }
});

verificationCodeInput.addEventListener("input", function () {
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4);
  }

  this.value = this.value.replace(/[^0-9]/g, "");

  if (this.value.length === 4) {
    const isValid = validateCode(this.value);

    if (isValid) {
      this.classList.remove("invalid");
      this.classList.add("valid");
      sendCodeBtn.disabled = false;
      btnText.textContent = "Login";
      btnIcon.className = "fas fa-check-circle";
    } else {
      this.classList.remove("valid");
      this.classList.add("invalid");
      sendCodeBtn.disabled = true;
      btnText.textContent = "Send Code";
      btnIcon.className = "fas fa-arrow-right";
      resetCode();
    }
  } else {
    this.classList.remove("valid", "invalid");
    sendCodeBtn.disabled = true;
    btnText.textContent = "Send Code";
    btnIcon.className = "fas fa-arrow-right";
  }
});

refreshCodeBtn.addEventListener("click", function () {
  if (usernameValid) {
    showNewCode();
    verificationCodeInput.value = "";
    verificationCodeInput.classList.remove("valid", "invalid");
    sendCodeBtn.disabled = true;
    btnText.textContent = "Send Code";
    btnIcon.className = "fas fa-arrow-right";
  }
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const enteredCode = verificationCodeInput.value;

  if (usernameValid && validateCode(enteredCode)) {
    localStorage.setItem("juvo_username", username);
    localStorage.setItem("juvo_login_time", new Date().toISOString());

    alert(`✅ Welcome ${username}! Login successful.`);
    window.location.href = "home/home.html";

    usernameInput.value = "";
    verificationCodeInput.value = "";
    codeContainer.style.display = "none";
    sendCodeBtn.disabled = true;
    usernameInput.classList.remove("valid");
    usernameInput.focus();

    usernameHint.style.display = "flex";
    hintText.style.color = "#5b7562";
    hintText.innerHTML =
      '<i class="fas fa-info-circle"></i> Only English letters, exactly 5 characters';
  }
});

function continueAsGuest() {
  localStorage.setItem("juvo_guest", "true");
  localStorage.setItem("juvo_login_time", new Date().toISOString());
  alert("✅ Continuing as Guest");
  window.location.href = "home/home.html";
}

usernameInput.focus();

usernameInput.setAttribute("placeholder", " ");
verificationCodeInput.setAttribute("placeholder", " ");
