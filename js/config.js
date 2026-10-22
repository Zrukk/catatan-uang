/* ============================================
   KONFIGURASI GLOBAL
   Edit file ini untuk mengubah kurensi & kategori.
============================================ */

const STORAGE_KEY = 'catatan_uang_v2';
const OLD_KEY = 'catatan_uang_v1'; // untuk migrasi dari versi v1

const CURRENCIES = {
  IDR: { symbol: 'Rp', rate: 1 },
  USD: { symbol: '$',  rate: 15000 },
  EUR: { symbol: '€',  rate: 16000 },
  SGD: { symbol: 'S$', rate: 11000 },
  MYR: { symbol: 'RM', rate: 3500 },
  GBP: { symbol: '£',  rate: 19000 },
  JPY: { symbol: '¥',  rate: 100 }
};

const CATEGORY_EMOJI = {
  'Makanan': '🍔', 'Transportasi': '🚗', 'Belanja': '🛍️',
  'Tagihan': '📄', 'Hiburan': '🎮', 'Kesehatan': '💊',
  'Gaji': '💼', 'Bonus': '🎁', 'Lainnya': '📦'
};
