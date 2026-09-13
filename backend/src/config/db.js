
const mysql = require('mysql2/promise');


const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'nava1234',
    database: 'SistemaTorneos'
});

db.getConnection()
    .then(connection => {
        console.log('¡Conectado exitosamente a la base de datos SistemaTorneos!');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = db;