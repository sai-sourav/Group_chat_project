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
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "msg"
  },
  filename: {
    type: Sequelize.STRING
  }
});

module.exports = grpmsg;