# 🎬 Film Recommendation Backend API

Backend ini adalah REST API untuk sistem rekomendasi film berbasis sinopsis menggunakan Node.js, Express.js, dan Supabase. API ini menangani autentikasi user (register, login, profile) menggunakan JWT Authentication.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL Database)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- Joi (Validation)
- ESLint (Code Linting)
- Prettier (Code Formatter)

---

## 📁 Project Structure
config/
controllers/
middleware/
routes/
utils/
validation/
server.js

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/faiztzy/film-backend.git
cd film-backend
npm install

Setup Environment Variables

Buat file .env.example di root project:

PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

JWT_SECRET=your_secret_key


Run Server

npm run dev

