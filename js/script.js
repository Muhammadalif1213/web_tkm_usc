/* =========================================
   GLOBAL SCRIPT (Sidebar, Logout, Toggle)
   ========================================= */

// 1. Fungsi Toggle Sidebar Dropdown (Dipanggil via onclick di HTML)
function toggleMenu(element) {
  const parentLi = element.parentElement;
  parentLi.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  // 2. Logika Logout Global
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        // Arahkan ke halaman login
        window.location.href = "index.html";
      }
    });
  }
});
