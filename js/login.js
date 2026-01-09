/* =========================================
   LOGIN PAGE LOGIC
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const passwordInput = document.querySelector("#password");
  const loginForm = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");

  // 1. Toggle Lihat Password
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Ganti Ikon SVG
      if (type === "text") {
        this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      } else {
        this.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      }
    });
  }

  // 2. Simulasi Login
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = emailInput.value.toLowerCase();

      if (email.includes("unit")) {
        alert("Login Berhasil sebagai ADMIN UNIT");
        window.location.href = "unit-dashboard.html";
      } else if (email.includes("dosen")) {
        alert("Login Berhasil sebagai ADMIN DOSEN");
        window.location.href = "dosen/index.html";
      } else {
        alert("Login Berhasil sebagai MAHASISWA");
        window.location.href = "dashboard-mahasiswa.html";
      }
    });
  }
});
