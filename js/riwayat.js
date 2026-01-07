/* =========================================
   LOGIKA RIWAYAT (Integrated Data)
   ========================================= */

const ITEMS_PER_PAGE = 8;
const TARGET_POIN = 100;
const TARGET_WAJIB = 10;

// --- 1. DATA TUNGGAL (SINGLE SOURCE OF TRUTH) ---
// Menggabungkan Data Nilai & Status menjadi satu array master
const dataKegiatan = [
  // Data VALID (Akan muncul di Tab Nilai & Tab Status)
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

  // Data BELUM VALID / DITOLAK (Hanya muncul di Tab Status)
  {
    tgl: "20 Nov 2024",
    nama: "Workshop Machine Learning",
    kategori: "Seminar",
    jenis: "Pilihan",
    poin: 10,
    status: "Tidak Valid",
    ket: "Bukti buram/tidak terbaca",
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
  {
    tgl: "19 Nov 2024",
    nama: "Anggota Himpunan",
    kategori: "Organisasi",
    jenis: "Wajib",
    poin: 10,
    status: "Menunggu Validasi",
    ket: "-",
  },
  {
    tgl: "25 Okt 2024",
    nama: "Lomba Fotografi",
    kategori: "Kompetisi",
    jenis: "Pilihan",
    poin: 15,
    status: "Tidak Valid",
    ket: "Sertifikat kadaluarsa",
  },
];

// Data Pelanggaran tetap terpisah karena strukturnya beda
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
  {
    tgl: "01 Okt 2024",
    kategori: "Tata Tertib",
    nama: "Merokok di Area Kampus",
    pelapor: "Satpam",
    sanksi: -15,
  },
];

let currentPage = { nilai: 1, status: 1, pelanggaran: 1 };

// --- 2. FUNGSI HITUNG STATISTIK ---
function updateStatistics() {
  let totalPoinKegiatan = 0;
  let jumlahWajibValid = 0;
  let totalKegiatanValid = 0;

  // A. Hitung hanya dari data yang VALID
  dataKegiatan.forEach((item) => {
    if (item.status === "Valid") {
      totalPoinKegiatan += item.poin;
      totalKegiatanValid++;
      if (item.jenis === "Wajib") jumlahWajibValid++;
    }
  });

  // B. Hitung Poin Pelanggaran
  let totalPoinSanksi = 0;
  dataPelanggaran.forEach((item) => {
    totalPoinSanksi += item.sanksi;
  });

  // C. Poin Akhir
  const poinAkhir = totalPoinKegiatan + totalPoinSanksi;

  // D. Update UI
  document.getElementById("stat-total-poin").innerText = poinAkhir;
  document.getElementById("stat-total-kegiatan").innerText = totalKegiatanValid; // Hanya hitung yg valid

  const sisaWajib = TARGET_WAJIB - jumlahWajibValid;
  document.getElementById("stat-sisa-wajib").innerText =
    sisaWajib > 0 ? sisaWajib : 0;

  const statusEl = document.getElementById("stat-status-lulus");
  if (poinAkhir >= TARGET_POIN) {
    statusEl.innerText = "Tercapai";
    statusEl.style.color = "green";
    statusEl.style.fontWeight = "bold";
  } else {
    statusEl.innerText = "Belum Tercapai";
    statusEl.style.color = "#555";
  }

  // E. Update Pelanggaran Stats
  document.getElementById("stat-total-pelanggaran").innerText =
    dataPelanggaran.length;
  document.getElementById("stat-poin-minus").innerText = totalPoinSanksi;
}

// --- 3. TABS SWITCHER ---
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-view")
    .forEach((el) => (el.style.display = "none"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(`view-${tabId}`).style.display = "block";

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

// --- 4. RENDER HELPER ---
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

  // Pagination Controls
  if (totalPages > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn prev-next";
    prevBtn.innerHTML = "← Sebelumnya";
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
    nextBtn.innerHTML = "Selanjutnya →";
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

// --- 5. RENDER SPESIFIK (LOGIKA UPDATE) ---

// A. RENDER NILAI (Hanya yang VALID)
function renderNilai() {
  const kat = document.getElementById("filterKategoriNilai").value;
  const jen = document.getElementById("filterJenisNilai").value;

  // Filter Logic: Kategori + Jenis + STATUS HARUS VALID
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

// B. RENDER STATUS (Semua Data: Valid, Menunggu, Tidak Valid)
function renderStatus() {
  const kat = document.getElementById("filterKategoriStatus").value;
  const stat = document.getElementById("filterStatusLaporan").value;

  const filtered = dataKegiatan.filter(
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

      // Tentukan Badge & Tombol Aksi
      if (item.status === "Valid") {
        badgeClass = "bg-success";
        actionButtons = '<span style="color:#ccc;">-</span>';
      } else if (item.status === "Menunggu Validasi") {
        badgeClass = "bg-warning";
        actionButtons = `
                <button class="action-btn" title="Batalkan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
      } else {
        // Tidak Valid
        badgeClass = "bg-danger";
        actionButtons = `
                <button class="action-btn" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn" title="Hapus">
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
            <td class="text-center">${actionButtons}</td>
        </tr>`;
    }
  );
}

// C. RENDER PELANGGARAN
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

// Init
document.addEventListener("DOMContentLoaded", () => {
  updateStatistics();
  renderNilai();
});
