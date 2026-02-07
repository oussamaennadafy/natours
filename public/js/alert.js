/* eslint-disable */

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

// type is either "success" or "error"
const showAlert = (type, message, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}"> ${message} </div>`;
  document.querySelector("body").insertAdjacentHTML("beforebegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};
