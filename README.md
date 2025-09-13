# 📒 Note Taking App

A simple **Note Taking Web Application** built with **Laravel 12**, **React (TypeScript)**, and **PostgreSQL**.  
This project is designed to demonstrate a modern fullstack architecture using **Laravel API (with Sanctum authentication)** as the backend and **React (TSX with Vite)** as the frontend.

---

## 🚀 Features

-   ✅ User authentication (Laravel Sanctum)
-   ✅ Create, edit, and delete personal notes
-   ✅ Share notes (to specific users or publicly)
-   ✅ Comment system on shared notes
-   ✅ PostgreSQL database integration
-   ✅ Responsive UI with **TailwindCSS**
-   ✅ Built with **SOLID principles** and **Repository Pattern**

---

## 🛠️ Tech Stack

-   **Backend:** Laravel 12 (PHP 8.3+)
-   **Frontend:** React (TSX) + Vite
-   **Database:** PostgreSQL
-   **Authentication:** Laravel Sanctum
-   **Styling:** TailwindCSS
-   **Package Manager:** npm
-   **Container (optional):** Docker

---

## 📂 Project Structure

NoteTaking/
├── app/ # Laravel backend (controllers, models, repositories, etc.)
├── bootstrap/ # Laravel bootstrap files
├── config/ # Laravel configuration
├── database/ # Migrations & seeders
├── public/ # Public assets
├── resources/
│ ├── css/ # TailwindCSS entry file
│ ├── js/ # React (TypeScript) frontend
│ └── views/ # Blade templates
├── routes/ # API & web routes
├── storage/ # Cache, logs, etc.
├── tests/ # PHPUnit tests
├── vite.config.ts # Vite configuration
└── tsconfig.json # TypeScript configuration
