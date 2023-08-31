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

