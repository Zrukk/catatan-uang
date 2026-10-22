# 💰 Catatan Uang

Aplikasi pencatat keuangan sederhana — multi dompet, multi kurensi, dengan uang jajan & tabungan.

## ✨ Fitur
- 💼 Multi dompet (Cash, e-wallet, bank, dll)
- 🌍 Multi kurensi (IDR, USD, EUR, SGD, MYR, GBP, JPY)
- 🍪 Uang jajan & 🏦 Tabungan dengan kurensi sendiri
- ➕ Catat pemasukan & pengeluaran per dompet
- 🔍 Filter berdasarkan tipe, dompet, dan kategori
- 💾 Auto-save ke `localStorage`
- 📱 Responsif untuk HP & desktop

## 🚀 Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal: `catatan-uang`)
2. Upload semua file di repo ini
3. Buka **Settings → Pages**
4. Di **Source**, pilih `Deploy from a branch` → branch `main` → folder `/ (root)`
5. Klik **Save**, tunggu 1-2 menit
6. Akses di: `https://Zrukk.github.io/catatan-uang/`

## 📁 Struktur

| File | Fungsi |
|------|--------|
| `index.html` | Struktur halaman |
| `css/style.css` | Semua styling |
| `js/config.js` | Kurensi & kategori |
| `js/utils.js` | Fungsi utilitas (format, escape) |
| `js/state.js` | State global + localStorage |
| `js/wallets.js` | CRUD dompet |
| `js/pots.js` | Uang jajan & tabungan |
| `js/transactions.js` | CRUD transaksi |
| `js/render.js` | Render semua UI |
| `js/app.js` | Init + event listener |

## 💡 Tips Edit

- **Ganti kurensi / kurs** → edit `js/config.js`
- **Tambah kategori** → edit `CATEGORY_EMOJI` di `js/config.js` + tambah `<option>` di `index.html`
- **Ubah warna tema** → cari `#667eea` & `#764ba2` di `css/style.css`
- **Tambah field transaksi** → edit `submitTransaction()` di `js/transactions.js` + `renderTransactionList()` di `js/render.js`

## ⚠️ Catatan
Data disimpan di **browser masing-masing** (localStorage), bukan server. Jangan hapus data browser atau data akan hilang. Untuk backup, gunakan fitur export (bisa ditambahkan nanti).

## 📄 Lisensi
MIT — bebas dipakai dan dimodifikasi.
