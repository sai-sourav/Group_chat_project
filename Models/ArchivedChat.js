const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const archivegrpmsg = sequelize.define('ArchivedChat', {
  archiveid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  id: {
    type: Sequelize.INTEGER
  },
  msg: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  filename: {
    type: Sequelize.STRING
  }
});

module.exports = archivegrpmsg;