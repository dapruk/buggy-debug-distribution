# Laporan Keluhan Pengguna (User Reports)

Berikut adalah daftar keluhan yang masuk dari pengguna di lapangan. Silakan investigasi penyebab masalahnya.

---

## Tiket #001
**Dari**: Admin Gudang (WhatsApp)
**Prioritas**: Normal
> "Mas, ini saya coba pakai template excel yang baru didownload (`inventory.csv`) terus saya masukin data data yang mau diimport. Pas saya upload balik, kok **SEMUA** baris vendornya 'undefined' ya? Padahal saya gak ubah apa-apa lho, cuma isi data doang. Terus itu yang 'Gaming Headset' kok stoknya cuma 1? Perasaan saya ketik 10 deh."

**Lampiran Screenshot**:
Halaman *Import Preview*. Semua baris pada kolom Vendor bertuliskan "undefined". Baris "Gaming Headset" menampilkan Quantity: 1.

---

## Tiket #002
**Dari**: Staff Gudang (Email)
**Prioritas**: High
> "Siang tim IT. Lanjutan yang tadi, setelah saya paksa import (walaupun vendor undefined), barangnya masuk ke list produk. TAPI... kolom Vendor-nya kosong semua! Padahal di database harusnya ada kan? Tolong dicek, saya butuh liat nama vendornya."

**Lampiran Screenshot**:
Halaman *Product List*. Seluruh baris produk menampilkan kolom Vendor yang kosong atau strip (-).

---

## Tiket #003
**Dari**: Purchasing (Telepon)
**Prioritas**: High
> "Halo, saya lagi liat stok punya vendor 'OfficeComfort Ltd'. Kok total barangnya dikit banget? Perasaan kita punya stok kursi banyak deh dari mereka, tapi di sini gak muncul. Coba refresh datanya dong, kayaknya gak update."

**Lampiran Screenshot**:
Halaman *Vendor Stock View*. Kartu vendor "OfficeComfort Ltd" menampilkan total item yang sangat sedikit (misal: 5), padahal seharusnya lebih banyak.

---

## Tiket #004
**Dari**: Kasir 1 (Video Call)
**Prioritas**: Critical
> "Mbak, ini pencarian di kasir error ya? Saya ketik 'Desk', tapi gambarnya masih gambar kursi semua. Harus saya refresh browser dulu baru bener. Ribet banget kalau lagi rame."

**Lampiran Screenshot**:
Halaman *POS Catalog*. Kolom pencarian berisi kata "Desk", tapi produk yang tampil masih campur aduk (tidak terfilter).

---

## Tiket #005
**Dari**: Kasir 2 (Laporan Harian)
**Prioritas**: Critical
> "Pak, stok di sistem kasir kok gak berkurang otomatis ya? Barusan saya udah jual 'Mesh Task Chair' 3 biji, transaksinya sukses. Tapi pas saya cek lagi, stoknya masih utuh. Nanti stok fisik sama komputer jadi selisih lho."

**Lampiran Screenshot**:
Halaman *POS Catalog* dengan notifikasi "Transaction Success", tapi angka stok pada produk yang baru dibeli masih menunjukkan angka lama.

---

## Tiket #006
**Dari**: Supervisor (Chat)
**Prioritas**: Low
> "Tampilan detail transaksi yang terakhir kok berantakan? Tabelnya miring-miring, ada kolom yang kosong/ngaco isinya. Susah bacanya."

**Lampiran Screenshot**:
Halaman *Transaction Detail*. Header tabel dan isi tabel tidak sejajar (misal: header 'Availability' ada tapi isinya kosong atau geser).

---

## Tiket #007
**Dari**: Manager (Email)
**Prioritas**: Critical
> "Kenapa kita masih bisa order barang dari 'Discontinued Partner'? Kan mereka udah tutup dan statusnya non-aktif. Barusan anak-anak bilang di sistem statusnya 'Ready to Ship'. Bahaya ini."

**Lampiran Screenshot**:
Halaman *Stock Validation*. Produk dari vendor non-aktif menampilkan status validasi hijau/sukses.

---

## Tiket #008
**Dari**: Admin Sistem (Chat)
**Prioritas**: Normal
> "Mas, fitur Sync Katalog itu beneran jalan gak sih? Tulisannya 'Success', tapi saya cek ada beberapa harga produk yang belum update. Jangan-jangan cuma tulisan sukses doang?"

**Lampiran Screenshot**:
Halaman *Catalog Sync*. Pesan sukses besar "Sync Completed", tapi mungkin ada indikasi data tidak berubah.

---

## Tiket #009
**Dari**: Finance (Komplain)
**Prioritas**: High
> "Saya mau tarik laporan vendor, filternya gak jalan. Saya ganti tanggal atau ganti vendor ke 'TechSupplies Inc', angkanya gak berubah. Harus klik berkali-kali baru bener. Bikin salah laporan nih."

**Lampiran Screenshot**:
Halaman *Vendor Report*. Form filter menunjukkan kriteria tertentu (misal: TechSupplies Inc), tapi hasil laporan menampilkan data yang tidak sesuai (misal: data vendor lain atau data lama).

---

## Tiket #010
**Dari**: Head of Warehouse (Urgent)
**Prioritas**: Critical
> "Gawat mas, ini database error kah? Saya buka list produk, SEMUA produk vendornya jadi 'Unknown Vendor'. Tadi pagi perasaan aman."

**Lampiran Screenshot**:
Halaman *Product List*. Seluruh baris pada kolom Vendor menampilkan "Unknown Vendor".

---

## Tiket #011
**Dari**: Audit Internal (Memo)
**Prioritas**: Critical
> "Temuan: Sistem POS mengizinkan transaksi untuk item dari vendor non-aktif ('Discontinued Partner'). Mohon segera diperbaiki validasinya."

**Lampiran Screenshot**:
Bukti transaksi sukses yang berisi barang dari vendor non-aktif.

---

## Tiket #012
**Dari**: IT Support (Log)
**Prioritas**: Normal
> "User komplain data gak update. Saya cek log sync statusnya 'success' terus, padahal user bilang barangnya gak berubah. Coba cek logic sync-nya."

**Lampiran Screenshot**:
Log sync yang menunjukkan status sukses berulang-ulang.

---

## Tiket #013
**Dari**: Sales Lapangan (Chat)
**Prioritas**: High
> "Bos, aplikasi di HP ngaco. Saya cek barang di gudang kosong, tapi di HP tulisannya 'In Stock' warna ijo. Malu saya udah janjiin ke klien barang ada."

**Lampiran Screenshot**:
Tampilan *Mobile View* di HP. Badge status stok berwarna hijau "In Stock", padahal stoknya 0.

---

## Tiket #014
**Dari**: Sales Manager (Email)
**Prioritas**: Low
> "Tampilan stok di HP kok selalu 'In Stock' warna hijau ya? Padahal barangnya abis. Di laptop bener 'Out of Stock'. Bahaya nih kalau sales janjiin barang ada padahal kosong."

**Lampiran Screenshot**:
Tampilan mobile list produk. Badge status berwarna hijau "In Stock" untuk produk dengan stok 0.

---

## Tiket #015
**Dari**: Admin Customer (Chat)
**Prioritas**: High
> "List customer kok aneh ya? Kolom 'Phone' kosong semua (No Phone), padahal pas input data nomornya ada. Terus statusnya 'Inactive' semua merah, padahal user baru daftar."

**Lampiran Screenshot**:
Halaman *Customer List*. Kolom Phone berisi "No Phone", kolom Status berisi "Inactive" warna merah untuk semua baris.

---

## Tiket #016
**Dari**: Admin Customer (Chat)
**Prioritas**: Normal
> "Fitur search customer gak enak banget. Saya cari 'budi' gak ketemu, harus ketik 'Budi' (huruf besar) baru muncul. Tolong dibikin fleksibel dong."

**Lampiran Screenshot**:
Halaman *Customer List*. Search bar berisi "budi", tabel kosong.

---

## Tiket #017
**Dari**: User (Feedback Form)
**Prioritas**: Critical
> "Saya mau ganti nama di profil, tapi gak bisa diketik! Keyboard saya rusak atau aplikasinya yang nge-lag? Kolomnya kayak terkunci."

**Lampiran Screenshot**:
Halaman *User Profile*. Input "Full Name" sedang difokuskan tapi tidak ada perubahan teks.

---

## Tiket #018
**Dari**: User (Email)
**Prioritas**: High
> "Saya udah ganti email 3 kali, pas diklik Save sukses. Tapi pas saya refresh, balik lagi ke email lama. Gimana sih?"

**Lampiran Screenshot**:
Halaman *User Profile*. Menampilkan email lama setelah proses save sukses.

---

## Tiket #019
**Dari**: CEO (Direct Message)
**Prioritas**: Low
> "Dashboard kita kok tanggalnya ngaco? Hari ini masih Minggu, tapi di situ tulisannya 'Last Updated: Monday'. Kita servernya di masa depan ya?"

**Lampiran Screenshot**:
Halaman *Dashboard*. Teks "Last Updated: [Hari Esok]".

---

## Tiket #020
**Dari**: Finance (Urgent)
**Prioritas**: Critical
> "Laporan Revenue di Dashboard SALAH BESAR! Masa kita jual 100 item harganya cuma segitu? Kayaknya dia cuma itung harga satuan deh, gak dikali jumlah terjual. Rugi dong laporan kita."

**Lampiran Screenshot**:
Halaman *Dashboard*. Card "Total Revenue" menampilkan angka yang sangat kecil tidak masuk akal.

---

## Tiket #021
**Dari**: Store Manager (Ticket)
**Prioritas**: Normal
> "Saya ganti role jadi 'Manager' di menu settings. Pas refresh page, balik lagi jadi 'Cashier'. Capek harus ganti-ganti terus tiap login."

**Lampiran Screenshot**:
Halaman *Role Switcher*. Dropdown menampilkan "Cashier" padahal baru saja diganti.

---

## Tiket #022
**Dari**: Manager Budi (Laporan Langsung)
**Prioritas**: Low
> "Pas mau ganti kota di edit profile, list kotanya muncul tapi gak bisa discroll. Kalau mau pilih kota yang di bawah susah banget. Terus kadang pas klik di luar listnya gak mau nutup."

**Lampiran Screenshot**:
User shows stuck scrollbar in city dropdown.
