const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const grpmsg = sequelize.define('grpmessage', {
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

module.exports = grpmsg;