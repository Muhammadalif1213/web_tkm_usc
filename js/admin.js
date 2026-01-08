document.addEventListener("DOMContentLoaded", function () {
  renderAdminTable();
});

function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = "";

  // 1. Ambil Data dari LocalStorage
  // (Pastikan key-nya sama dengan yang dipakai di riwayat.js)
  let storedData = localStorage.getItem("riwayatData");

  if (!storedData) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Belum ada data laporan masuk.</td></tr>`;
    return;
  }

  let dataKegiatan = JSON.parse(storedData);

  // 2. Filter hanya yang statusnya "Menunggu Validasi"
  // Kita perlu menyimpan index asli agar saat update data yang diubah benar
  const pendingItems = dataKegiatan
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.status === "Menunggu Validasi");

  if (pendingItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Tidak ada laporan yang perlu divalidasi.</td></tr>`;
    return;
  }

  // 3. Render Tabel
  pendingItems.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${item.tgl}</td>
            <td>
                <strong>Muhammad Alifian Aqilah</strong><br>
                <small style="color:#666">20220140075</small>
            </td>
            <td>
                <strong>${item.nama}</strong><br>
                <small>${item.jenis}</small>
            </td>
            <td><span class="badge" style="background:#e2e8f0; color:#475569">${item.kategori}</span></td>
            <td class="text-center">
                <button class="btn-accept" onclick="validasiLaporan(${item.originalIndex}, 'Valid')">Terima</button>
                <button class="btn-reject" onclick="validasiLaporan(${item.originalIndex}, 'Tolak')">Tolak</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// FUNGSI UTAMA: Update Status ke LocalStorage
window.validasiLaporan = function (index, action) {
  // 1. Ambil data terbaru
  let dataKegiatan = JSON.parse(localStorage.getItem("riwayatData"));

  if (action === "Valid") {
    if (confirm("Terima laporan ini? Poin akan ditambahkan ke mahasiswa.")) {
      // Update Data
      dataKegiatan[index].status = "Valid";
      dataKegiatan[index].ket = "-"; // Reset keterangan

      // Assign Poin (Simulasi logika poin sederhana)
      // Anda bisa buat logika yang lebih kompleks di sini
      let poin = 10;
      if (dataKegiatan[index].jenis === "Wajib") poin = 50;
      if (dataKegiatan[index].jenis === "Pilihan") poin = 25;

      dataKegiatan[index].poin = poin;

      alert("Laporan DITERIMA. Status berubah menjadi Valid.");
    } else {
      return; // Batal
    }
  } else if (action === "Tolak") {
    // Minta alasan penolakan
    const alasan = prompt(
      "Masukkan alasan penolakan:",
      "Bukti tidak lengkap / buram"
    );

    if (alasan) {
      dataKegiatan[index].status = "Tidak Valid";
      dataKegiatan[index].ket = alasan;
      dataKegiatan[index].poin = 0;
      alert("Laporan DITOLAK.");
    } else {
      return; // Batal jika tidak isi alasan
    }
  }

  // 2. Simpan Balik ke LocalStorage
  localStorage.setItem("riwayatData", JSON.stringify(dataKegiatan));

  // 3. Render Ulang Tabel Admin
  renderAdminTable();
};
