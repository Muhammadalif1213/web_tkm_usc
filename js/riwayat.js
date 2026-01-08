/* =========================================
   LOGIKA RIWAYAT (CRUD LENGKAP)
   ========================================= */

const ITEMS_PER_PAGE = 10;
const TARGET_POIN = 100;
const TARGET_WAJIB = 10;

// --- 1. DATA & INITIALIZATION ---
const defaultData = [
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

// Load Data
let storedData = localStorage.getItem("riwayatData");
let dataKegiatan = storedData ? JSON.parse(storedData) : defaultData;

const dataPelanggaran = [
  {
    tgl: "15 Nov 2024",
    kategori: "Akademik",
    nama: "Terlambat Mengumpulkan Tugas",
    pelapor: "Dr. Ahmad Fauzi",
    sanksi: -20,
  },
  {
    tgl: "10 Nov 2024",
    kategori: "Kehadiran",
    nama: "Tidak Hadir Tanpa Keterangan",
    pelapor: "Dr. Ahmad Fauzi",
    sanksi: -15,
  },
];

let currentPage = { nilai: 1, status: 1, pelanggaran: 1 };

document.addEventListener("DOMContentLoaded", () => {
  // Cek tab aktif dari localStorage
  const activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    switchTab(activeTab);
    localStorage.removeItem("activeTab");
  } else {
    switchTab("nilai");
  }
  updateStatistics();
});

// --- 2. FUNGSI CRUD (DELETE & EDIT) ---

// A. DELETE DATA
window.deleteData = function (originalIndex) {
  if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
    // Hapus data berdasarkan index asli di array dataKegiatan
    dataKegiatan.splice(originalIndex, 1);

    // Simpan ke LocalStorage
    localStorage.setItem("riwayatData", JSON.stringify(dataKegiatan));

    // Update Tampilan
    renderStatus();
    renderNilai(); // Update juga tabel nilai jika ada perubahan
    updateStatistics();
  }
};

// B. OPEN EDIT MODAL
// --- B. EDIT DATA (REDIRECT KE FORM) ---
window.openEditModal = function (originalIndex) {
  // 1. Simpan index data yang mau diedit ke LocalStorage
  localStorage.setItem("editIndex", originalIndex);

  // 2. Arahkan pengguna ke halaman Lapor Pribadi
  // (Asumsi: kita menggunakan form pribadi untuk edit standar)
  window.location.href = "lapor-kegiatan.html";
};

// --- 3. RENDER LOGIC ---

function renderStatus() {
  const kat = document.getElementById("filterKategoriStatus").value;
  const stat = document.getElementById("filterStatusLaporan").value;

  // Kita filter tapi tetap mengirim Index ASLI agar fungsi Delete/Edit akurat
  const filtered = dataKegiatan
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(
      (item) =>
        (kat === "" || item.kategori === kat) &&
        (stat === "" || item.status === stat)
    );

  renderTable(
    filtered,
    "tbody-status",
    "pagination-status",
    "status",
    (item) => {
      let badgeClass = "";
      let actionButtons = "";

      // Badge Color
      if (item.status === "Valid") badgeClass = "bg-success";
      else if (item.status === "Menunggu Validasi") badgeClass = "bg-warning";
      else badgeClass = "bg-danger";

      // Action Buttons Logic
      if (item.status === "Valid") {
        actionButtons = '<span style="color:#ccc;">-</span>';
      } else if (item.status === "Menunggu Validasi") {
        // Hanya Delete
        actionButtons = `
                <button class="action-btn" onclick="deleteData(${item.originalIndex})" title="Batalkan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
      } else {
        // Tidak Valid
        // Edit & Delete
        actionButtons = `
                <button class="action-btn" onclick="openEditModal(${item.originalIndex})" title="Perbaiki">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn" onclick="deleteData(${item.originalIndex})" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
      }

      return `
        <tr>
            <td>${item.tgl}</td>
            <td>${item.nama}</td>
            <td>${item.kategori}</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td>${item.ket}</td>
            <td class="text-center" style="display:flex; justify-content:center; gap:5px;">${actionButtons}</td>
        </tr>`;
    }
  );
}

function renderNilai() {
  const kat = document.getElementById("filterKategoriNilai").value;
  const jen = document.getElementById("filterJenisNilai").value;

  const filtered = dataKegiatan.filter(
    (item) =>
      item.status === "Valid" &&
      (kat === "" || item.kategori === kat) &&
      (jen === "" || item.jenis === jen)
  );

  renderTable(
    filtered,
    "tbody-nilai",
    "pagination-nilai",
    "nilai",
    (item) => `
        <tr>
            <td>${item.kategori}</td>
            <td>${item.nama}</td>
            <td>${item.jenis}</td>
            <td class="text-right">${item.poin}</td>
        </tr>
    `
  );
}

function renderPelanggaran() {
  const kat = document.getElementById("filterKategoriPelanggaran").value;
  const filtered = dataPelanggaran.filter(
    (item) => kat === "" || item.kategori === kat
  );

  renderTable(
    filtered,
    "tbody-pelanggaran",
    "pagination-pelanggaran",
    "pelanggaran",
    (item) => `
        <tr>
            <td>${item.tgl}</td>
            <td>${item.kategori}</td>
            <td>${item.nama}</td>
            <td>${item.pelapor}</td>
            <td class="text-right text-danger">${item.sanksi}</td>
        </tr>
    `
  );
}

// --- 4. RENDER HELPER & STATS ---
function updateStatistics() {
  let totalPoinKegiatan = 0;
  let jumlahWajibValid = 0;
  let totalKegiatanValid = 0;

  dataKegiatan.forEach((item) => {
    if (item.status === "Valid") {
      totalPoinKegiatan += parseInt(item.poin || 0);
      totalKegiatanValid++;
      if (item.jenis === "Wajib") jumlahWajibValid++;
    }
  });

  let totalPoinSanksi = 0;
  dataPelanggaran.forEach((item) => {
    totalPoinSanksi += item.sanksi;
  });

  document.getElementById("stat-total-poin").innerText =
    totalPoinKegiatan + totalPoinSanksi;
  document.getElementById("stat-total-kegiatan").innerText = totalKegiatanValid;

  const sisaWajib = TARGET_WAJIB - jumlahWajibValid;
  document.getElementById("stat-sisa-wajib").innerText =
    sisaWajib > 0 ? sisaWajib : 0;

  const statusEl = document.getElementById("stat-status-lulus");
  if (totalPoinKegiatan + totalPoinSanksi >= TARGET_POIN) {
    statusEl.innerText = "Tercapai";
    statusEl.style.color = "green";
  } else {
    statusEl.innerText = "Belum Tercapai";
    statusEl.style.color = "#555";
  }

  document.getElementById("stat-total-pelanggaran").innerText =
    dataPelanggaran.length;
  document.getElementById("stat-poin-minus").innerText = totalPoinSanksi;
}

function renderTable(data, tbodyId, paginationId, pageKey, rowRenderer) {
  const tbody = document.getElementById(tbodyId);
  const pagination = document.getElementById(paginationId);
  tbody.innerHTML = "";
  pagination.innerHTML = "";

  const start = (currentPage[pageKey] - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const items = data.slice(start, end);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px;">Data tidak ditemukan</td></tr>`;
    return;
  }

  items.forEach((item) =>
    tbody.insertAdjacentHTML("beforeend", rowRenderer(item))
  );

  if (totalPages > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn prev-next";
    prevBtn.innerHTML = "←";
    prevBtn.disabled = currentPage[pageKey] === 1;
    prevBtn.onclick = () => {
      currentPage[pageKey]--;
      refreshTab(pageKey);
    };
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${currentPage[pageKey] === i ? "active" : ""}`;
      btn.innerText = i;
      btn.onclick = () => {
        currentPage[pageKey] = i;
        refreshTab(pageKey);
      };
      pagination.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn prev-next";
    nextBtn.innerHTML = "→";
    nextBtn.disabled = currentPage[pageKey] === totalPages;
    nextBtn.onclick = () => {
      currentPage[pageKey]++;
      refreshTab(pageKey);
    };
    pagination.appendChild(nextBtn);
  }
}

function refreshTab(key) {
  if (key === "nilai") renderNilai();
  if (key === "status") renderStatus();
  if (key === "pelanggaran") renderPelanggaran();
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-view")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((el) => el.classList.remove("active"));

  const target = document.getElementById(`view-${tabId}`);
  if (target) target.style.display = "block";

  const btns = document.querySelectorAll(".tab-btn");
  for (let btn of btns) {
    if (btn.getAttribute("onclick").includes(tabId)) {
      btn.classList.add("active");
      break;
    }
  }

  if (tabId === "nilai") renderNilai();
  if (tabId === "status") renderStatus();
  if (tabId === "pelanggaran") renderPelanggaran();
}
