/* =========================================
   LAPOR KEGIATAN PRIBADI (Create & Edit Mode)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- ELEMEN DOM ---
  const formLapor = document.getElementById("formLapor");
  const jenisSelect = document.getElementById("jenisKegiatan");
  const detailSection = document.getElementById("detailSection");
  const pageHeader = document.querySelector(".page-header");
  const btnSubmit = document.querySelector("button[type='submit']");
  const btnCancelEdit = document.getElementById("btnCancelEdit");

  // --- CEK MODE EDIT ---
  const editIndex = localStorage.getItem("editIndex");
  let isEditMode = false;

  // Init Listener untuk tombol Batal (Dipasang di awal)
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", function () {
      localStorage.removeItem("editIndex");
      window.location.href = "riwayat.html";
    });
  }

  if (editIndex !== null) {
    isEditMode = true;
    loadEditData(editIndex);

    // Munculkan Tombol Batal di Step 1
    if (btnCancelEdit) btnCancelEdit.classList.remove("hidden");
  }

  // 1. FUNGSI LOAD DATA EDIT
  function loadEditData(index) {
    const storedData = JSON.parse(localStorage.getItem("riwayatData"));
    if (!storedData || !storedData[index]) return;

    const data = storedData[index];

    // A. Ubah Tampilan Judul & Tombol
    if (pageHeader) pageHeader.innerText = "Edit Laporan Kegiatan";
    if (btnSubmit) btnSubmit.innerText = "Simpan Perubahan";

    // B. Isi Dropdown Kategori & Jenis
    if (data.kategori) {
      document.getElementById("kategoriKegiatan").value =
        data.kategori.toLowerCase();
    }

    // Mapping Jenis
    let jenisValue = "kegiatan"; // default
    if (data.jenis) {
      jenisValue = data.jenis === "Wajib" ? "kegiatan" : "lomba";
      document.getElementById("jenisKegiatan").value = jenisValue;
    }

    // --- UPDATE UTAMA DISINI ---
    // C. Langsung Munculkan Detail Section (Force Show)
    if (detailSection) {
      detailSection.classList.remove("hidden");
    }

    // D. Atur Field Khusus (Pencapaian vs Peran) secara manual
    const groupPencapaian = document.getElementById("field-pencapaian");
    const groupPeran = document.getElementById("field-peran");

    // Reset dulu (hide dua-duanya)
    if (groupPencapaian) groupPencapaian.classList.add("hidden");
    if (groupPeran) groupPeran.classList.add("hidden");

    // Munculkan sesuai jenis yang di-load
    if (jenisValue === "lomba") {
      if (groupPencapaian) groupPencapaian.classList.remove("hidden");
      // Jika Anda menyimpan data juara, set value-nya di sini
      // document.getElementById("pencapaian").value = data.pencapaian;
    } else {
      if (groupPeran) groupPeran.classList.remove("hidden");
      // Jika Anda menyimpan data peran, set value-nya di sini
      // document.getElementById("peran").value = data.peran;
    }

    // E. Isi Data Text Lainnya
    document.getElementById("namaKegiatan").value = data.nama;

    // Konversi Tanggal
    const dateParts = parseDateString(data.tgl);
    document.getElementById("tanggalMulai").value = dateParts;
  }

  // Helper konversi tanggal
  function parseDateString(dateStr) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    if (!dateStr) return "";
    const parts = dateStr.split(" ");
    if (parts.length === 3) {
      return `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, "0")}`;
    }
    return "";
  }

  // 2. LOGIKA DINAMIS (Event Listener untuk perubahan manual user)
  if (jenisSelect) {
    jenisSelect.addEventListener("change", function () {
      const jenis = this.value;
      const groupPencapaian = document.getElementById("field-pencapaian");
      const groupPeran = document.getElementById("field-peran");

      // Buka Detail Section
      if (detailSection) detailSection.classList.remove("hidden");

      // Reset & Toggle Field Khusus
      if (groupPencapaian) groupPencapaian.classList.add("hidden");
      if (groupPeran) groupPeran.classList.add("hidden");

      if (jenis === "lomba") {
        if (groupPencapaian) groupPencapaian.classList.remove("hidden");
      } else if (jenis === "kegiatan") {
        if (groupPeran) groupPeran.classList.remove("hidden");
      }
    });
  }

  // 3. NAVIGASI WIZARD
  window.goToStep = function (stepNumber) {
    if (stepNumber === 2) {
      const kategori = document.getElementById("kategoriKegiatan").value;
      const jenis = document.getElementById("jenisKegiatan").value;
      const nama = document.getElementById("namaKegiatan").value;
      const tglMulai = document.getElementById("tanggalMulai").value;

      if (!kategori || !jenis) {
        alert("Mohon pilih Kategori dan Jenis.");
        return;
      }
      if (!nama) {
        alert("Mohon isi Nama Kegiatan.");
        return;
      }
      if (!tglMulai) {
        alert("Mohon isi Tanggal.");
        return;
      }
    }

    document
      .querySelectorAll(".wizard-step")
      .forEach((el) => el.classList.remove("active"));
    document.getElementById(`step-${stepNumber}`).classList.add("active");

    const indicator2 = document.getElementById("indicator-2");
    if (indicator2) {
      stepNumber === 2
        ? indicator2.classList.add("active")
        : indicator2.classList.remove("active");
    }
  };

  // 4. SUBMIT FORM
  if (formLapor) {
    formLapor.addEventListener("submit", function (e) {
      e.preventDefault();

      // Ambil Value
      const nama = document.getElementById("namaKegiatan").value;
      const kategoriVal = document.getElementById("kategoriKegiatan").value;
      const jenisVal = document.getElementById("jenisKegiatan").value;
      const tglInput = document.getElementById("tanggalMulai").value;

      // Format Data
      const dateObj = new Date(tglInput);
      const tglFormatted = dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const kategoriText =
        kategoriVal.charAt(0).toUpperCase() + kategoriVal.slice(1);
      let jenisText = "Wajib";
      if (jenisVal === "lomba") jenisText = "Pilihan";

      // Validasi File
      const previewContainer = document.getElementById("previewContainer");
      const hasItems =
        previewContainer.querySelectorAll(".file-item").length > 0;

      if (!isEditMode && !hasItems) {
        alert("Mohon upload bukti kegiatan.");
        return;
      }

      let currentData = JSON.parse(localStorage.getItem("riwayatData")) || [];

      if (isEditMode) {
        // --- UPDATE ---
        const index = parseInt(editIndex);
        currentData[index].nama = nama;
        currentData[index].kategori = kategoriText;
        currentData[index].jenis = jenisText;
        currentData[index].tgl = tglFormatted;

        localStorage.setItem("riwayatData", JSON.stringify(currentData));
        localStorage.removeItem("editIndex");
        alert("Perubahan berhasil disimpan!");
      } else {
        // --- CREATE ---
        const newItem = {
          tgl: tglFormatted,
          nama: nama,
          kategori: kategoriText,
          jenis: jenisText,
          poin: 0,
          status: "Menunggu Validasi",
          ket: "-",
        };
        currentData.unshift(newItem);
        localStorage.setItem("riwayatData", JSON.stringify(currentData));
        localStorage.setItem("activeTab", "status");
      }

      // Success Modal
      const successModal = document.getElementById("successModal");
      if (successModal) {
        if (isEditMode) {
          successModal.querySelector("h3").innerText = "Data Diperbarui!";
          successModal.querySelector("p").innerText =
            "Data kegiatan Anda telah berhasil diperbarui.";
        }
        successModal.classList.remove("hidden");
        successModal.style.display = "flex";
      } else {
        window.location.href = "riwayat.html";
      }
    });
  }

  // --- LOGIKA UPLOAD ---
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

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", () => fileInput.click());
    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
      uploadArea.addEventListener(
        evt,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });
    ["dragenter", "dragover"].forEach((evt) => {
      uploadArea.addEventListener(
        evt,
        () => uploadArea.classList.add("dragover"),
        false
      );
    });
    ["dragleave", "drop"].forEach((evt) => {
      uploadArea.addEventListener(
        evt,
        () => uploadArea.classList.remove("dragover"),
        false
      );
    });

    uploadArea.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      fileInput.files = files;
      addFileToList(files[0]);
    });

    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) addFileToList(this.files[0]);
    });
  }

  function addFileToList(file) {
    if (!file) return;
    const itemHtml = document.createElement("div");
    itemHtml.className = "file-item";
    itemHtml.innerHTML = `<span>📄 ${file.name}</span><button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListEmpty();">×</button>`;
    previewContainer.appendChild(itemHtml);
    checkEmptyState();
  }

  if (btnAddLink) {
    btnAddLink.addEventListener("click", function () {
      const url = linkInput.value;
      if (url) {
        const itemHtml = document.createElement("div");
        itemHtml.className = "file-item";
        itemHtml.innerHTML = `<span>🔗 ${url}</span><button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListEmpty();">×</button>`;
        previewContainer.appendChild(itemHtml);
        checkEmptyState();
        linkInput.value = "";
      }
    });
  }

  window.checkListEmpty = function () {
    setTimeout(checkEmptyState, 50);
  };
});
