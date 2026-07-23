const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'resume_db', // db name
    'root', // username
    'root@123', // password
    {
        host: 'localhost', // db host name
        dialect: 'mysql', // sqlite, postgres, sqlite
        port: 3306
    }
);

module.exports = sequelize;