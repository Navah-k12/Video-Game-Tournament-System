
const mysql = require('mysql2');

mysql.createConnection({
    host: '127.0.0.1',
    user: 'nava',
    password: 'nava1234',
    database: 'SistemaTorneos'
});

db.connection((Error) =>{
    if(Error){
        console.error('Error en la conneción en la BD: ',Error)
        return;
    }
    else{
        console.log("Conectado Exitosamente")
    }

});