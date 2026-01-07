/* =========================================
   LAPOR KEGIATAN KELOMPOK (4 Step Wizard)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. GATEKEEPER (Validasi Ketua) ---
  const gatekeeperModal = document.getElementById("gatekeeperModal");
  if (gatekeeperModal) {
    gatekeeperModal.classList.remove("hidden");
  }

  window.handleIsKetua = function () {
    gatekeeperModal.classList.add("hidden");
    setTimeout(() => (gatekeeperModal.style.display = "none"), 300);
  };

  window.handleNotKetua = function () {
    alert("Akses Ditolak. Hanya Ketua Kelompok yang dapat melapor.");
    window.location.href = "dashboard-mahasiswa.html";
  };

  // --- 2. LOGIKA DINAMIS (Lomba vs Kegiatan) ---
  const jenisSelect = document.getElementById("jenisKegiatan");
  const lombaFields = document.getElementById("lombaFields");
  const inputPeran = document.getElementById("peranAnggota");

  if (jenisSelect) {
    jenisSelect.addEventListener("change", function () {
      const jenis = this.value;
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

  // --- 3. NAVIGASI WIZARD (Next/Prev Step) ---
  // Note: HTML kelompok pakai fungsi nextStep/prevStep, bukan goToStep
  let currentStep = 1;

  window.nextStep = function (targetStep) {
    // Validasi sederhana
    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }
    showStep(targetStep);
  };

  window.prevStep = function (targetStep) {
    showStep(targetStep);
  };

  function showStep(step) {
    // Hide all
    document
      .querySelectorAll(".wizard-step")
      .forEach((el) => el.classList.remove("active"));
    // Show target
    const target = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (target) target.classList.add("active");

    currentStep = step;
    updateProgressBar(step);
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
  }

  function updateProgressBar(step) {
    // Reset Logic
    document
      .querySelectorAll(".step")
      .forEach((el) => el.classList.remove("active"));

    // Logic mapping step form ke step indicator (karena form ada 4, indicator ada 3)
    // Step 1 & 2 -> Indicator 1
    // Step 3 -> Indicator 2
    // Step 4 -> Indicator 3
    let activeIndex = 1;
    if (step >= 3) activeIndex = 2;
    if (step >= 4) activeIndex = 3;

    const indicators = document.querySelectorAll(".step");
    for (let i = 0; i < activeIndex; i++) {
      indicators[i].classList.add("active");
    }
  }

  function validateStep(step) {
    if (step === 1) {
      const kat = document.getElementById("kategoriKegiatan").value;
      const jen = document.getElementById("jenisKegiatan").value;
      if (!kat || !jen) {
        alert("Mohon pilih Kategori dan Jenis.");
        return false;
      }
    }
    if (step === 2) {
      const nama = document.getElementById("namaKegiatan").value;
      if (!nama) {
        alert("Mohon isi Nama Kegiatan.");
        return false;
      }
    }
    return true;
  }

  // --- 4. MANAJEMEN ANGGOTA ---
  window.tambahAnggota = function () {
    const nim = document.getElementById("nimAnggota").value;
    const nama = document.getElementById("namaAnggota").value;
    const peran = document.getElementById("peranAnggota").value;
    const list = document.getElementById("anggotaList");

    if (!nim || !nama) {
      alert("Mohon isi NIM dan Nama.");
      return;
    }

    const div = document.createElement("div");
    div.className = "anggota-item";
    div.innerHTML = `
            <div class="anggota-info">
                <strong>${nama}</strong>
                <small>NIM: ${nim} • Peran: ${peran.toUpperCase()}</small>
            </div>
            <button type="button" class="btn-remove-anggota" onclick="this.parentElement.remove()">Hapus</button>
        `;
    list.appendChild(div);

    // Clear input
    document.getElementById("nimAnggota").value = "";
    document.getElementById("namaAnggota").value = "";
  };

  // --- 5. UPLOAD LOGIC ---
  window.handleFileUpload = function (input) {
    // (Isi sama seperti sebelumnya)
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    if (input.files) {
      const div = document.createElement("div");
      div.className = "file-item";
      div.innerHTML = `<span>📄 ${input.files[0].name}</span>`;
      fileList.appendChild(div);
    }
  };

  window.tambahLink = function () {
    // (Isi sama seperti sebelumnya)
  };

  // --- 6. SUBMIT ---
  document
    .getElementById("formKelompok")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("successModal").classList.remove("hidden");
    });
});
