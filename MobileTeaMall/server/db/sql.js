const mysql = require('mysql')
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // 登录个人数据库
    password: '123456',
    database: 'vue_store'
})
module.exports = connection;