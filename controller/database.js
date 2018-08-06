const mysql = require('mysql');
const db_config=require('../config/database.json');
const db = mysql.createPool({
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database,
    connectionLimit : 50
});

module.exports = db;