// db.js

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();
// export const elephantPool = new Pool({
//   connectionString: process.env.ELEPHANT_URL, // Use your ElephantSQL URL here
// });
// // export const pool = new Pool({
// //   connectionString: process.env.POSTGRES_URL,
// // });

// elephantPool.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to PostgreSQL");
// });
// for local at laptop
// export const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   logging: console.log,
// });
// export const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.POSTGRES_HOST, // Use Vercel environment variable
//   username: process.env.POSTGRES_USER, // Use Vercel environment variable
//   password: process.env.POSTGRES_PASSWORD, // Use Vercel environment variable
//   database: process.env.POSTGRES_DATABASE, // Use Vercel environment variable
//   port: process.env.POSTGRES_PORT, // Use Vercel environment variable
//   logging: console.log,
// });

//planeta.com
export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Use this line if you're having SSL issues
    },
  },
  logging: console.log,
});

// ... rest of the Sequelize configuration
