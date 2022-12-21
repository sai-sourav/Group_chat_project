const express = require('express');
const route = express.Router();
const msgcontroller = require('../controllers/msgcontroller');
const Authorization = require('../middlewares/auth');

route.post("/message", Authorization.authenticate, msgcontroller.postmessages);

module.exports = route;