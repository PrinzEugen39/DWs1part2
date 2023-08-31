# DWs1part2
part 2 dari butkemf stage 1 DumbWays

# Sequelize 
1. Init Sequelize:
    npx sequelize-cli init
2. Create Database (using config for determine db name):
    npx sequelize-cli db:create
3. Generate Model:
    npx sequelize-cli model:generate --name project --attributes name:string (untuk field lainnya bisa langsung edit di modelnya nanti)
4. Menjalankan Migrate:
    npx sequelize-cli db:migrate
5. Membatalkan/Undo Migrate:
    npx sequelize-cli db:migrate:undo
6. Membuat Seeder:
    npx sequelize-cli seed:generate --name dummy-projects
7. Menjalankan Seeder:
    npx sequelize-cli db:seed:all
8. Membatalkan/Undo Seeder:
    npx sequelize-cli db:seed:undo

# Auth, Session, Encription
1. Autentikasi:
Autentikasi adalah proses untuk memverifikasi identitas pengguna, yaitu memastikan bahwa pengguna yang mencoba mengakses suatu sistem atau layanan adalah pengguna yang sah. Ini dapat melibatkan penggunaan nama pengguna dan kata sandi, token, atau metode otentikasi lainnya untuk memberikan izin akses.

2. Enkripsi:
Enkripsi adalah proses mengubah informasi menjadi bentuk yang tidak dapat dibaca atau dimengerti, kecuali oleh pihak yang memiliki kunci dekripsi yang sesuai. Ini digunakan untuk melindungi data sensitif selama penyimpanan atau transmisi, sehingga bahkan jika data dicuri, pihak yang tidak berwenang tidak dapat membacanya.

3. Session:
Sesi adalah cara untuk melacak keadaan pengguna saat berinteraksi dengan aplikasi web. Informasi tentang sesi ini disimpan di server, dan sepotong data unik (biasanya ID sesi) disimpan di cookie pada sisi klien. Ini memungkinkan pengguna untuk tetap terautentikasi selama sesi mereka dan mengakses informasi yang relevan.

4. Cookies:
Cookies adalah fragmen data kecil yang disimpan di sisi klien (browser) saat pengguna berinteraksi dengan situs web. Cookies dapat digunakan untuk menyimpan informasi seperti preferensi pengguna, riwayat sesi, dan lainnya. Mereka juga sering digunakan untuk tujuan pelacakan.