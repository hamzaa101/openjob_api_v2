# OpenJob RESTful API V2

OpenJob RESTful API V1 adalah RESTful API sederhana untuk aplikasi rekrutmen internal perusahaan. API ini dibuat menggunakan Node.js, Express.js, PostgreSQL, node-pg-migrate, Joi, JWT, bcrypt, dan multer.

## Fitur Utama

* Register dan get user profile by ID
* Login, refresh token, dan logout
* CRUD companies
* CRUD categories
* CRUD jobs
* Search jobs berdasarkan title dan company-name
* Applications
* Bookmarks
* Profile user login
* Documents upload
* PostgreSQL database dengan migration
* Authentication menggunakan JWT Bearer Token
* Data validation menggunakan Joi
* Error handling middleware
* Upload dokumen PDF maksimal 5 MB
* Redis Caching
* RabbitMQ message queue
* Email notification consumer dengan Nodemailer

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* node-pg-migrate
* Joi
* bcrypt
* jsonwebtoken
* multer
* dotenv

## Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```env
HOST=localhost
PORT=3000

PGUSER=postgres
PGPASSWORD=
PGDATABASE=openjob_api_v1
PGHOST=localhost
PGPORT=5432

ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
```

## Instalasi

```bash
npm install
```

## Membuat Database

Buat database PostgreSQL:

```sql
CREATE DATABASE openjob_api_v1;
```

## Menjalankan Migration

```bash
npm run migrate:up
```

Rollback migration:

```bash
npm run migrate:down
```

## Menjalankan Server

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run start
```

Server berjalan pada:

```text
http://localhost:3000
```

## Testing

Import Postman Collection dan Postman Environment yang disediakan oleh Dicoding.

Pastikan environment menggunakan port:

```text
3000
```

Jalankan collection sesuai urutan tanpa mengubah urutannya.
