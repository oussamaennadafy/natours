/* eslint-disable */

const formLogin = document.querySelector(".form--login");

const logoutBtn = document.querySelector(".nav__el--logout");

const saveSettingsBtn = document.querySelector(".save-settings-btn");

const savePasswordBtn = document.querySelector(".save-password-btn");

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    updateSettings({ name, email }, "data");
  });
}

if (savePasswordBtn) {
  savePasswordBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    savePasswordBtn.textContent ="updating..."
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    
    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");
    
    savePasswordBtn.textContent ="Save password"
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
