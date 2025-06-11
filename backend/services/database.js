require('dotenv').config();
const mysql = require('mysql2');

const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'cc241059'
});

config.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the database!');
})

module.exports = {config}