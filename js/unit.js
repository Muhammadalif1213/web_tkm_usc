/* =========================================
   LOGIKA ADMIN UNIT (Wizard & Input Peserta)
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- PERBAIKAN DI SINI ---
  // Ubah function biasa menjadi window.function agar bisa dipanggil dari HTML (onclick)

  window.downloadCSVTemplate = function () {
    // 1. Tentukan Header & Data Contoh
    const headers = ["NIM", "Nama Mahasiswa", "Jurusan"];
    const rows = [
      ["20220140001", "Contoh Mahasiswa 1", "Teknologi Informasi"],
      ["20220140002", "Contoh Mahasiswa 2", "Hukum"],
    ];

    // 2. Gabungkan menjadi String CSV
    let csvContent = headers.join(",") + "\n";

    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    // 3. Buat Blob (File Virtual)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // 4. Buat URL Object
    const url = URL.createObjectURL(blob);

    // 5. Buat Elemen Link Sementara untuk Trigger Download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_peserta_kegiatan.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click(); // Klik otomatis
    document.body.removeChild(link); // Hapus setelah klik
  };

  // (Bagian event listener .download-link yang lama dihapus saja karena sudah pakai onclick di HTML)

  // 1. DATA DUMMY MAHASISWA (Untuk Search Manual)
  const dbMahasiswa = [
    {
      nim: "20220140075",
      nama: "Muhammad Alifian Aqilah",
      prodi: "Teknologi Informasi",
    },
    {
      nim: "20220140078",
      nama: "Alvien Ridho Nanda",
      prodi: "Teknologi Informasi",
    },
    { nim: "20220140080", nama: "Rahmat Hidayat", prodi: "Hukum" },
    { nim: "20220140082", nama: "Siti Aminah", prodi: "Manajemen" },
  ];

  // 2. NAVIGASI WIZARD & PROGRESS BAR
  window.goToStep = function (step) {
    // A. Pindah Step Form
    document
      .querySelectorAll(".wizard-step")
      .forEach((el) => el.classList.remove("active"));
    document.getElementById(`step-${step}`).classList.add("active");

    // B. Update Progress Bar
    const progressFill = document.getElementById("progressFill");

    // Logika Lebar: Step 1 = 33%, Step 2 = 66%, Step 3 = 100%
    let widthPercentage = "33%";
    if (step === 2) widthPercentage = "66%";
    if (step === 3) widthPercentage = "100%";

    if (progressFill) progressFill.style.width = widthPercentage;

    // C. Update Label Bold
    document
      .querySelectorAll(".p-label")
      .forEach((el) => el.classList.remove("active"));
    // Highlight label step sekarang DAN step sebelumnya
    for (let i = 1; i <= step; i++) {
      document.getElementById(`lbl-${i}`).classList.add("active");
    }

    // Scroll ke atas agar user sadar pindah halaman
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
  };

  // 3. TAB SWITCHER (MANUAL vs CSV)
  window.switchMethod = function (method) {
    document
      .querySelectorAll(".method-tab")
      .forEach((btn) => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");

    document
      .querySelectorAll(".method-content")
      .forEach((el) => el.classList.remove("active"));
    document.getElementById(`method-${method}`).classList.add("active");
  };

  // 4. SEARCH & ADD MANUAL
  const inputNIM = document.getElementById("inputNIM");
  const dropdown = document.getElementById("dropdownManual");
  const tbody = document.getElementById("manualTableBody");
  const countEl = document.getElementById("countManual");
  let pesertaList = [];

  if (inputNIM) {
    inputNIM.addEventListener("input", function (e) {
      const val = e.target.value.toLowerCase();
      dropdown.innerHTML = "";

      if (val.length > 0) {
        const matches = dbMahasiswa.filter(
          (m) => m.nim.includes(val) || m.nama.toLowerCase().includes(val)
        );
        if (matches.length > 0) {
          dropdown.classList.remove("hidden");
          matches.forEach((m) => {
            const div = document.createElement("div");
            div.className = "search-item";
            div.innerHTML = `<strong>${m.nama}</strong><br><small>${m.nim} - ${m.prodi}</small>`;
            div.onclick = () => addPeserta(m);
            dropdown.appendChild(div);
          });
        } else {
          dropdown.classList.add("hidden");
        }
      } else {
        dropdown.classList.add("hidden");
      }
    });
  }

  function addPeserta(m) {
    if (pesertaList.find((p) => p.nim === m.nim)) {
      alert("Mahasiswa sudah ada di list!");
      dropdown.classList.add("hidden");
      inputNIM.value = "";
      return;
    }
    pesertaList.push(m);
    renderTable();
    dropdown.classList.add("hidden");
    inputNIM.value = "";
  }

  function renderTable() {
    tbody.innerHTML = "";
    pesertaList.forEach((p, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${p.nim}</td>
            <td>${p.nama}</td>
            <td>${p.prodi}</td>
            <td class="text-center"><button type="button" class="remove-btn" onclick="removePeserta(${idx})">×</button></td>
        `;
      tbody.appendChild(tr);
    });
    countEl.innerText = pesertaList.length;
  }

  window.removePeserta = function (idx) {
    pesertaList.splice(idx, 1);
    renderTable();
  };

  // 5. CSV HANDLING
  window.handleCSV = function (input) {
    if (input.files.length > 0) {
      const file = input.files[0];

      // Elemen DOM
      const resultContainer = document.getElementById("csvResultContainer");
      const countValue = document.getElementById("countCSVValue");
      const fileNameEl = document.getElementById("csvFileName");
      const fileSizeEl = document.getElementById("csvFileSize");

      // A. Tampilkan Nama File
      fileNameEl.innerText = file.name;

      // B. Hitung Ukuran File (Bytes -> KB -> MB)
      let sizeText = "";
      if (file.size < 1024 * 1024) {
        sizeText = (file.size / 1024).toFixed(1) + " KB";
      } else {
        sizeText = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      }
      fileSizeEl.innerText = sizeText;

      // C. Baca Isi File untuk Hitung Baris
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        const rows = text.split(/\r\n|\n/).filter((row) => row.trim() !== "");

        // Hitung (Total - Header)
        let memberCount = rows.length > 1 ? rows.length - 1 : 0;

        // Update UI
        countValue.innerText = memberCount;
        resultContainer.classList.remove("hidden");
      };

      reader.readAsText(file);
    }
  };

  window.clearCSV = function () {
    document.getElementById("fileCSV").value = "";
    document.getElementById("csvResultContainer").classList.add("hidden");
  };

  // --- 5B. CSV DRAG & DROP LOGIC ---
  const csvDropZone = document.querySelector(".csv-upload-box");
  const csvInput = document.getElementById("fileCSV");

  if (csvDropZone && csvInput) {
    // 1. Klik area box untuk memicu input file (Opsional, agar area klik lebih luas)
    csvDropZone.addEventListener("click", (e) => {
      // Cek jika yang diklik BUKAN tombol (karena tombol sudah punya onclick sendiri)
      if (e.target.tagName !== "BUTTON") {
        csvInput.click();
      }
    });

    // 2. Prevent Default Browser Behavior (Mencegah file dibuka di tab baru)
    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
      csvDropZone.addEventListener(
        evt,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });

    // 3. Visual Feedback (Highlight saat file masuk area)
    ["dragenter", "dragover"].forEach((evt) => {
      csvDropZone.addEventListener(
        evt,
        () => {
          csvDropZone.classList.add("dragover");
        },
        false
      );
    });

    // 4. Hapus Highlight (Saat file keluar area atau di-drop)
    ["dragleave", "drop"].forEach((evt) => {
      csvDropZone.addEventListener(
        evt,
        () => {
          csvDropZone.classList.remove("dragover");
        },
        false
      );
    });

    // 5. HANDLE FILE DROP
    csvDropZone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;

      // Pastikan ada file dan formatnya CSV
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          // Assign file ke input elemen agar logic handleCSV bisa jalan
          csvInput.files = files;

          // Panggil fungsi processing yang sudah kita buat sebelumnya
          window.handleCSV(csvInput);
        } else {
          alert("Mohon upload file dengan format .csv");
        }
      }
    });
  }

  // 6. UPLOAD BUKTI (Link & File)
  window.addLinkUnit = function () {
    const url = document.getElementById("linkUnit").value;
    if (url) {
      addToPreview("🔗 " + url);
      document.getElementById("linkUnit").value = "";
    }
  };

  const uploadAreaUnit = document.getElementById("uploadAreaUnit");
  const fileInputUnit = document.getElementById("fileBuktiUnit");
  const previewContainerUnit = document.getElementById("previewContainerUnit");
  const btnAddLinkUnit = document.getElementById("btnAddLinkUnit");
  const linkInputUnit = document.getElementById("linkBuktiUnit");
  const emptyTextUnit = document.getElementById("emptyTextUnit");

  function checkUnitEmptyState() {
    const items = previewContainerUnit.querySelectorAll(".file-item");
    if (items.length > 0) {
      if (emptyTextUnit) emptyTextUnit.style.display = "none";
    } else {
      if (emptyTextUnit) emptyTextUnit.style.display = "block";
    }
  }

  // Handle File Upload (Drag & Drop + Click)
  if (uploadAreaUnit && fileInputUnit) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
      uploadAreaUnit.addEventListener(
        evt,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });

    ["dragenter", "dragover"].forEach((evt) => {
      uploadAreaUnit.addEventListener(
        evt,
        () => uploadAreaUnit.classList.add("dragover"),
        false
      );
    });

    ["dragleave", "drop"].forEach((evt) => {
      uploadAreaUnit.addEventListener(
        evt,
        () => uploadAreaUnit.classList.remove("dragover"),
        false
      );
    });

    uploadAreaUnit.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      fileInputUnit.files = files;
      addFileToUnitPreview(files[0]);
    });

    fileInputUnit.addEventListener("change", function () {
      if (this.files.length > 0) addFileToUnitPreview(this.files[0]);
    });
  }

  function addFileToUnitPreview(file) {
    if (!file) return;
    const iconDoc = `<svg style="color:#64748b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    const itemHtml = document.createElement("div");
    itemHtml.className = "file-item";
    itemHtml.innerHTML = `
            <div class="file-item-content">
                ${iconDoc}
                <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListUnitEmpty();">×</button>
        `;
    previewContainerUnit.appendChild(itemHtml);
    checkUnitEmptyState();
  }

  // Handle Link Add via Button Click
  if (btnAddLinkUnit && linkInputUnit) {
    btnAddLinkUnit.addEventListener("click", function () {
      const url = linkInputUnit.value.trim();
      if (!url) {
        alert("Mohon masukkan link terlebih dahulu.");
        return;
      }
      const iconLink = `<svg style="color:#6366f1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
      const itemHtml = document.createElement("div");
      itemHtml.className = "file-item";
      itemHtml.innerHTML = `
                <div class="file-item-content">
                    ${iconLink}
                    <span title="${url}">Link: ${url}</span>
                </div>
                <button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkListUnitEmpty();">×</button>
            `;
      previewContainerUnit.appendChild(itemHtml);
      checkUnitEmptyState();
      linkInputUnit.value = "";
    });
  }

  window.addToPreview = function (text) {
    // Helper function if needed by other parts, though specific file/link handlers above are better
    // Biarkan kosong atau sesuaikan jika masih dipakai
  };

  window.checkListUnitEmpty = function () {
    setTimeout(checkUnitEmptyState, 50);
  };

  // 7. SUBMIT
  const form = document.getElementById("formUnit");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Laporan Kegiatan Unit Berhasil Dikirim!");
      window.location.href = "unit-dashboard.html";
    });
  }
});
