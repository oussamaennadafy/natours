/* eslint-disable */

const formEl = document.querySelector(".form");

const logoutBtn = document.querySelector(".nav__el--logout");

if (formEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if(logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  })
}