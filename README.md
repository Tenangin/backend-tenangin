# Tenangin Backend

Backend API untuk aplikasi Tenangin yang menyediakan fitur autentikasi, profil pengguna, asesmen kesehatan mental, jurnal harian, pengingat, rekomendasi, klinik, dan integrasi chatbot serta Google OAuth.

## Teknologi

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT untuk autentikasi
- Passport untuk Google OAuth
- Bcrypt untuk hashing password
- Google APIs untuk integrasi layanan Google
- Serverless HTTP untuk deploy serverless
- Jest, Mocha, Supertest untuk testing
- Nodemon untuk development

## Fitur

- Autentikasi user dengan email/password dan Google OAuth (Passport dan Supabase)
- Manajemen profil pengguna (buat, lihat, update profil)
- Asesmen kesehatan mental (buat, lihat, hapus asesmen)
- Jurnal harian (buat dan lihat entri jurnal)
- Pengingat (buat dan lihat pengingat)
- Rekomendasi (buat, lihat, hapus rekomendasi)
- Klinik (lihat daftar klinik)
- Chatbot (manajemen sesi dan pesan chatbot)
- Keamanan dengan JWT dan middleware autentikasi

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

### Autentikasi

- `POST /auth/register`  
  Registrasi user baru dengan email dan password.

- `POST /auth/login`  
  Login user dan menerima JWT token.

- `GET /auth/google`  
  Login menggunakan Google OAuth (Passport).

- `GET /login/google`  
  Login menggunakan Google OAuth (Supabase).

- `POST /auth/logout`  
  Logout user.

### Profil

- `POST /profile/add`  
  Membuat profil user.

- `GET /profile/:id`  
  Mendapatkan data profil user berdasarkan ID.

- `PUT /profile/edit/:id`  
  Mengupdate data profil user berdasarkan ID.

### Asesmen

- `POST /assesment/add`  
  Membuat data asesmen baru.

- `GET /assesment`  
  Mendapatkan riwayat asesmen user.

- `DELETE /assesment/:id`  
  Menghapus data asesmen berdasarkan ID.

### Jurnal

- `POST /journal/add`  
  Membuat entri jurnal baru.

- `GET /journal`  
  Mendapatkan semua entri jurnal user.

### Pengingat

- `POST /reminder/add`  
  Membuat pengingat baru.

- `GET /reminder`  
  Mendapatkan daftar pengingat user.

### Rekomendasi

- `POST /recommendation/add`  
  Membuat rekomendasi baru.

- `GET /recommendation`  
  Mendapatkan daftar rekomendasi user.

- `DELETE /recommendation/:id`  
  Menghapus rekomendasi berdasarkan ID.

### Klinik

- `GET /clinics`  
  Mendapatkan daftar klinik.

### Chatbot

- `POST /chatbot/sessions`  
  Membuat sesi chatbot baru.

- `GET /chatbot/sessions/:id`  
  Mendapatkan sesi chatbot berdasarkan user ID.

- `PUT /chatbot/sessions/edit/:id`  
  Mengupdate sesi chatbot berdasarkan user ID.

- `DELETE /chatbot/sessions/:idSession`  
  Menghapus sesi chatbot berdasarkan ID sesi.

- `GET /chatbot/sessions/:sessionId/messages`  
  Mendapatkan pesan chatbot berdasarkan ID sesi.

- `POST /chatbot/sessions/:sessionId/messages`  
  Menambahkan pesan ke sesi chatbot.

## Dokumentasi API

Dokumentasi lengkap tersedia di: `http://localhost:3000/docs`

## Testing

- Gunakan Postman collection yang tersedia di folder `test/` untuk menguji endpoint.  
- Pastikan environment variabel sudah diatur dengan benar.  
- Pengujian meliputi happy path dan error handling.  
- Testing menggunakan Jest, Mocha, dan Supertest.

## Catatan

- Pastikan Supabase Row Level Security (RLS) sudah dikonfigurasi dengan benar untuk akses data yang aman.  
- Gunakan HTTPS di lingkungan produksi untuk keamanan data.  
- Semua endpoint yang membutuhkan autentikasi dilindungi dengan JWT dan middleware autentikasi.

---

© 2025 Tenangin Backend
   npm run serve
