const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
  // groupadmin: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // }
});

module.exports = group;