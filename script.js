// Mengambil data dari localStorage jika sudah ada, atau buat array kosong jika belum ada
let dataSetoran = JSON.parse(localStorage.getItem('trashTrackData')) || [];

const trashForm = document.getElementById('trashForm');
const leaderboardBody = document.getElementById('leaderboardBody');
const resetBtn = document.getElementById('resetBtn');

// Fungsi untuk menampilkan data ke tabel peringkat
function renderLeaderboard() {
    // Urutkan data dari poin terbesar ke terkecil
    dataSetoran.sort((a, b) => b.poin - a.poin);

    leaderboardBody.innerHTML = '';

    if (dataSetoran.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data setoran sampah.</td></tr>';
        return;
    }

    dataSetoran.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${index + 1}</strong></td>
            <td>${item.nama}</td>
            <td>${item.berat.toFixed(1)} kg</td>
            <td><strong style="color: #2e7d32;">${item.poin} Poin</strong></td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Event saat tombol "Setor & Hitung Poin" ditekan
trashForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman refresh otomatis

    const namaInput = document.getElementById('nama').value.trim();
    const nilaiPoinPerKg = parseInt(document.getElementById('jenis').value);
    const beratInput = parseFloat(document.getElementById('berat').value);

    // Hitung poin yang didapat pada setoran kali ini
    const poinDidapat = Math.round(nilaiPoinPerKg * beratInput);

    // Cek apakah nama siswa sudah pernah menyetor sebelumnya
    const siswaAda = dataSetoran.find(item => item.nama.toLowerCase() === namaInput.toLowerCase());

    if (siswaAda) {
        siswaAda.berat += beratInput;
        siswaAda.poin += poinDidapat;
    } else {
        dataSetoran.push({
            nama: namaInput,
            berat: beratInput,
            poin: poinDidapat
        });
    }

    // Simpan pembaruan data ke localStorage
    localStorage.setItem('trashTrackData', JSON.stringify(dataSetoran));

    // Perbarui tampilan tabel dan kosongkan form
    renderLeaderboard();
    trashForm.reset();
    alert(`Berhasil! ${namaInput} mendapatkan +${poinDidapat} Poin.`);
});

// Event untuk menghapus semua data (untuk keperluan simulasi/reset)
resetBtn.addEventListener('click', function() {
    if (confirm('Yakin ingin menghapus seluruh data papan peringkat?')) {
        dataSetoran = [];
        localStorage.removeItem('trashTrackData');
        renderLeaderboard();
    }
});

// Tampilkan data saat halaman pertama kali dibuka
renderLeaderboard();
