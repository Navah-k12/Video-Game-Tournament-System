


const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')}); // Carga las variables del archivo .env

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.getConnection()
    .then(connection => {
        console.log('¡Conectado exitosamente a la base de datos SistemaTorneos desde .env!');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = db;

