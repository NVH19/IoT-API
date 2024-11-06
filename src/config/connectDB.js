const { createConnection } = require('mysql2');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'iot'
});

module.exports = connection;