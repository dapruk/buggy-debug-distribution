# Dokumentasi Sistem BITEUK POS & Werhos

## 1. Project Overview

BITEUK POS & Werhos adalah aplikasi web komprehensif yang didesain buat bisnis ritel skala kecil sampai menengah. Aplikasi ini ngegabungin manajemen inventaris gudang sama sistem Point of Sale (POS), jadi bisa tracking stok secara real-time, proses penjualan, dan manage vendor.

Sistem ini dibangun supaya bisa handle transaksi volume tinggi tapi tetep jaga konsistensi data antara stok fisik di gudang dan terminal penjualan di depan.

## 2. System Architecture

### Frontend
- **Framework**: React 19 dengan React Router 7
- **Styling**: Tailwind CSS dengan komponen Shadcn UI
- **State Management**: TanStack Query (React Query) buat sinkronisasi server state
- **Build Tool**: Vite

### Backend
- **Platform**: Supabase (PostgreSQL)
- **API Layer**: Auto-generated REST API dan fungsi Custom RPC (Remote Procedure Calls)
- **Authentication**: Supabase Auth (dikonfigurasi buat akses staf internal)

## 3. Database Schema

Database-nya dinormalisasi buat pastiin integritas data, dengan desain khusus biar performa dan fleksibilitasnya oke.

### Core Entities

#### `vendors` (Pemasok)
Representasi supplier eksternal.
- `id`: UUID (PK)
- `code`: Unique text identifier (contoh: "VEN-001")
- `name`: Nama vendor
- `is_active`: Status boolean

#### `products` (Produk)
Katalog barang yang bisa dijual.
- `id`: UUID (PK)
- `sku`: Stock Keeping Unit identifier
- `name`: Nama display produk
- `price`: Harga jual dasar
- `is_active`: Status boolean

#### `warehouse_stock` (Stok Gudang)
Tracking level inventaris buat produk, spesifik per vendor.
- `id`: UUID (PK)
- `product_id`: FK ke `products`
- `vendor_code`: Referensi text ke `vendors.code` (Loose coupling biar fleksibel)
- `quantity`: Level stok saat ini

#### `pos_transactions` (Transaksi POS)
Record penjualan yang udah selesai.
- `id`: UUID (PK)
- `created_at`: Timestamp
- `total_price`: Total amount transaksi

#### `pos_transaction_items` (Item Transaksi POS)
Line item buat tiap transaksi.
- `id`: UUID (PK)
- `transaction_id`: FK ke `pos_transactions`
- `product_id`: FK ke `products`
- `quantity`: Unit terjual
- `price`: Harga satuan pas penjualan

#### `customers` (Pelanggan)
Database pelanggan toko.
- `id`: UUID (PK)
- `name`: Nama lengkap
- `phone_number`: Nomor telepon
- `email`: Alamat email
- `is_active`: Status aktif

#### `user_settings` (Pengaturan User)
Simulasi tabel user profile.
- `id`: UUID (PK)
- `user_id`: ID User (simulasi)
- `full_name`: Nama lengkap
- `email`: Email login
- `role`: Role akses (cashier/manager/admin)

## 4. Core Modules & Features

### 🏭 Warehouse Management
*Route Prefix: `/warehouse`*

- **Product Import**: Masukin data inventaris massal via upload CSV. Parsing kode vendor dan level stok buat update tabel `warehouse_stock`.
- **Stock Monitoring**: View level inventaris secara real-time, dikelompokkan by product dan vendor.
- **Vendor Reporting**: View agregat nilai stok dan distribusi per vendor.

### 🏪 Point of Sale (POS)
*Route Prefix: `/pos`*

- **Digital Catalog**: UI yang searchable buat staf sales browsing produk.
- **Transaction Processing**: Manajemen cart dan workflow checkout. Pake database transactions buat pastiin stok cuma berkurang kalau penjualan sukses kecatat.
- **Stock Validation**: Cek sebelum checkout buat cegah penjualan barang yang stoknya habis atau dari vendor yang gak aktif.

### ⚙️ System Administration
*Route Prefix: `/settings`*

- **Catalog Sync**: Trigger manual buat sinkronisasi cache aplikasi lokal sama server-side state terbaru, biar harga dan ketersediaan tetep up-to-date.
- **User Profile**: Manage detail user (nama, email).
- **Role Switcher**: Simulasi ganti role user (Cashier, Manager, Admin).

### 👥 Customer Management
*Route Prefix: `/customers`*

- **Customer List**: View dan search database customer.
- **Customer Details**: View profil customer (simulasi).

### 📊 Dashboard
*Route Prefix: `/dashboard`*

- **Overview**: View metrik kunci (Revenue, Transaksi, Top Products).

## 5. Key Workflows

### Inventory Ingestion
1.  User upload file CSV isinya `SKU`, `Vendor Code`, dan `Quantity`.
2.  Sistem parsing file dan validasi format.
3.  Data di-upsert ke `warehouse_stock`.

### Sales Transaction
1.  Staf tambah item ke cart dari **Catalog**.
2.  Sistem validasi ketersediaan stok secara real-time.
3.  Pas checkout, fungsi RPC `create_pos_transaction` dipanggil.
4.  Fungsi ini secara atomik:
    -   Bikin record `pos_transactions`.
    -   Bikin record `pos_transaction_items`.
    -   Kurangin `warehouse_stock`.

### Vendor Management
- Vendor dimanage via backend (Supabase Dashboard) atau proses import.
- Vendor yang gak aktif (`is_active = false`) otomatis difilter keluar dari katalog POS biar gak ada order dari sumber yang udah discontinue.
