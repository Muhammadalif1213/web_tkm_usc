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

  // --- 4. MANAJEMEN ANGGOTA (SEARCH & TABLE) ---

  // DATA DUMMY MAHASISWA
  const mahasiswaDB = [
    { nim: "20220140078", nama: "Alvien Ridho Nanda Priyastika" },
    { nim: "20220140080", nama: "Budi Santoso" },
    { nim: "20220140085", nama: "Siti Aminah" },
    { nim: "20220140090", nama: "Rahmat Hidayat" },
    { nim: "20220140092", nama: "Dewi Lestari" },
    { nim: "20220140095", nama: "Eko Kurniawan" },
    { nim: "20220140100", nama: "Fajar Nugraha" },
  ];

  const searchInput = document.getElementById("searchMahasiswa");
  const searchResults = document.getElementById("searchResults");
  const selectedHint = document.getElementById("selectedHint");
  const roleSelect = document.getElementById("peranAnggota");
  const anggotaTableBody = document.getElementById("anggotaTableBody");
  const totalAnggotaEl = document.getElementById("totalAnggota");

  // Variable penampung sementara user yg dipilih
  let selectedUser = null;

  // A. Event Listener Input Search
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const val = e.target.value.toLowerCase();
      searchResults.innerHTML = ""; // Reset dropdown

      if (val.length > 0) {
        // Filter DB
        const matches = mahasiswaDB.filter(
          (m) => m.nim.includes(val) || m.nama.toLowerCase().includes(val)
        );

        if (matches.length > 0) {
          searchResults.classList.remove("hidden");
          matches.forEach((m) => {
            const div = document.createElement("div");
            div.className = "search-item";
            div.innerHTML = `<strong>${m.nama}</strong> <span>${m.nim}</span>`;

            // Event saat item dipilih
            div.onclick = function () {
              selectMahasiswa(m);
            };
            searchResults.appendChild(div);
          });
        } else {
          searchResults.innerHTML = `<div class="search-item" style="cursor:default;">Tidak ditemukan</div>`;
          searchResults.classList.remove("hidden");
        }
      } else {
        searchResults.classList.add("hidden");
      }
    });

    // Hide dropdown kalau klik di luar
    document.addEventListener("click", function (e) {
      if (
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)
      ) {
        searchResults.classList.add("hidden");
      }
    });
  }

  // B. Fungsi Select Mahasiswa
  function selectMahasiswa(mahasiswa) {
    selectedUser = mahasiswa;
    searchInput.value = `${mahasiswa.nama} - ${mahasiswa.nim}`; // Tampilkan di input
    searchResults.classList.add("hidden"); // Tutup dropdown
    selectedHint.innerText =
      "Mahasiswa terpilih. Silakan pilih peran dan klik tombol (+).";
    selectedHint.style.color = "green";
  }

  // C. Fungsi Tombol Tambah (+)
  window.tambahAnggota = function () {
    if (!selectedUser) {
      alert("Mohon cari dan pilih mahasiswa terlebih dahulu!");
      return;
    }

    // Cek apakah sudah ada di tabel (Mencegah duplikat)
    const existingRows = anggotaTableBody.querySelectorAll("tr");
    for (let row of existingRows) {
      if (row.cells[0].innerText === selectedUser.nim) {
        alert("Mahasiswa ini sudah ada dalam daftar!");
        return;
      }
    }

    // Ambil Peran
    const peran = roleSelect.options[roleSelect.selectedIndex].text;

    // Buat Baris Baru
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${selectedUser.nim}</td>
            <td>${selectedUser.nama}</td>
            <td>${peran}</td>
            <td class="text-center">
                <button type="button" class="btn-trash" onclick="hapusAnggota(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;

    // Animasi masuk
    tr.style.animation = "fadeIn 0.3s ease";

    anggotaTableBody.appendChild(tr);

    // Reset Input
    searchInput.value = "";
    selectedUser = null;
    selectedHint.innerText =
      "Silakan cari dan pilih mahasiswa terlebih dahulu.";
    selectedHint.style.color = "#666";

    updateTotalAnggota();
  };

  // D. Fungsi Hapus Row
  window.hapusAnggota = function (btn) {
    const row = btn.closest("tr");
    row.remove();
    updateTotalAnggota();
  };

  // E. Update Counter Total
  function updateTotalAnggota() {
    const count = anggotaTableBody.querySelectorAll("tr").length;
    if (totalAnggotaEl) totalAnggotaEl.innerText = count;
  }

  // --- 5. LOGIKA UPLOAD & LINK (DIPERBARUI) ---
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileBukti");
  const uploadText = document.getElementById("uploadText");
  const previewContainer = document.getElementById("previewContainer");
  const btnAddLink = document.getElementById("btnAddLink");
  const linkInput = document.getElementById("linkBukti");
  const emptyText = document.getElementById("emptyText");

  // Fungsi cek list kosong
  function checkEmptyState() {
    const items = previewContainer.querySelectorAll(".file-item");
    if (items.length > 0) {
      if (emptyText) emptyText.style.display = "none";
    } else {
      if (emptyText) emptyText.style.display = "block";
    }
  }

  // A. Handle File Upload (Drag & Drop + Click)
  if (uploadArea && fileInput) {
    // Prevent default browser behavior
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

    // Highlight saat drag
    ["dragenter", "dragover"].forEach((evt) => {
      uploadArea.addEventListener(
        evt,
        () => uploadArea.classList.add("dragover"),
        false
      );
    });

    // Remove highlight saat leave/drop
    ["dragleave", "drop"].forEach((evt) => {
      uploadArea.addEventListener(
        evt,
        () => uploadArea.classList.remove("dragover"),
        false
      );
    });

    // Handle File Drop
    uploadArea.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      fileInput.files = files; // Update input file
      addFileToList(files[0]);
    });

    // Handle File Click Select
    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) addFileToList(this.files[0]);
    });
  }

  // Fungsi Render File ke List
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

  // B. Handle Link Add
  if (btnAddLink && linkInput) {
    btnAddLink.addEventListener("click", function () {
      const url = linkInput.value.trim();
      if (!url) {
        alert("Mohon masukkan link terlebih dahulu.");
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
      linkInput.value = ""; // Reset input
    });
  }

  // Global function untuk cek ulang saat hapus via onclick HTML
  window.checkListEmpty = function () {
    setTimeout(checkEmptyState, 50);
  };

  // --- Logic Tampilan Peran (Lomba vs Organisasi) ---
  // (Pindahkan logic display peran yang lama kesini jika perlu)
  // Di desain baru Anda, dropdown peran selalu tampil, jadi kode ini aman.

  // --- (Fungsi Upload & Tambah Anggota sama seperti sebelumnya) ---
  // Pastikan kode tambahAnggota, handleFileUpload, btnAddLink ada di sini

  // --- 6. SUBMIT ---
  const formKelompok = document.getElementById("formKelompok");
  if (formKelompok) {
    formKelompok.addEventListener("submit", function (e) {
      e.preventDefault();

      // VALIDASI PREVIEW
      const previewContainer = document.getElementById("previewContainer");
      const hasItems =
        previewContainer.querySelectorAll(".file-item").length > 0;
      if (!hasItems) {
        alert("Mohon upload bukti kegiatan.");
        return;
      }

      // --- SIMPAN KE LOCALSTORAGE ---
      const nama = document.getElementById("namaKegiatan").value;
      const kategori = document.getElementById("kategoriKegiatan").value;
      const jenisVal = document.getElementById("jenisKegiatan").value;
      const tglInput = document.getElementById("tanggalMulai").value;

      const dateObj = new Date(tglInput);
      const tglFormatted = dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      let jenisText = "Wajib";
      if (jenisVal === "lomba") jenisText = "Pilihan";

      const newItem = {
        tgl: tglFormatted,
        nama: nama,
        kategori: kategori.charAt(0).toUpperCase() + kategori.slice(1),
        jenis: jenisText,
        poin: 0,
        status: "Menunggu Validasi",
        ket: "-",
      };

      let currentData = JSON.parse(localStorage.getItem("riwayatData"));
      if (!currentData) {
        // Init data dummy jika kosong
        currentData = [
          {
            tgl: "15 Nov 2024",
            nama: "Lomba Essay Nasional",
            kategori: "Kompetisi",
            jenis: "Pilihan",
            poin: 20,
            status: "Valid",
            ket: "-",
          },
          {
            tgl: "11 Nov 2024",
            nama: "Lomba Healthkaton",
            kategori: "Kompetisi",
            jenis: "Pilihan",
            poin: 30,
            status: "Valid",
            ket: "-",
          },
          {
            tgl: "05 Nov 2024",
            nama: "Panitia Ospek",
            kategori: "Organisasi",
            jenis: "Wajib",
            poin: 15,
            status: "Valid",
            ket: "-",
          },
          {
            tgl: "01 Nov 2024",
            nama: "Seminar Nasional AI",
            kategori: "Seminar",
            jenis: "Pilihan",
            poin: 5,
            status: "Valid",
            ket: "-",
          },
          {
            tgl: "20 Nov 2024",
            nama: "Workshop Machine Learning",
            kategori: "Seminar",
            jenis: "Pilihan",
            poin: 10,
            status: "Tidak Valid",
            ket: "Bukti buram",
          },
          {
            tgl: "18 Nov 2024",
            nama: "Ketua BEM Fakultas",
            kategori: "Organisasi",
            jenis: "Wajib",
            poin: 50,
            status: "Menunggu Validasi",
            ket: "-",
          },
        ];
      }

      currentData.unshift(newItem);
      localStorage.setItem("riwayatData", JSON.stringify(currentData));
      localStorage.setItem("activeTab", "status"); // KUNCI: Set tab aktif

      const successModal = document.getElementById("successModal");
      if (successModal) {
        successModal.classList.remove("hidden");
        successModal.style.display = "flex";
      }
    });
  }
});
