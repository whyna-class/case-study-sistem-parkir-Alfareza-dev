# 🚗 Parking API – NestJS + Prisma + MySQL

API sederhana untuk sistem parkir menggunakan **NestJS**, **Prisma ORM**, dan **MySQL**.
Fitur:

- Create data parkir
- Update durasi & total otomatis
- Hapus data parkir
- Hitung total pendapatan
- Search, filter, dan pagination

---

## 📦 **1. Tech Stack**

- **NestJS** (Framework Backend)
- **Prisma ORM** (Database ORM)
- **MySQL** (Database)
- **TypeScript**

---

# ⚙️ **2. Cara Instalasi**

Pastikan kamu sudah menginstal:

- Node.js ≥ v18
- MySQL berjalan di lokal (port default 3306)

---

## 🔧 **Step-by-step**

### **1. Clone Project**

```bash
git clone https://github.com/whyna-class/case-study-sistem-parkir-Alfareza-dev.git
cd parking-api
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Setup Environment**

Buat file `.env`:

```
DATABASE_URL="mysql://root@localhost:3306/parking"

JWT_KEY=user123
JWT_EXPIRATION=1440
BASIC_AUTH_USERNAME=user
BASIC_AUTH_PASSWORD=admin
```

> Pastikan database `parking` sudah dibuat.

Jika belum, buat dengan:

```bash
mysql -u root -p -e "CREATE DATABASE parking;"
```

---

### **4. Generate Prisma Client**

```bash
npx prisma generate
```

### **5. Jalankan Migrasi (jika ada perubahan schema)**

```bash
npx prisma migrate dev --name init
```

---

### **6. Jalankan Aplikasi**

```bash
npm run start:dev
```

By default aplikasi berjalan di:

```
http://localhost:3000
```

---

# 📚 **3. Endpoint API (Postman Ready)**

Base URL:

```
http://localhost:3000
```

---

## 🔵 **1. Create Parkir**

**POST /parkir**

**Body (JSON)**:

```json
{
  "plat_nomor": "L1234AB",
  "jenis_kendaraan": "roda2",
  "durasi": 3
}
```

---

## 🟢 **2. Get Semua Parkir**

**GET /parkir**

Support:

- Pagination → `?page=1&limit=10`
- Search → `?search=L12`
- Filter jenis → `?jenis_kendaraan=roda4`

Contoh:

```
GET /parkir?page=1&limit=5&search=L1
```

---

## 🟠 **3. Get Parkir by ID**

**GET /parkir/:id**

Contoh:

```
GET /parkir/1
```

---

## 🟣 **4. Update Parkir**

**PATCH /parkir/:id**

Update durasi atau jenis kendaraan:

```json
{
  "durasi": 5
}
```

---

## 🔴 **5. Hapus Parkir**

**DELETE /parkir/:id**

Contoh:

```
DELETE /parkir/1
```

---

## 💰 **6. Total Pendapatan**

**GET /parkir/total/pendapatan**

Response:

```json
{
  "total_pendapatan": 14000
}
```

---

# 🗂️ **4. Struktur Folder**

```
src/
│── app.module.ts
│── main.ts
│── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
│── parking/
│   ├── parking.controller.ts
│   ├── parking.service.ts
│   ├── dto/
│   │   ├── create-parking.dto.ts
│   │   └── update-parking.dto.ts
```

---

# 🛠️ **5. Prisma Schema**

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum jenisKendaraan {
  RODA2
  RODA4
}

model Parking {
  id             Int            @id @default(autoincrement())
  platNomor      String
  jenisKendaraan jenisKendaraan
  entryTime      DateTime
  exitTime       DateTime?
  durasi         Int?
  total          Int?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}
```

---

# ✅ **6. Menjalankan Prisma Studio (Optional)**

Untuk melihat data di database lewat UI:

```bash
npx prisma studio
```

---

# 🎉 **7. Selesai!**

API sudah siap dijalankan dan dites melalui Postman.
