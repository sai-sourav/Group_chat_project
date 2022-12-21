const express = require('express');
const route = express.Router();
const msgcontroller = require('../controllers/msgcontroller');
const Authorization = require('../middlewares/auth');

route.post("/message", Authorization.authenticate, msgcontroller.postmessages);

route.get("/message", Authorization.authenticate, msgcontroller.getmessages);

module.exports = route;