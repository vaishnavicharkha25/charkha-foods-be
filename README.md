# Backend Project (Node.js + TypeScript + Sequelize)

This is a backend server setup using **Node.js**, **Express**, **Sequelize (with Sequelize CLI)**, and **TypeScript**.

## 📦 Installation

```bash
npm install
```

## 🌐 Environment Setup
#### Create an .env.development file in the project root:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_DIALECT=mysql
DATABASE_NAME=
DATABASE_USER=root
DATABASE_PASSWORD=
NODE_ENV=development
FILE_UPLOAD_DESTINATION_PATH=uploads
```

## ⚙️ Sequelize Setup
```bash
npx sequelize-cli init
```

Move them to src/database/... and update your .sequelizerc:
```bash
const path = require('path');

module.exports = {
    config: path.resolve('dist', 'database', 'config', 'database.js'),
    'models-path': path.resolve('dist', 'database', 'models'),
    'seeders-path': path.resolve('dist', 'database', 'seeders'),
    'migrations-path': path.resolve('dist', 'database', 'migrations')
};
```

## 🚀 Scripts

#### Development & Build
```bash
npm run dev             # Start dev server with nodemon
npm run tsc             # Compile TS
npm run tsc-watch       # Compile TS in watch mode
```

#### Sequelize CLI
```bash
npm run dev-migrate-up       # Run migrations
npm run dev-migrate-down     # Undo last migration
npm run dev-migrate-down-all # Undo all
npm run dev-seed-up          # Run seeders
npm run dev-seed-down        # Undo last seeder
npm run dev-seed-down-all    # Undo all seeders
```