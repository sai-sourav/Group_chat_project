const express = require('express');
const route = express.Router();
const grpcontroller = require('../controllers/grpcontroller');
const Authorization = require('../middlewares/auth');

route.post("/group", Authorization.authenticate, grpcontroller.creategroup);

route.get("/group", Authorization.authenticate, grpcontroller.getgroups);

module.exports = route;