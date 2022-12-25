const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const groupmember = sequelize.define('groupmember', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  isadmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = groupmember;