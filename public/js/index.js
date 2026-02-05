/* eslint-disable */

const formLogin = document.querySelector(".form--login");

const logoutBtn = document.querySelector(".nav__el--logout");

const saveSettingsBtn = document.querySelector(".save-settings-btn");

const savePasswordBtn = document.querySelector(".save-password-btn");

const bookBtn = document.getElementById("book-tour");

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
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);

    updateSettings(form, "data");
  });
}

if (savePasswordBtn) {
  savePasswordBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    savePasswordBtn.textContent = "updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
    );

    savePasswordBtn.textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", async (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}