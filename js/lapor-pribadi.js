/* =========================================
   LAPOR KEGIATAN PRIBADI (2 Step Wizard)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- ELEMEN DOM ---
  const jenisSelect = document.getElementById("jenisKegiatan");
  const detailSection = document.getElementById("detailSection");

  const groupPencapaian = document.getElementById("field-pencapaian");
  const inputPencapaian = document.getElementById("pencapaian");

  const groupPeran = document.getElementById("field-peran");
  const inputPeran = document.getElementById("peran");

  // 1. LOGIKA DINAMIS (Munculkan Form Detail & Toggle Required)
  if (jenisSelect) {
    jenisSelect.addEventListener("change", function () {
      const jenis = this.value;

      // Buka Detail Section
      if (detailSection) detailSection.classList.remove("hidden");

      // Reset tampilan
      groupPencapaian.classList.add("hidden");
      groupPeran.classList.add("hidden");

      // Reset atribut required (agar tidak error saat validasi)
      inputPencapaian.removeAttribute("required");
      inputPeran.removeAttribute("required");

      if (jenis === "lomba") {
        // Tampilkan Juara, Wajibkan isi Juara
        groupPencapaian.classList.remove("hidden");
        inputPencapaian.setAttribute("required", "true");
      } else if (jenis === "kegiatan") {
        // Tampilkan Peran, Wajibkan isi Peran
        groupPeran.classList.remove("hidden");
        inputPeran.setAttribute("required", "true");
      }
    });
  }

  // 2. NAVIGASI WIZARD (Validasi Manual JS)
  window.goToStep = function (stepNumber) {
    // VALIDASI DARI STEP 1 KE STEP 2
    if (stepNumber === 2) {
      const kategori = document.getElementById("kategoriKegiatan").value;
      const jenis = document.getElementById("jenisKegiatan").value;
      const nama = document.getElementById("namaKegiatan").value;
      const lingkup = document.getElementById("lingkup").value;
      const durasi = document.getElementById("durasi").value;
      const tglMulai = document.getElementById("tanggalMulai").value;

      // Ambil elemen pencapaian/peran untuk cek validitas sesuai jenis
      const isLomba = jenis === "lomba";
      const valPencapaian = document.getElementById("pencapaian").value;
      const valPeran = document.getElementById("peran").value;

      // --- LOGIKA VALIDASI (SUDAH DI-UNCOMMENT) ---
      if (!kategori || !jenis) {
        alert("Mohon pilih Kategori dan Jenis Kegiatan.");
        return;
      }

      if (!nama) {
        alert("Mohon isi Nama Kegiatan.");
        return;
      }

      // Validasi Kondisional (Lomba butuh Pencapaian, Kegiatan butuh Peran)
      if (isLomba && !valPencapaian) {
        alert("Mohon pilih Pencapaian/Juara.");
        return;
      }
      if (!isLomba && !valPeran) {
        alert("Mohon pilih Peran Anda.");
        return;
      }

      if (!lingkup) {
        alert("Mohon pilih Lingkup Kegiatan.");
        return;
      }

      if (!durasi) {
        alert("Mohon pilih Durasi Kegiatan.");
        return;
      }

      if (!tglMulai) {
        alert("Mohon lengkapi Tanggal Mulai Kegiatan");
        return;
      }
    }

    // Pindah Tampilan Form (Jika lolos validasi)
    document
      .querySelectorAll(".wizard-step")
      .forEach((el) => el.classList.remove("active"));
    document.getElementById(`step-${stepNumber}`).classList.add("active");

    // Update Progress Bar Indicator
    const indicator2 = document.getElementById("indicator-2");
    if (indicator2) {
      if (stepNumber === 2) {
        indicator2.classList.add("active");
      } else {
        indicator2.classList.remove("active");
      }
    }

    // Scroll ke atas
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
  };

  // 3. SUBMIT FORM
  const formLapor = document.getElementById("formLapor");

  if (formLapor) {
    formLapor.addEventListener("submit", function (e) {
      e.preventDefault(); // Mencegah reload halaman

      // Validasi Akhir (Opsional: Cek apakah file sudah ada)
      const fileInput = document.getElementById("fileBukti");
      const linkInput = document.getElementById("linkBukti");
      // Cek apakah ada file terpilih ATAU link terisi (minimal salah satu)
      // Note: Karena fileInput.value di-reset saat addToList, kita cek isi previewContainer
      const previewContainer = document.getElementById("previewContainer");
      const hasItems =
        previewContainer.querySelectorAll(".file-item").length > 0;

      if (!hasItems) {
        alert("Mohon upload bukti kegiatan (File atau Link) minimal satu.");
        return;
      }

      // 1. Ambil Modal
      const successModal = document.getElementById("successModal");

      // 2. Tampilkan Modal
      if (successModal) {
        successModal.classList.remove("hidden");
        successModal.style.display = "flex"; // Pastikan flex agar tengah
      } else {
        alert("Laporan Berhasil Dikirim!");
        window.location.href = "riwayat.html";
      }
    });
  }

  /* =========================================
     LOGIKA UPLOAD FILE & LINK
     ========================================= */
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileBukti");
  const previewContainer = document.getElementById("previewContainer");
  const btnAddLink = document.getElementById("btnAddLink");
  const linkInput = document.getElementById("linkBukti");
  const emptyText = document.getElementById("emptyText");

  function checkEmptyState() {
    const items = previewContainer.querySelectorAll(".file-item");
    if (items.length > 0) {
      if (emptyText) emptyText.style.display = "none";
    } else {
      if (emptyText) emptyText.style.display = "block";
    }
  }

  // --- HANDLING FILE UPLOAD ---
  if (uploadArea && fileInput) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(
        eventName,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(
        eventName,
        () => uploadArea.classList.add("dragover"),
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(
        eventName,
        () => uploadArea.classList.remove("dragover"),
        false
      );
    });

    uploadArea.addEventListener(
      "drop",
      (e) => {
        const files = e.dataTransfer.files;
        fileInput.files = files;
        addFileToList(files[0]);
      },
      false
    );

    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) addFileToList(this.files[0]);
    });
  }

  function addFileToList(file) {
    if (!file) return;
    const iconDoc = `<svg class="icon-file" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

    const itemHtml = document.createElement("div");
    itemHtml.className = "file-item";
    itemHtml.innerHTML = `
        <div class="file-item-content">
            ${iconDoc}
            <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
        </div>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListEmpty();">×</button>
    `;
    previewContainer.appendChild(itemHtml);
    checkEmptyState();
  }

  // --- FUNGSI NAMBAH LINK KE LIST ---
  if (btnAddLink && linkInput) {
    btnAddLink.addEventListener("click", function () {
      const url = linkInput.value.trim();
      if (!url) {
        alert("Mohon masukkan link terlebih dahulu!");
        return;
      }
      const iconLink = `<svg class="icon-link" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;

      const itemHtml = document.createElement("div");
      itemHtml.className = "file-item";
      itemHtml.innerHTML = `
            <div class="file-item-content">
                ${iconLink}
                <span title="${url}">Link: ${url}</span>
            </div>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListEmpty();">×</button>
        `;
      previewContainer.appendChild(itemHtml);
      checkEmptyState();
      linkInput.value = "";
    });
  }

  window.checkListEmpty = function () {
    setTimeout(checkEmptyState, 50);
  };
});
