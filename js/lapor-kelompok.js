/* =========================================
   LAPOR KEGIATAN KELOMPOK (Logic Toggle & 3 Steps)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. GATEKEEPER LOGIC (TOGGLE VIEW) ---
  const gatekeeperSection = document.getElementById("gatekeeperSection");
  const formSection = document.getElementById("formSection");

  // Saat tombol "Benar" diklik
  window.handleIsKetua = function () {
    // Sembunyikan Card Gatekeeper
    if (gatekeeperSection) gatekeeperSection.classList.add("hidden");
    // Tampilkan Form Card
    if (formSection) {
      formSection.classList.remove("hidden");
      // Animasi kecil agar halus
      formSection.style.animation = "fadeIn 0.5s ease";
    }
  };

  window.backToGatekeeper = function () {
    // Sembunyikan Form
    if (formSection) formSection.classList.add("hidden");
    // Munculkan Gatekeeper
    if (gatekeeperSection) {
      gatekeeperSection.classList.remove("hidden");
      gatekeeperSection.style.animation = "fadeIn 0.5s ease";
    }
  };

  window.handleNotKetua = function () {
    alert("Akses Ditolak. Anda akan diarahkan kembali ke Dashboard.");
    window.location.href = "dashboard-mahasiswa.html";
  };

  // --- 2. LOGIKA DINAMIS STEP 1 (Show Detail) ---
  const jenisSelect = document.getElementById("jenisKegiatan");
  const detailSection = document.getElementById("detailSection");
  const lombaFields = document.getElementById("lombaFields");
  const inputPeran = document.getElementById("peranAnggota");

  if (jenisSelect) {
    jenisSelect.addEventListener("change", function () {
      const jenis = this.value;

      // Auto Show Detail
      if (detailSection) detailSection.classList.remove("hidden");

      // Logic Lomba
      if (jenis === "lomba") {
        if (lombaFields) lombaFields.classList.remove("hidden");
        if (inputPeran) {
          inputPeran.value = "anggota";
          inputPeran.disabled = true;
        }
      } else {
        if (lombaFields) lombaFields.classList.add("hidden");
        if (inputPeran) inputPeran.disabled = false;
      }
    });
  }

  // --- 3. WIZARD NAVIGATION (3 Step) ---
  let currentStep = 1;

  window.nextStep = function (targetStep) {
    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }
    showStep(targetStep);
  };

  window.prevStep = function (targetStep) {
    showStep(targetStep);
  };

  function showStep(step) {
    document
      .querySelectorAll(".wizard-step")
      .forEach((el) => el.classList.remove("active"));
    const target = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (target) target.classList.add("active");

    currentStep = step;
    updateProgressBar(step);
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
  }

  function updateProgressBar(step) {
    document
      .querySelectorAll(".step")
      .forEach((el) => el.classList.remove("active"));
    const indicators = document.querySelectorAll(".step");
    for (let i = 0; i < step; i++) {
      if (indicators[i]) indicators[i].classList.add("active");
    }
  }

  function validateStep(step) {
    // Logika Validasi Step 1 (Gabungan)
    if (step === 1) {
      const kat = document.getElementById("kategoriKegiatan").value;
      const jen = document.getElementById("jenisKegiatan").value;

      if (!kat || !jen) {
        alert("Mohon pilih Kategori dan Jenis.");
        return false;
      }

      // Cek detail juga karena sudah muncul
      const nama = document.getElementById("namaKegiatan").value;
      if (!nama) {
        alert("Mohon isi Nama Kegiatan.");
        return false;
      }
    }
    return true;
  }

  // --- (Fungsi Upload & Tambah Anggota sama seperti sebelumnya) ---
  // Pastikan kode tambahAnggota, handleFileUpload, btnAddLink ada di sini

  // --- 6. SUBMIT ---
  const formKelompok = document.getElementById("formKelompok");
  if (formKelompok) {
    formKelompok.addEventListener("submit", function (e) {
      e.preventDefault();
      const successModal = document.getElementById("successModal");
      if (successModal) {
        successModal.classList.remove("hidden");
        successModal.style.display = "flex"; // Pastikan modal sukses tetap overlay
      }
    });
  }
});
