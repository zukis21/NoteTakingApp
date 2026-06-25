# 📒 Note Taking Application

## Deskripsi Aplikasi

Note Taking Application adalah aplikasi berbasis web yang digunakan untuk membuat, mengelola, dan membagikan catatan kepada pengguna lain. Aplikasi ini dibangun menggunakan Laravel 12 sebagai backend API dan React TypeScript sebagai frontend.

Aplikasi ini dibuat untuk memenuhi kebutuhan Technical Test IT Programmer dengan menerapkan:

* Autentikasi pengguna (Login)
* Konsep Relational Database Management System (RDBMS)
* Fitur Create, Read, Update, Delete (CRUD)
* Relasi antar data
* Arsitektur aplikasi yang terstruktur

---

## Fitur Utama

### 1. Autentikasi Pengguna

* Login menggunakan email dan password
* Logout pengguna
* Proteksi halaman menggunakan autentikasi

### 2. Manajemen Catatan (CRUD)

* Membuat catatan baru
* Melihat daftar catatan
* Mengubah catatan
* Menghapus catatan

### 3. Berbagi Catatan

* Membagikan catatan kepada pengguna tertentu
* Membuat catatan publik yang dapat diakses pengguna lain

### 4. Komentar

* Memberikan komentar pada catatan yang dibagikan
* Melihat komentar dari pengguna lain

### 5. Relasi Database (RDBMS)

Relasi yang diterapkan pada aplikasi:

* Satu User dapat memiliki banyak Notes
* Satu Note dapat dibagikan ke banyak User
* Satu Note dapat memiliki banyak Comments
* Satu User dapat membuat banyak Comments

---

## Teknologi yang Digunakan

### Backend

* Laravel 12
* PHP 8.3+

### Frontend

* React
* TypeScript
* Vite

### Database

* PostgreSQL

### Authentication

* Laravel Sanctum

### Styling

* Tailwind CSS

### Development Environment

* Docker (Laravel Sail) - Opsional

---

## Struktur Project

```text
app/                # Controller, Service, Repository, Model
bootstrap/          # Bootstrap Laravel
config/             # Konfigurasi aplikasi
database/           # Migration dan Seeder
public/             # Public assets
resources/
├── css/            # CSS dan Tailwind
├── js/             # React TypeScript
└── views/          # Blade View
routes/             # Web dan API Routes
storage/            # Logs dan Cache
tests/              # Unit Test dan Feature Test
vite.config.js      # Konfigurasi Vite
```

---

## Instalasi dan Menjalankan Aplikasi

### Persyaratan Sistem

* PHP 8.3 atau lebih baru
* Composer
* Node.js dan NPM
* PostgreSQL

---

### 1. Clone Project

```bash
git clone https://github.com/zukis21/NoteTakingApp.git

cd NoteTakingApp
```

### 2. Install Dependency

```bash
composer install

npm install
```

### 3. Konfigurasi Environment

Salin file environment:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Konfigurasi database PostgreSQL pada file `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

---

### 4. Jalankan Migration dan Seeder

```bash
php artisan migrate --seed
```

---

### 5. Menjalankan Aplikasi

Jalankan Backend Laravel:

```bash
php artisan serve
```

Jalankan Frontend React:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```text
http://localhost:8000
```

---

## Menjalankan Menggunakan Docker (Laravel Sail)

Apabila Docker tersedia, aplikasi juga dapat dijalankan menggunakan Laravel Sail:

```bash
cp .env.example .env

./vendor/bin/sail up -d

./vendor/bin/sail artisan key:generate

./vendor/bin/sail artisan migrate --seed

./vendor/bin/sail npm install

./vendor/bin/sail npm run dev
```

