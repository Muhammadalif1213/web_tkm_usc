/* =========================================
   LOGIKA RIWAYAT (Tabs, Filter, Pagination, Stats)
   ========================================= */

const ITEMS_PER_PAGE = 10;
const TARGET_POIN = 100;
const TARGET_WAJIB = 10; // Target jumlah kegiatan wajib

// --- DATA DUMMY ---
const dataNilai = [
  { kategori: "Seminar", nama: "Workshop UI/UX", jenis: "Pilihan", poin: 50 },
  {
    kategori: "Kompetisi",
    nama: "Lomba Fotografi",
    jenis: "Pilihan",
    poin: 15,
  },
  { kategori: "Organisasi", nama: "Panitia Ospek", jenis: "Wajib", poin: 12 },
  { kategori: "Seminar", nama: "Kuliah Umum", jenis: "Wajib", poin: 5 },
  { kategori: "Organisasi", nama: "Bendahara Kelas", jenis: "Wajib", poin: 8 },
  {
    kategori: "Seminar",
    nama: "Webinar Cyber Security",
    jenis: "Pilihan",
    poin: 4,
  },
];

const dataStatus = [
  {
    tgl: "20 Nov 2024",
    nama: "Workshop Machine Learning",
    kategori: "Seminar",
    status: "Tidak Valid",
    ket: "Bukti tidak lengkap",
  },
  {
    tgl: "18 Nov 2024",
    nama: "Ketua BEM Fakultas",
    kategori: "Organisasi",
    status: "Menunggu Validasi",
    ket: "-",
  },
  {
    tgl: "15 Nov 2024",
    nama: "Lomba Essay Nasional",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
  {
    tgl: "11 Nov 2024",
    nama: "Lomba Healthkaton",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
  {
    tgl: "15 Nov 2024",
    nama: "Lomba Essay Nasional",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
  {
    tgl: "11 Nov 2024",
    nama: "Lomba Healthkaton",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
  {
    tgl: "15 Nov 2024",
    nama: "Lomba Essay Nasional",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
  {
    tgl: "11 Nov 2024",
    nama: "Lomba Healthkaton",
    kategori: "Kompetisi",
    status: "Valid",
    ket: "-",
  },
];

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

// --- 1. FUNGSI HITUNG STATISTIK (BARU) ---
function updateStatistics() {
  // A. Hitung Poin Kegiatan (Positif)
  let totalPoinKegiatan = 0;
  let jumlahWajib = 0;

  dataNilai.forEach((item) => {
    totalPoinKegiatan += item.poin;
    if (item.jenis === "Wajib") jumlahWajib++;
  });

  // B. Hitung Poin Pelanggaran (Negatif)
  let totalPoinSanksi = 0;
  dataPelanggaran.forEach((item) => {
    totalPoinSanksi += item.sanksi; // sanksi bernilai negatif (misal -20)
  });

  // C. Poin Akhir = Kegiatan + Sanksi (Karena sanksi minus, jadi otomatis berkurang)
  const poinAkhir = totalPoinKegiatan + totalPoinSanksi;

  // D. Update UI Tab Nilai
  document.getElementById("stat-total-poin").innerText = poinAkhir;
  document.getElementById("stat-total-kegiatan").innerText = dataNilai.length;

  const sisaWajib = TARGET_WAJIB - jumlahWajib;
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

  // E. Update UI Tab Pelanggaran
  document.getElementById("stat-total-pelanggaran").innerText =
    dataPelanggaran.length;
  document.getElementById("stat-poin-minus").innerText = totalPoinSanksi; // Akan tampil misal "-50"
}

// --- 2. TABS ---
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

// --- 3. RENDER HELPER ---
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

// --- 4. RENDER SPECIFIC TABLES ---
function renderNilai() {
  const kat = document.getElementById("filterKategoriNilai").value;
  const jen = document.getElementById("filterJenisNilai").value;
  const filtered = dataNilai.filter(
    (item) =>
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

function renderStatus() {
  const kat = document.getElementById("filterKategoriStatus").value;
  const stat = document.getElementById("filterStatusLaporan").value;

  const filtered = dataStatus.filter(
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
      // 1. LOGIKA WARNA BADGE
      let badgeClass = "";
      if (item.status === "Valid") badgeClass = "bg-success";
      else if (item.status === "Menunggu Validasi") badgeClass = "bg-warning";
      else badgeClass = "bg-danger";

      // 2. LOGIKA TOMBOL AKSI (Sesuai Permintaan)
      let actionButtons = "";

      if (item.status === "Valid") {
        // Jika Valid -> Hilangkan Icon (Tampilkan strip saja)
        actionButtons = '<span style="color:#ccc;">-</span>';
      } else if (item.status === "Menunggu Validasi") {
        // Jika Menunggu -> Hanya Icon Delete
        actionButtons = `
                <button class="action-btn" title="Batalkan Laporan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
      } else if (item.status === "Tidak Valid") {
        // Jika Tidak Valid -> Icon Edit (Pensil) & Delete (Sampah)
        actionButtons = `
                <button class="action-btn" title="Perbaiki Laporan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn" title="Hapus Laporan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
            <td class="text-center">
                ${actionButtons}
            </td>
        </tr>`;
    }
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

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  updateStatistics(); // Hitung dulu sebelum render
  renderNilai();
});
