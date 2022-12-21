const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const msg = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  msg: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = msg;