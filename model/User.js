const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("users", {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
	username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
	refreshToken: {
		type: Sequelize.STRING,
	},
}, {
	freezeTableName: true,
	tableName: "user",
	underscored: true,
});

module.exports = User;