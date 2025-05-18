# Tenangin Backend

Backend API untuk aplikasi Tenangin yang menyediakan fitur autentikasi, profil pengguna, asesmen kesehatan mental, jurnal harian, dan integrasi Google OAuth.

## Teknologi

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT untuk autentikasi
- Passport untuk Google OAuth
- Netlify Functions (opsional untuk deploy serverless)

## Instalasi

1. Clone repository ini
2. Jalankan `npm install` untuk menginstal dependensi
3. Buat file `.env` dan isi variabel lingkungan yang diperlukan (contoh: PORT, Supabase URL dan Key, JWT secret, dsb)
4. Jalankan server dengan perintah:
   ```
   npm run serve
   ```

## Struktur Endpoint API

Base URL: `https://tenangin-backend-skrulleps-skrulleps-projects.vercel.app/api`

### Autentikasia

- `POST /auth/register`  
  Registrasi user baru dengan email dan password.

- `POST /auth/login`  
  Login user dan menerima JWT token.

- `GET /auth/google`  
  Login menggunakan Google OAuth.

### Profiles

- `GET /profile`  
  Mendapatkan data profil user yang sudah terautentikasi.

- `POST /profile/add`  
  Membuat profil user.

- `PUT /profile/edit`  
  Mengupdate data profil user.

### Asesmen

- `GET /assesment`  
  Mendapatkan riwayat asesmen user.

- `POST /assesment`  
  Membuat data asesmen baru.

### Jurnal

- `GET /journal`  
  Mendapatkan semua entri jurnal user.

- `POST /journal/add`  
  Membuat entri jurnal baru.

## Dokumentasi API

Dokumentasi lengkap tersedia di: `http://localhost:3000/docs`

## Deploy ke Netlify

Untuk deploy ke Netlify, Anda dapat menggunakan Netlify CLI:

1. Install Netlify CLI secara global:
   ```
   npm install -g netlify-cli
   ```

2. Tambahkan script deploy di `package.json`:
   ```json
   "scripts": {
     "netlify-deploy": "netlify deploy --prod"
   }
   ```

3. Jalankan deploy:
   ```
   npm run netlify-deploy
   ```

## Testing

- Gunakan Postman collection yang tersedia di folder `test/` untuk menguji endpoint.
- Pastikan environment variabel sudah diatur dengan benar.
- Pengujian meliputi happy path dan error handling.

## Catatan

- Pastikan Supabase Row Level Security (RLS) sudah dikonfigurasi dengan benar untuk akses data yang aman.
- Gunakan HTTPS di lingkungan produksi untuk keamanan data.

---

© 2025 Tenangin Backend
