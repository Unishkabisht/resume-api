// `id` int NOT NULL AUTO_INCREMENT,
// `name` varchar(255) DEFAULT not NULL,
// `email` varchar(255) DEFAULT not NULL UNIQUE KEY,
// PRIMARY KEY (`id`),
// UNIQUE KEY `email` (`email`)
// );
// Migrations
// seeding

const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 6
        }
    }
}, {
    timestamps: true,
});

// password: password+salt
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.associate = (models) => {
    User.hasMany(models.Resume, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
    });
};

module.exports = User;