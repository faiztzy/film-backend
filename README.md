# 🎬 Film Recommendation Backend API

Backend ini adalah REST API untuk sistem rekomendasi film berbasis sinopsis menggunakan **Node.js**, **Express.js**, dan **Supabase**. API menyediakan fitur autentikasi pengguna menggunakan JWT serta manajemen daftar film favorit.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* Supabase (PostgreSQL Database)
* JWT (Authentication)
* bcryptjs (Password Hashing)
* Joi (Validation)
* ESLint (Code Linting)
* Prettier (Code Formatter)

---

## ✨ Features

### Authentication

* Register User
* Login User
* Get User Profile
* JWT Authentication & Authorization

### Movies

* Get Popular Movies
* Get Movie Detail

### Favorites

* Add Movie to Favorites
* Get Favorite Movies
* Check Favorite Status
* Remove Movie from Favorites

---

## 📁 Project Structure

```text
config/
controllers/
middleware/
routes/
services/
utils/
validation/
server.js
```

---

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/faiztzy/film-backend.git
cd film-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

JWT_SECRET=your_secret_key

TMDB_API_KEY=your_tmdb_api_key
```

### 4. Run Server

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm start
```

---

## 🔐 Authentication Endpoints

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

### Profile

```http
GET /api/auth/profile
```

---

## 🎥 Movie Endpoints

### Get Popular Movies

```http
GET /api/movies/popular
```

### Get Movie Detail

```http
GET /api/movies/:id
```

Contoh:

```http
GET /api/movies/157336
```

---

## ❤️ Favorite Endpoints

### Get Favorite Movies

```http
GET /api/favorites
```

### Add Movie to Favorites

```http
POST /api/favorites
```

Request Body:

```json
{
  "movie_id": 157336
}
```

### Check Favorite Status

```http
GET /api/favorites/check/:movie_id
```

Contoh:

```http
GET /api/favorites/check/157336
```

Response:

```json
{
  "isFavorite": true
}
```

### Remove Movie from Favorites

```http
DELETE /api/favorites/:movie_id
```

Contoh:

```http
DELETE /api/favorites/157336
```

---

## 📝 Notes

* Semua endpoint Favorites memerlukan JWT Token.
* Data film diambil dari TMDB API.
* Password disimpan dalam bentuk hash menggunakan bcryptjs.
* Validasi request menggunakan Joi.
* Database menggunakan Supabase PostgreSQL.

---

## 👨‍💻 Author

Developed for Film Recommendation System Capstone Project.
