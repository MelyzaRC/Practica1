const mysql = require('mysql');
const router = require('./routes/consultas');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jm1411',
    database: 'practica1Archivos'
});

mysqlConnection.connect(function (err){
    if (err){
        console.log(err);
        return;
    }else{
        console.log('Connected');
    }
});



module.exports = mysqlConnection; 

