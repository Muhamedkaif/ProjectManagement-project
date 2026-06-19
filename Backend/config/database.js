const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config({ override: true });

const dbName = process.env.DB_NAME || 'project_management';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 3306;

// Function to ensure the database exists before establishing Sequelize connection
async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`Database "${dbName}" checked/created successfully.`);
  } catch (error) {
    console.error('Error ensuring database exists:', error.message);
  }
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true // adds createdAt and updatedAt columns to all tables automatically
  }
});

module.exports = {
  sequelize,
  ensureDatabaseExists
};
