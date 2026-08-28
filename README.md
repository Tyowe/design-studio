# AI Design Studio

Web portfolio + pemesanan untuk jasa desain logo, kemasan, poster/sosial media.

---

## Struktur Folder

```
D:\Hermes Agent\AI Design Studio\
├── index.html          # Halaman utama (portofolio + form order)
├── styles.css          # Tampilan
├── scripts.js          # Interaksi & form handler
├── assets\
│   ├── images\         # Tempat gambar portfolio (PWM: .jpg, .png)
│   └── orders\         # Cadangan penyimpanan order (opsional)
└── README.md           # File ini
```

---

## Cara Pakai (Lokal)

### 1. Lihat website di browser

Bisa dibuka langsung dengan double-click `index.html`, atau pakai server kecil:

```bash
cd "D:/Hermes Agent/AI Design Studio"
python -m http.server 8000
```

Lanjut ke http://localhost:8000

### 2. Tambah karya portfolio

1. Simpan gambar karya ke `assets/images/` (nama: `sample-1.jpg`, `sample-2.jpg`, dst.)
2. Edit `scripts.js` bagian `portfolioItems` — ganti `src` dengan nama file aslimu.
3. Reload halaman.

### 3. Lihat order yang masuk (dashboard lokal)

Buka di browser dengan tambahin `?admin` di akhir URL:

```
http://localhost:8000/?admin
```

Order yang masuk akan muncul di sana (tersimpan di browser localStorage, **hanya di komputer ini**).

---

## Cara Deploy ke Netlify (Live Website)

### Cara 1: Drag & Drop (paling simpel)

1. Buka https://app.netlify.com
2. Login (atau buat akun baru — gratis)
3. Masuk ke **Sites** → klik **"Add new site"** → **"Deploy manually"**
4. Drag folder `D:\Hermes Agent\AI Design Studio` ke area upload
5. Tunggu upload selesai → website live!

Netlify akan kasih URL acak, contoh: `https://tuan-buty-12345.netlify.app`

### Cara 2: Connect GitHub (kalau mau version control)

1. Push folder Ini ke GitHub repo
2. Di Netlify: **Add new site** → **Import an existing project** → pilih repo GitHub kamu
3. Netlify auto-deploy setiap ada push ke repo

---

## Order Management

### Opsi A: Netlify Forms (bawaan Netlify)

Form di `index.html` sudah setup untuk Netlify:

```html
<form name="orderForm" method="POST" data-netlify="true" ...>
```

Setelah deploy ke Netlify, order akan masuk ke **Netlify Dashboard → Forms**. Kamu bisa liat, export, atau dapat notifikasi email.

**Setup notifikasi email:**
1. Di Netlify Dashboard site kamu → **Site settings** → **Forms**
2. Aktifkan **"Form notifications"** → pilih **Email notification**
3. Masukkan email kamu → setiap order baru dikirim ke email kamu.

### Opsi B: Airtable Integration (kalau mau database online)

Kalau kamu ingin order masuk ke Airtable (ada dashboard, bisa filter, dll):

1. Buat akun di https://airtable.com (gratis)
2. Buat **Base** baru → tabel `Orders`
3. Tambah kolom sesuai form: Name, Email, WhatsApp, Service, Budget, Deadline, Message, CreatedAt
4. Dapatkan **API Key** (Account → Developer → API Key)
5. Dapatkan **Base ID** (dari URL: `https://airtable.com/{baseID}/...`)

**Setup di scripts.js:**
- Cari bagian `OPTION 2: Airtable API` di `scripts.js`
- Masukkan `AIRTABLE_API_KEY` dan `AIRTABLE_BASE_ID`
- Tulis nama table: `Orders`

Contoh endpoint Airtable REST API:
```
POST https://api.airtable.com/v0/{baseId}/Orders
Headers: Authorization: Bearer {apiKey}
Content-Type: application/json
Body: {
  "records": [{
    "fields": {
      "Name": "Budi Susanto",
      "Email": "budi@email.com",
      "WhatsApp": "08123456789",
      "Service": "Desain Logo",
      "Budget": "Rp 200.000 - Rp 500.000",
      "Deadline": "2026-09-15",
      "Message": "Mau logo seperti ini...",
      "CreatedAt": "2026-08-28T10:00:00Z"
    }
  }]
}
```

⚠️ **PENTING:** Jangan pernah simpan API key di client-side (JavaScript di browser). Kalau pakai Airtable API, harus pakai **Netlify Functions** (serverless) sebagai proxy. Biar aman.

Kalau kamu mau, saya bisa bantu buatkan Netlify Function-nya.

---

## Customisasi

- **Warna tema:** lihat `styles.css`, bagian `:root` — ganti `--accent` kalau mau warna lain.
- **Font:** default pakai Inter (Google Font). Tambah link di `index.html` kalau mau font lain.
- **Harga:** edit tulisan `service-price` di `index.html`.

---

## Layanan

1. 🎨 Desain Logo — mulai Rp 350.000
2. 📦 Desain Kemasan — mulai Rp 500.000
3. 🖼️ Desain Poster / Sosial Media — mulai Rp 150.000
4. 🌐 Paket Lengkap — mulai Rp 1.200.000

---

## Butuh Bantuan?

Kalau ada yang error atau mau ditambah fitur, ceritain saja. Saya bantu perbaiki.
